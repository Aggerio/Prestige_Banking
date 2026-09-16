package com.prestige.transfer.dto;

import java.util.List;

public record TransactionPageResponse(String accountNumber, List<TransactionResponse> items, int page, int size,
                                      long totalElements, int totalPages) {
}
