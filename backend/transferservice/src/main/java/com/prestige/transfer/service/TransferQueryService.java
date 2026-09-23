package com.prestige.transfer.service;

import com.prestige.transfer.domain.*;
import com.prestige.transfer.dto.*;
import com.prestige.transfer.exception.ApiException;
import com.prestige.transfer.repository.*;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.*;
import java.util.*;
import com.prestige.transfer.domain.enums.TransactionType;
import com.prestige.transfer.domain.enums.TransferStatus;
import java.time.temporal.TemporalAdjusters;

@Service
public class TransferQueryService {
    private final FundTransferRepository transfers;
    private final AccountRepository accounts;
    private final TransactionDetailRepository transactions;

    public TransferQueryService(FundTransferRepository transfers, AccountRepository accounts,
            TransactionDetailRepository transactions) {
        this.transfers = transfers;
        this.accounts = accounts;
        this.transactions = transactions;
    }

    public TransferResponse findTransfer(Long customerId, String referenceNumber) {
        FundTransfer transfer = transfers.findByReferenceNumber(referenceNumber).orElseThrow(
                () -> new ApiException(HttpStatus.NOT_FOUND, "TRANSFER_NOT_FOUND", "Transfer was not found."));
        if (!accounts.existsByAccountNumberAndCustomerId(transfer.getSourceAccountNumber(), customerId)
                && !accounts.existsByAccountNumberAndCustomerId(transfer.getDestinationAccountNumber(), customerId))
            throw new ApiException(HttpStatus.FORBIDDEN, "ACCOUNT_NOT_OWNED",
                    "Transfer is not accessible to customer.");
        return new TransferResponse(transfer.getTransferId(), transfer.getReferenceNumber(), transfer.getStatus(),
                transfer.getAmount(), transfer.getCompletedAt());
    }

    public TransactionPageResponse activity(Long customerId, String accountNumber, String movement,
            LocalDateTime from, LocalDateTime to, int page, int size) {
        if (!accounts.existsByAccountNumberAndCustomerId(accountNumber, customerId))
            throw new ApiException(HttpStatus.FORBIDDEN, "ACCOUNT_NOT_OWNED", "Account is not owned by customer.");
        TransactionType type = movementType(movement);
        if (from != null && to != null && from.isAfter(to))
            throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_DATE_RANGE", "from must be before to.");
        Pageable pageable = PageRequest.of(page, size);
        Page<TransactionDetail> result;
        if (from == null && to == null) {
            result = type == null
                    ? transactions.findByAccountNumberOrderByTransactionAtDesc(accountNumber, pageable)
                    : transactions.findByAccountNumberAndTransactionTypeOrderByTransactionAtDesc(
                            accountNumber, type, pageable);
        } else {
            result = transactions.findActivity(accountNumber, type, from, to, pageable);
        }
        List<TransactionResponse> items = result.getContent().stream()
                .map(t -> new TransactionResponse(t.getTransactionId(), t.getReferenceNumber(), movement(t.getTransactionType()), t.getTransactionType(),
                        t.getTransactionAmount(), t.getTransactionAt(), t.getRemarks()))
                .toList();
        return new TransactionPageResponse(accountNumber, items, page, size, result.getTotalElements(),
                result.getTotalPages());
    }

    public AnalyticsResponse analytics(Long customerId, String accountNumber, int months) {
        if (!accounts.existsByAccountNumberAndCustomerId(accountNumber, customerId))
            throw new ApiException(HttpStatus.FORBIDDEN, "ACCOUNT_NOT_OWNED", "Account is not owned by customer.");
        if (months < 1 || months > 24)
            throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_MONTHS", "months must be between 1 and 24.");

        Account account = accounts.findById(accountNumber).orElseThrow(
                () -> new ApiException(HttpStatus.NOT_FOUND, "ACCOUNT_NOT_FOUND", "Account was not found."));
        LocalDateTime now = LocalDateTime.now();
        LocalDate today = now.toLocalDate();
        YearMonth currentMonth = YearMonth.from(today);
        YearMonth firstMonth = currentMonth.minusMonths(months - 1);
        LocalDateTime historyStart = firstMonth.atDay(1).atStartOfDay();
        List<TransactionDetail> history = transactions.findCompletedActivity(
                accountNumber, historyStart, now.plusNanos(1), TransferStatus.COMPLETED);

        Map<YearMonth, BigDecimal> monthlyNet = new HashMap<>();
        Map<YearMonth, BigDecimal> monthlyWithdrawals = new HashMap<>();
        for (TransactionDetail transaction : history) {
            YearMonth month = YearMonth.from(transaction.getTransactionAt());
            BigDecimal amount = transaction.getTransactionAmount();
            monthlyNet.merge(month, transaction.getTransactionType() == TransactionType.CREDIT ? amount : amount.negate(), BigDecimal::add);
            if (transaction.getTransactionType() == TransactionType.DEBIT)
                monthlyWithdrawals.merge(month, amount, BigDecimal::add);
        }

        List<AnalyticsResponse.MonthlyExpensePoint> expenses = new ArrayList<>();
        List<AnalyticsResponse.BalanceHistoryPoint> balances = new ArrayList<>();
        BigDecimal laterNet = BigDecimal.ZERO;
        for (int offset = 0; offset < months; offset++) {
            YearMonth month = currentMonth.minusMonths(offset);
            if (offset > 0) laterNet = laterNet.add(monthlyNet.getOrDefault(currentMonth.minusMonths(offset - 1), BigDecimal.ZERO));
            balances.add(new AnalyticsResponse.BalanceHistoryPoint(month, account.getAvailableBalance().subtract(laterNet)));
        }
        Collections.reverse(balances);
        for (int offset = 0; offset < months; offset++) {
            YearMonth month = firstMonth.plusMonths(offset);
            expenses.add(new AnalyticsResponse.MonthlyExpensePoint(month, monthlyWithdrawals.getOrDefault(month, BigDecimal.ZERO)));
        }

        LocalDate weeklyStart = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate weeklyEnd = weeklyStart.plusDays(6);
        Map<LocalDate, BigDecimal> deposits = new HashMap<>();
        Map<LocalDate, BigDecimal> withdrawals = new HashMap<>();
        for (TransactionDetail transaction : history) {
            LocalDate date = transaction.getTransactionAt().toLocalDate();
            if (date.isBefore(weeklyStart) || date.isAfter(weeklyEnd)) continue;
            Map<LocalDate, BigDecimal> target = transaction.getTransactionType() == TransactionType.CREDIT ? deposits : withdrawals;
            target.merge(date, transaction.getTransactionAmount(), BigDecimal::add);
        }
        List<AnalyticsResponse.WeeklyActivityPoint> weekly = new ArrayList<>();
        for (int day = 0; day < 7; day++) {
            LocalDate date = weeklyStart.plusDays(day);
            weekly.add(new AnalyticsResponse.WeeklyActivityPoint(date, deposits.getOrDefault(date, BigDecimal.ZERO), withdrawals.getOrDefault(date, BigDecimal.ZERO)));
        }
        return new AnalyticsResponse(accountNumber, weekly, expenses, balances);
    }

    private TransactionType movementType(String movement) {
        if (movement == null || movement.isBlank()) return null;
        return switch (movement.toUpperCase(Locale.ROOT)) {
            case "DEPOSIT" -> TransactionType.CREDIT;
            case "WITHDRAWAL" -> TransactionType.DEBIT;
            default -> throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_MOVEMENT", "movement must be DEPOSIT or WITHDRAWAL.");
        };
    }

    private String movement(TransactionType type) {
        return type == TransactionType.CREDIT ? "DEPOSIT" : "WITHDRAWAL";
    }
}
