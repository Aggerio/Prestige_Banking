package com.prestige.customerservice.dao.repositories;

import com.prestige.customerservice.dao.entities.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Provides persistence access to customer mailing addresses.
 * Customer-scoped queries prevent unrelated address data from being selected.
 */
public interface AddressRepository extends JpaRepository<Address,Long> {
    List<Address> findByCustomer_CustomerId(Long customerId);
}
