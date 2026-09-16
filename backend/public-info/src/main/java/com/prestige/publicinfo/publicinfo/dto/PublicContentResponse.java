package com.prestige.publicinfo.publicinfo.dto;


import com.prestige.publicinfo.publicinfo.entity.PublicContentType;

public record PublicContentResponse(
        Long contentId,
        PublicContentType contentType,
        String contentKey,
        String title,
        String contentBody,
        String imageUrl,
        String contactEmail,
        String contactPhone,
        Integer displayOrder
) {
}