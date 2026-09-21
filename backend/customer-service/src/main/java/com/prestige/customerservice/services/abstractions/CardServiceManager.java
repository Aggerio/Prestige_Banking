package com.prestige.customerservice.services.abstractions;

import com.prestige.customerservice.dtos.CardQuery;
import java.util.List;

public interface CardServiceManager {
    List<CardQuery> getMyCards(Long customerId, String accountNumber);
}
