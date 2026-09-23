package com.prestige.notification.api;
import java.util.List; public record NotificationPage(List<NotificationResponse> items,long unreadCount,boolean hasMore) { }
