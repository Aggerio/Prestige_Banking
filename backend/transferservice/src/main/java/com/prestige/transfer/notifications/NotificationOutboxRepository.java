package com.prestige.transfer.notifications;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
public interface NotificationOutboxRepository extends JpaRepository<NotificationOutbox, String> {
    List<NotificationOutbox> findByPublishedAtIsNullOrderByCreatedAtAsc(Pageable pageable);
}
