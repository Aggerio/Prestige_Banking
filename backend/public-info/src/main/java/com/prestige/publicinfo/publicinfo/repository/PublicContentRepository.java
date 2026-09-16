package com.prestige.publicinfo.publicinfo.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.prestige.publicinfo.publicinfo.entity.PublicContent;
import com.prestige.publicinfo.publicinfo.entity.PublicContentType;

@Repository
public interface PublicContentRepository
                extends JpaRepository<PublicContent, Long> {

        @Query("""
                        SELECT p
                        FROM PublicContent p
                        WHERE p.contentType = :contentType
                          AND p.isActive = 'Y'
                          AND p.activeFrom <= :currentTime
                          AND (
                                p.activeUntil IS NULL
                                OR p.activeUntil >= :currentTime
                              )
                        ORDER BY p.displayOrder ASC, p.contentId ASC
                        """)
        List<PublicContent> findActiveContentByType(
                        @Param("contentType") PublicContentType contentType,
                        @Param("currentTime") LocalDateTime currentTime);

        /*
         * Used for About Us and Contact Us.
         * It safely selects the first record from the already sorted active list.
         */
        default Optional<PublicContent> findFirstActiveContentByType(
                        PublicContentType contentType,
                        LocalDateTime currentTime) {
                return findActiveContentByType(contentType, currentTime)
                                .stream()
                                .findFirst();
        }
}
