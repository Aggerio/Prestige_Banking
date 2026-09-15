package com.prestige.transfer.controller;

import com.prestige.transfer.dto.*;
import com.prestige.transfer.security.CustomerIdentity;
import com.prestige.transfer.service.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/api/v1")
public class TransferController {
    private final TransferApplicationService application;
    private final TransferQueryService queries;

    public TransferController(TransferApplicationService application, TransferQueryService queries) {
        this.application = application;
        this.queries = queries;
    }

    @PostMapping("/transfers")
    public ResponseEntity<TransferResponse> transfer(@AuthenticationPrincipal Jwt jwt,
            @RequestHeader("Idempotency-Key") String key, @Valid @RequestBody TransferRequest request) {
        TransferApplicationService.TransferExecution result = application.execute(CustomerIdentity.from(jwt), key,
                request);
        if (!result.created())
            return ResponseEntity.ok(result.response());
        return ResponseEntity.created(ServletUriComponentsBuilder.fromCurrentRequest().path("/{referenceNumber}")
                .buildAndExpand(result.response().referenceNumber()).toUri()).body(result.response());
    }

    @GetMapping("/transfers/{referenceNumber}")
    public TransferResponse transfer(@AuthenticationPrincipal Jwt jwt, @PathVariable String referenceNumber) {
        return queries.findTransfer(CustomerIdentity.from(jwt), referenceNumber);
    }

    @GetMapping("/accounts/{accountNumber}/transactions")
    public TransactionPageResponse activity(@AuthenticationPrincipal Jwt jwt, @PathVariable String accountNumber,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size) {
        return queries.activity(CustomerIdentity.from(jwt), accountNumber, page, size);
    }
}
