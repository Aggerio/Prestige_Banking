package com.prestige.transfer.notifications;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TransferCompletedEvent(String eventId, String transferReference, BigDecimal amount,
        LocalDateTime completedAt, Long senderCustomerId, String senderName,
        Long receiverCustomerId, String receiverName) { }
