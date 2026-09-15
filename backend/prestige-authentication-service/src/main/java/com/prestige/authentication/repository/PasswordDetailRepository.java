package com.prestige.authentication.repository;

import com.prestige.authentication.entity.PasswordDetail;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PasswordDetailRepository extends JpaRepository<PasswordDetail, Long> {
    List<PasswordDetail> findByCustomerIdAndPasswordType(Long id, String type);

    List<PasswordDetail> findByCustomerIdAndAccountNumberAndPasswordType(Long id, String account, String type);
}
