package com.prestige.publicinfo.publicinfo.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.prestige.publicinfo.publicinfo.dto.PublicContentResponse;
import com.prestige.publicinfo.publicinfo.dto.PublicHomeResponse;
import com.prestige.publicinfo.publicinfo.entity.PublicContent;
import com.prestige.publicinfo.publicinfo.entity.PublicContentType;
import com.prestige.publicinfo.publicinfo.exception.ResourceNotFoundException;
import com.prestige.publicinfo.publicinfo.repository.PublicContentRepository;

@Service
public class PublicContentService {

    private final PublicContentRepository publicContentRepository;

    @Value("${bank.public.name:Prestige Banking System}")
    private String bankName;

    @Value("${bank.public.welcome-message:Welcome to Prestige Banking}")
    private String welcomeMessage;

    public PublicContentService(PublicContentRepository publicContentRepository) {
        this.publicContentRepository = publicContentRepository;
    }

    public PublicHomeResponse getHomePage() {
        List<PublicContentResponse> offers = getOffers();

        return new PublicHomeResponse(
                bankName,
                welcomeMessage,
                offers
        );
    }

    public PublicContentResponse getAboutUs() {
        PublicContent aboutUs = findFirstActiveContent(PublicContentType.ABOUT_US);

        return mapToResponse(aboutUs);
    }

    public PublicContentResponse getContactUs() {
        PublicContent contactUs = findFirstActiveContent(PublicContentType.CONTACT_US);

        return mapToResponse(contactUs);
    }

    public List<PublicContentResponse> getInvestors() {
        return findActiveContentByType(PublicContentType.INVESTOR);
    }

    public List<PublicContentResponse> getOffers() {
        return findActiveContentByType(PublicContentType.OFFER);
    }

    private PublicContent findFirstActiveContent(PublicContentType contentType) {
        return publicContentRepository
                .findFirstActiveContentByType(contentType, LocalDateTime.now())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Active content not found for type: " + contentType
                ));
    }

    private List<PublicContentResponse> findActiveContentByType(
            PublicContentType contentType
    ) {
        return publicContentRepository
                .findActiveContentByType(contentType, LocalDateTime.now())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private PublicContentResponse mapToResponse(PublicContent content) {
        return new PublicContentResponse(
                content.getContentId(),
                content.getContentType(),
                content.getContentKey(),
                content.getTitle(),
                content.getContentBody(),
                content.getImageUrl(),
                content.getContactEmail(),
                content.getContactPhone(),
                content.getDisplayOrder()
        );
    }
}