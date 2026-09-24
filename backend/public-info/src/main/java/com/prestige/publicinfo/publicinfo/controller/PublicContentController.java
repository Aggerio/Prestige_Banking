package com.prestige.publicinfo.publicinfo.controller;

import com.prestige.publicinfo.publicinfo.dto.PublicContentResponse;
import com.prestige.publicinfo.publicinfo.dto.PublicHomeResponse;
import com.prestige.publicinfo.publicinfo.service.PublicContentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/public")
public class PublicContentController {

    private final PublicContentService publicContentService;

    public PublicContentController(PublicContentService publicContentService) {
        this.publicContentService = publicContentService;
    }

    /*
     * Home page:
     * returns bank name, welcome message, and active offers.
     */
    @GetMapping("/home")
    public ResponseEntity<PublicHomeResponse> getHomePage() {
        return ResponseEntity.ok(publicContentService.getHomePage());
    }

    /*
     * About Us page:
     * usually one active content record.
     */
    @GetMapping("/about-us")
    public ResponseEntity<PublicContentResponse> getAboutUs() {
        return ResponseEntity.ok(publicContentService.getAboutUs());
    }

    /*
     * Contact Us page:
     * returns address/content, email, and phone.
     */
    @GetMapping("/contact-us")
    public ResponseEntity<PublicContentResponse> getContactUs() {
        return ResponseEntity.ok(publicContentService.getContactUs());
    }

    /*
     * Investors page:
     * can contain multiple investor records.
     */
    @GetMapping("/investors")
    public ResponseEntity<List<PublicContentResponse>> getInvestors() {
        return ResponseEntity.ok(publicContentService.getInvestors());
    }

    /*
     * Offer carousel:
     * returns active offers ordered by displayOrder.
     */
    @GetMapping("/offers")
    public ResponseEntity<List<PublicContentResponse>> getOffers() {
        return ResponseEntity.ok(publicContentService.getOffers());
    }

    /*
     * Advertisements page:
     * returns active advertisements ordered by displayOrder.
     */
    @GetMapping("/advertisements")
    public ResponseEntity<List<PublicContentResponse>> getAdvertisements() {
        return ResponseEntity.ok(publicContentService.getAdvertisements());
    }
}
