package com.prestige.transfer.notifications;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;

@Entity @Table(name = "notification_outbox") @Getter @NoArgsConstructor(access = AccessLevel.PROTECTED)
public class NotificationOutbox {
    @Id @Column(name = "event_id", length = 36) private String eventId;
    @Column(name = "event_type", nullable = false, length = 80) private String eventType;
    @Column(name = "transfer_reference", nullable = false, length = 100) private String transferReference;
    @Lob @Column(name = "payload", nullable = false) private String payload;
    @Column(name = "created_at", nullable = false) private LocalDateTime createdAt;
    @Column(name = "published_at") private LocalDateTime publishedAt;
    @Column(nullable = false) private int attempts;
    public static NotificationOutbox forTransfer(TransferCompletedEvent event) {
        try {
            NotificationOutbox row = new NotificationOutbox(); row.eventId = event.eventId();
            row.eventType = "transfer.completed"; row.transferReference = event.transferReference(); row.payload = new ObjectMapper().findAndRegisterModules().writeValueAsString(event);
            row.createdAt = LocalDateTime.now(); return row;
        } catch (JsonProcessingException ex) { throw new IllegalStateException("Cannot serialize transfer event", ex); }
    }
    public void sent() { publishedAt = LocalDateTime.now(); attempts++; }
    public void failed() { attempts++; }
}
