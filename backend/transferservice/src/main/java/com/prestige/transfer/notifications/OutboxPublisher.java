package com.prestige.transfer.notifications;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class OutboxPublisher {
    private final NotificationOutboxRepository outbox; private final KafkaTemplate<String, String> kafka;
    @Value("${app.notifications.topic}") private String topic;
    public OutboxPublisher(NotificationOutboxRepository outbox, KafkaTemplate<String, String> kafka) { this.outbox = outbox; this.kafka = kafka; }
    @Scheduled(fixedDelayString = "${app.notifications.outbox-delay-ms:1000}")
    @Transactional
    public void publish() {
        for (NotificationOutbox row : outbox.findByPublishedAtIsNullOrderByCreatedAtAsc(PageRequest.of(0, 50))) {
            try { kafka.send(topic, row.getTransferReference(), row.getPayload()).get(); row.sent(); }
            catch (Exception ex) { row.failed(); }
        }
    }
}
