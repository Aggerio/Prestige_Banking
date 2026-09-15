package com.prestige.transfer.domain;

import jakarta.persistence.*;
import lombok.*;
@Entity @Table(name = "customer") @Getter @NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Customer {
    @Id @Column(name = "customer_id") private Long customerId;
    @Column(name = "customer_name", nullable = false) private String customerName;
    @Column(name = "status", nullable = false) private String status;
}
