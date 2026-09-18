package com.prestige.authentication.repository;

import com.prestige.authentication.entity.PasswordDetail;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PasswordDetailRepository extends JpaRepository<PasswordDetail, Long> {
    List<PasswordDetail>
    findByCustomerIdAndPasswordTypeOrderByChangedAtDesc(
            Long customerId, String passwordType
    );
    List<PasswordDetail>
    findByCustomerIdAndAccountNumberAndPasswordTypeOrderByChangedAtDesc(
            Long customerId, String accountNumber, String passwordType
    );}
