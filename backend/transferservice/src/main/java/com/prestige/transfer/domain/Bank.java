package com.prestige.transfer.domain;

import jakarta.persistence.*;
import lombok.*;
@Entity @Table(name = "bank") @Getter @NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Bank {
    @Id @Column(name = "bank_id") private Long bankId;
    @Column(name = "bank_name", nullable = false, length = 150) private String bankName;
    @Column(name = "ifsc_code", nullable = false, length = 20) private String ifscCode;
}
