package com.prestige.transfer.dao;

import com.prestige.transfer.domain.Account;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class AccountLockDao {
    @PersistenceContext private EntityManager entityManager;
    @Value("${app.oracle.lock-timeout-seconds:5}") private int lockTimeoutSeconds;
    public List<Account> lockPair(String firstAccount, String secondAccount) {
        return entityManager.createNativeQuery("SELECT * FROM account WHERE account_number IN (:firstAccount, :secondAccount) ORDER BY account_number FOR UPDATE WAIT " + lockTimeoutSeconds, Account.class)
                .setParameter("firstAccount", firstAccount).setParameter("secondAccount", secondAccount).getResultList();
    }
}
