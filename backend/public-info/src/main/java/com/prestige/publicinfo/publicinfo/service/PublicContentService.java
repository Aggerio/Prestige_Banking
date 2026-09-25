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
        // The home page reuses the same active offers shown on the dedicated offers route.
        List<PublicContentResponse> offers = getOffers();

        return new PublicHomeResponse(
                bankName,
                welcomeMessage,
                offers
        );
    }

    public PublicContentResponse getAboutUs() {
        // About Us has one current published entry rather than a collection of updates.
        PublicContent aboutUs = findFirstActiveContent(PublicContentType.ABOUT_US);

        return mapToResponse(aboutUs);
    }

    public PublicContentResponse getContactUs() {
        // Contact details follow the same single-entry rule as the About Us page.
        PublicContent contactUs = findFirstActiveContent(PublicContentType.CONTACT_US);

        return mapToResponse(contactUs);
    }

    public List<PublicContentResponse> getInvestors() {
        // Investor updates are returned in their configured display order.
        return findActiveContentByType(PublicContentType.INVESTOR);
    }

    public List<PublicContentResponse> getOffers() {
        // More than one offer may be published at the same time.
        return findActiveContentByType(PublicContentType.OFFER);
    }

    public List<PublicContentResponse> getAdvertisements() {
        // Advertisements are kept separate so the home page can mix them with offers.
        return findActiveContentByType(PublicContentType.ADVERTISEMENT);
    }

    private PublicContent findFirstActiveContent(PublicContentType contentType) {
        // Evaluate the publishing window at request time so expired content is never returned.
        return publicContentRepository
                .findFirstActiveContentByType(contentType, LocalDateTime.now())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Active content not found for type: " + contentType
                ));
    }

    private List<PublicContentResponse> findActiveContentByType(
            PublicContentType contentType
    ) {
        // Shared lookup keeps visibility rules consistent across all public endpoints.
        return publicContentRepository
                .findActiveContentByType(contentType, LocalDateTime.now())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private PublicContentResponse mapToResponse(PublicContent content) {
        // Return the public DTO instead of exposing the persistence entity to callers.
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
