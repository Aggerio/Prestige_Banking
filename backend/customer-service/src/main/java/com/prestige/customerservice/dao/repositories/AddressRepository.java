package com.prestige.customerservice.dao.repositories;

import com.prestige.customerservice.dao.entities.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AddressRepository extends JpaRepository<Address,Long> {
    List<Address> findByCustomer_CustomerId(Long customerId);
}
