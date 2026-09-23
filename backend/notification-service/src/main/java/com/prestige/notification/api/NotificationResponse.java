package com.prestige.notification.api;
import java.math.BigDecimal; import java.time.LocalDateTime; import com.prestige.notification.domain.Notification;
public record NotificationResponse(Long id,String type,String role,String title,String body,BigDecimal amount,String transferReference,LocalDateTime createdAt,LocalDateTime readAt) { public static NotificationResponse from(Notification n){return new NotificationResponse(n.getId(),n.getType(),n.getRole(),n.getTitle(),n.getBody(),n.getAmount(),n.getTransferReference(),n.getCreatedAt(),n.getReadAt());} }
