package com.prestige.customerservice.dao.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "card")
@Getter
@NoArgsConstructor
public class Card {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "card_id")
    private Long cardId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "account_number", nullable = false)
    private Account account;

    @Enumerated(EnumType.STRING)
    @Column(name = "card_type", nullable = false, length = 10)
    private CardType cardType;

    @Column(name = "cardholder_name", nullable = false, length = 150)
    private String cardholderName;

    @Column(name = "masked_pan", nullable = false, unique = true, length = 16)
    private String maskedPan;

    @Column(name = "unmasked_pan", nullable = false, unique = true, length = 19)
    private String unmaskedPan;

    @Column(name = "expiry_month", nullable = false)
    private Integer expiryMonth;

    @Column(name = "expiry_year", nullable = false)
    private Integer expiryYear;

    @Column(name = "cvv_hash", nullable = false, length = 255)
    private String cvvHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "card_status", nullable = false, length = 10)
    private CardStatus cardStatus;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public enum CardType { DEBIT, CREDIT }
    public enum CardStatus { ACTIVE, BLOCKED, EXPIRED }

    public void changeStatus(CardStatus status) {
        this.cardStatus = status;
        this.updatedAt = LocalDateTime.now();
    }
}
