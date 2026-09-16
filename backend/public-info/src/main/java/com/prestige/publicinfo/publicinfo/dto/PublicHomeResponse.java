package com.prestige.publicinfo.publicinfo.dto;

import java.util.List;

public record PublicHomeResponse(
        String bankName,
        String welcomeMessage,
        List<PublicContentResponse> offers
) {
}