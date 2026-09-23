package com.prestige.customerservice.services.abstractions;

import com.prestige.customerservice.dtos.CardQuery;
import com.prestige.customerservice.dtos.CardNumberQuery;
import com.prestige.customerservice.dtos.CardNumberRevealRequest;
import com.prestige.customerservice.dtos.CardStatusRequest;
import java.util.List;

public interface CardServiceManager {
    List<CardQuery> getMyCards(Long customerId, String accountNumber);
    CardQuery changeStatus(Long customerId, Long cardId, CardStatusRequest request);
    CardNumberQuery revealCardNumber(Long customerId, Long cardId, CardNumberRevealRequest request);
}
