package com.prestige.transfer.service;

import com.prestige.transfer.dao.AccountLockDao;
import com.prestige.transfer.domain.*;
import com.prestige.transfer.domain.enums.*;
import com.prestige.transfer.dto.*;
import com.prestige.transfer.exception.*;
import com.prestige.transfer.repository.*;
import io.micrometer.core.instrument.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class TransferApplicationService {
    private final AccountRepository accounts; private final CustomerRepository customers; private final FundTransferRepository transfers; private final TransactionDetailRepository transactions; private final AccountLockDao locks; private final MeterRegistry metrics;
    public TransferApplicationService(AccountRepository accounts, CustomerRepository customers, FundTransferRepository transfers, TransactionDetailRepository transactions, AccountLockDao locks, MeterRegistry metrics) { this.accounts=accounts; this.customers=customers; this.transfers=transfers; this.transactions=transactions; this.locks=locks; this.metrics=metrics; }
    @Transactional
    public TransferExecution execute(Long customerId, String idempotencyKey, TransferRequest request) {
        io.micrometer.core.instrument.Timer.Sample latency=io.micrometer.core.instrument.Timer.start(metrics); metrics.counter("transfer.attempts").increment();
        try {
        if (idempotencyKey == null || idempotencyKey.isBlank() || idempotencyKey.length() > 100) throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_REQUEST", "A valid Idempotency-Key is required.");
        if (request.sourceAccountNumber().equals(request.destinationAccountNumber())) throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_REQUEST", "Source and destination accounts must differ.");
        Account sourceSnapshot = accounts.findByAccountNumber(request.sourceAccountNumber()).orElseThrow(() -> new ApiException(HttpStatus.FORBIDDEN, "ACCOUNT_NOT_OWNED", "Source account is not owned by customer."));
        if (!sourceSnapshot.getCustomerId().equals(customerId)) throw new ApiException(HttpStatus.FORBIDDEN, "ACCOUNT_NOT_OWNED", "Source account is not owned by customer.");
        String hash = hash(request);
        Optional<FundTransfer> existing = transfers.findBySourceAccountNumberAndIdempotencyKey(request.sourceAccountNumber(), idempotencyKey);
        if (existing.isPresent()) { metrics.counter("transfer.idempotent_replays").increment(); return new TransferExecution(replay(existing.get(), hash), false); }
        List<Account> locked = locks.lockPair(request.sourceAccountNumber(), request.destinationAccountNumber());
        Map<String, Account> byNumber = new HashMap<>(); locked.forEach(a -> byNumber.put(a.getAccountNumber(), a));
        Account source = Optional.ofNullable(byNumber.get(request.sourceAccountNumber())).orElseThrow(() -> new ApiException(HttpStatus.FORBIDDEN, "ACCOUNT_NOT_OWNED", "Source account is not owned by customer."));
        Account destination = Optional.ofNullable(byNumber.get(request.destinationAccountNumber())).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "DESTINATION_NOT_FOUND", "Destination account was not found."));
        if (!source.getCustomerId().equals(customerId)) throw new ApiException(HttpStatus.FORBIDDEN, "ACCOUNT_NOT_OWNED", "Source account is not owned by customer.");
        Optional<FundTransfer> afterLock = transfers.findBySourceAccountNumberAndIdempotencyKey(request.sourceAccountNumber(), idempotencyKey);
        if (afterLock.isPresent()) { metrics.counter("transfer.idempotent_replays").increment(); return new TransferExecution(replay(afterLock.get(), hash), false); }
        validate(source, destination, request);
        LocalDateTime now = LocalDateTime.now();
        source.debit(request.amount()); destination.credit(request.amount());
        FundTransfer transfer = transfers.saveAndFlush(new FundTransfer(idempotencyKey, source.getAccountNumber(), destination.getAccountNumber(), request.destinationAccountHolderName(), request.destinationIfscCode(), request.amount(), reference(), hash, now));
        transactions.save(new TransactionDetail(transfer.getTransferId(), transfer.getReferenceNumber(), source, TransactionType.DEBIT, request.amount(), now, "Transfer to " + request.destinationAccountHolderName()));
        transactions.save(new TransactionDetail(transfer.getTransferId(), transfer.getReferenceNumber(), destination, TransactionType.CREDIT, request.amount(), now, "Transfer received"));
        metrics.counter("transfer.completions").increment(); return new TransferExecution(response(transfer), true);
        } catch (ApiException ex) { metrics.counter("transfer.failures", "code", ex.getCode()).increment(); throw ex; }
        finally { latency.stop(metrics.timer("transfer.latency")); }
    }
    private TransferResponse replay(FundTransfer transfer, String hash) { if (!transfer.getRequestHash().equals(hash)) throw new IdempotencyConflictException(); return response(transfer); }
    private void validate(Account source, Account destination, TransferRequest request) {
        if (source.getAccountStatus()!=AccountStatus.ACTIVE || destination.getAccountStatus()!=AccountStatus.ACTIVE) throw new ApiException(HttpStatus.UNPROCESSABLE_ENTITY, "ACCOUNT_NOT_ACTIVE", "Both accounts must be active.");
        if (!destination.getIfscCode().equals(request.destinationIfscCode()) || !customers.findById(destination.getCustomerId()).map(Customer::getCustomerName).filter(request.destinationAccountHolderName()::equals).isPresent()) throw new ApiException(HttpStatus.NOT_FOUND, "DESTINATION_NOT_FOUND", "Destination details do not match.");
        if (!BCrypt.checkpw(request.transactionPassword(), source.getTransactionPasswordHash())) throw new ApiException(HttpStatus.UNAUTHORIZED, "INVALID_TRANSACTION_PASSWORD", "Transaction password is invalid.");
        if (request.amount().compareTo(source.getTransferLimit()) > 0) throw new ApiException(HttpStatus.UNPROCESSABLE_ENTITY, "TRANSFER_LIMIT_EXCEEDED", "Transfer amount exceeds the account limit.");
        if (source.getAvailableBalance().subtract(request.amount()).compareTo(source.getMinimumBalance()) < 0) throw new ApiException(HttpStatus.UNPROCESSABLE_ENTITY, "MINIMUM_BALANCE_VIOLATION", "Transfer would violate the minimum balance.");
    }
    private String hash(TransferRequest r) { try { String canonical=String.join("|", r.sourceAccountNumber().trim(), r.destinationAccountNumber().trim(), r.destinationAccountHolderName().trim(), r.destinationIfscCode().trim(), r.amount().stripTrailingZeros().toPlainString()); byte[] bytes=MessageDigest.getInstance("SHA-256").digest(canonical.getBytes(StandardCharsets.UTF_8)); return HexFormat.of().formatHex(bytes); } catch (Exception e) { throw new IllegalStateException(e); } }
    private String reference() { return "TRF-" + UUID.randomUUID().toString().replace("-", "").toUpperCase(Locale.ROOT); }
    private TransferResponse response(FundTransfer t) { return new TransferResponse(t.getTransferId(), t.getReferenceNumber(), t.getStatus(), t.getAmount(), t.getCompletedAt().toInstant(ZoneOffset.UTC)); }
    public record TransferExecution(TransferResponse response, boolean created) { }
}
