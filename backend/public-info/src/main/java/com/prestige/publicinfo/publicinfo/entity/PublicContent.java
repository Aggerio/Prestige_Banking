package com.prestige.publicinfo.publicinfo.entity;


import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.sql.Types;

import org.hibernate.annotations.JdbcTypeCode;
@Entity
@Table(
        name = "public_content",
        indexes = {
                @Index(
                        name = "idx_public_content_active_order",
                        columnList = "content_type, is_active, display_order"
                )
        }
)
public class PublicContent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "content_id")
    private Long contentId;

    @Enumerated(EnumType.STRING)
    @Column(name = "content_type", nullable = false, length = 20)
    private PublicContentType contentType;

    @Column(name = "content_key", nullable = false, unique = true, length = 100)
    private String contentKey;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Lob
    @Column(name = "content_body")
    private String contentBody;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "contact_email", length = 150)
    private String contactEmail;

    @Column(name = "contact_phone", length = 30)
    private String contactPhone;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 1;

    // Oracle CHAR(1): Y = active, N = inactive
    @JdbcTypeCode(Types.CHAR)
    @Column(name = "is_active", nullable = false, columnDefinition = "CHAR(1)")
    private String isActive = "Y";

    @Column(name = "active_from", nullable = false)
    private LocalDateTime activeFrom;

    @Column(name = "active_until")
    private LocalDateTime activeUntil;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();

        if (activeFrom == null) {
            activeFrom = now;
        }

        if (displayOrder == null) {
            displayOrder = 1;
        }

        if (isActive == null) {
            isActive = "Y";
        }

        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public boolean isCurrentlyAvailable() {
        LocalDateTime now = LocalDateTime.now();

        return "Y".equalsIgnoreCase(isActive)
                && !activeFrom.isAfter(now)
                && (activeUntil == null || !activeUntil.isBefore(now));
    }

    public Long getContentId() {
        return contentId;
    }

    public PublicContentType getContentType() {
        return contentType;
    }

    public void setContentType(PublicContentType contentType) {
        this.contentType = contentType;
    }

    public String getContentKey() {
        return contentKey;
    }

    public void setContentKey(String contentKey) {
        this.contentKey = contentKey;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContentBody() {
        return contentBody;
    }

    public void setContentBody(String contentBody) {
        this.contentBody = contentBody;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

    public String getIsActive() {
        return isActive;
    }

    public void setIsActive(String isActive) {
        this.isActive = isActive;
    }

    public LocalDateTime getActiveFrom() {
        return activeFrom;
    }

    public void setActiveFrom(LocalDateTime activeFrom) {
        this.activeFrom = activeFrom;
    }

    public LocalDateTime getActiveUntil() {
        return activeUntil;
    }

    public void setActiveUntil(LocalDateTime activeUntil) {
        this.activeUntil = activeUntil;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

}
