package com.prestige.customerservice.dao.repositories;

import com.prestige.customerservice.dao.entities.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
/**
 * Persists customer profiles used by authenticated customer lookups.
 * The repository exposes Spring Data's standard identity-based access methods.
 */
public interface CustomerRepository extends JpaRepository<Customer,Long> {
}
