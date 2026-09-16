package com.prestige.transfer.service;

import com.prestige.transfer.domain.*;
import com.prestige.transfer.dto.*;
import com.prestige.transfer.exception.ApiException;
import com.prestige.transfer.repository.*;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TransferQueryService {
    private final FundTransferRepository transfers; private final AccountRepository accounts; private final TransactionDetailRepository transactions;
    public TransferQueryService(FundTransferRepository transfers, AccountRepository accounts, TransactionDetailRepository transactions) { this.transfers=transfers; this.accounts=accounts; this.transactions=transactions; }
    public TransferResponse findTransfer(Long customerId, String referenceNumber) {
        FundTransfer transfer=transfers.findByReferenceNumber(referenceNumber).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "TRANSFER_NOT_FOUND", "Transfer was not found."));
        if (!accounts.existsByAccountNumberAndCustomerId(transfer.getSourceAccountNumber(), customerId) && !accounts.existsByAccountNumberAndCustomerId(transfer.getDestinationAccountNumber(), customerId)) throw new ApiException(HttpStatus.FORBIDDEN, "ACCOUNT_NOT_OWNED", "Transfer is not accessible to customer.");
        return new TransferResponse(transfer.getTransferId(), transfer.getReferenceNumber(), transfer.getStatus(), transfer.getAmount(), transfer.getCompletedAt());
    }
    public TransactionPageResponse activity(Long customerId, String accountNumber, int page, int size) {
        if (!accounts.existsByAccountNumberAndCustomerId(accountNumber, customerId)) throw new ApiException(HttpStatus.FORBIDDEN, "ACCOUNT_NOT_OWNED", "Account is not owned by customer.");
        Page<TransactionDetail> result=transactions.findByAccountNumberOrderByTransactionAtDesc(accountNumber, PageRequest.of(page, size));
        List<TransactionResponse> items=result.getContent().stream().map(t -> new TransactionResponse(t.getReferenceNumber(), t.getTransactionType(), t.getTransactionAmount(), t.getTransactionAt(), t.getRemarks())).toList();
        return new TransactionPageResponse(accountNumber, items, page, size, result.getTotalElements(), result.getTotalPages());
    }
}
