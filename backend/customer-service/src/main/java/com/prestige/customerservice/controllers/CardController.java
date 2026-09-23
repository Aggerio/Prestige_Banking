package com.prestige.customerservice.controllers;

import com.prestige.customerservice.dtos.CardQuery;
import com.prestige.customerservice.dtos.CardStatusRequest;
import jakarta.validation.Valid;
import com.prestige.customerservice.services.abstractions.CardServiceManager;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/cards")
public class CardController {
    private final CardServiceManager cardService;

    public CardController(CardServiceManager cardService) {
        this.cardService = cardService;
    }

    @GetMapping
    public List<CardQuery> getMyCards(@AuthenticationPrincipal Jwt jwt,
                                      @RequestParam(required = false) String accountNumber) {
        return cardService.getMyCards(Long.valueOf(jwt.getSubject()), accountNumber);
    }

    @PatchMapping("/{cardId}/status")
    public CardQuery changeStatus(@AuthenticationPrincipal Jwt jwt,
                                  @PathVariable Long cardId,
                                  @Valid @RequestBody CardStatusRequest request) {
        return cardService.changeStatus(Long.valueOf(jwt.getSubject()), cardId, request);
    }
}
