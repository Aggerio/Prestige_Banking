package com.prestige.notification.service;
import org.springframework.context.event.EventListener; import org.springframework.stereotype.Component; import org.springframework.transaction.event.*;
@Component public class NotificationEvents { private final NotificationBroker broker; public NotificationEvents(NotificationBroker broker){this.broker=broker;} @TransactionalEventListener(phase=TransactionPhase.AFTER_COMMIT) public void created(NotificationService.Created e){broker.publish(e.customerId(),e.notification());} }
