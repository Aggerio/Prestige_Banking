package com.prestige.transfer.domain;

import jakarta.persistence.*;
import lombok.*;
@Entity @Table(name = "customer") @Getter @NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Customer {
    @Id @Column(name = "customer_id") private Long customerId;
    @Column(name = "customer_name", nullable = false, length = 150) private String customerName;
    @Column(name = "status", nullable = false, length = 20) private String status;
}
