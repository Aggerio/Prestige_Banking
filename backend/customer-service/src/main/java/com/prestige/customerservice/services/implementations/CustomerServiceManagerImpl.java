package com.prestige.customerservice.services.implementations;

import com.prestige.customerservice.dao.entities.Address;
import com.prestige.customerservice.dao.entities.Customer;
import com.prestige.customerservice.dao.repositories.AddressRepository;
import com.prestige.customerservice.dao.repositories.CustomerRepository;
import com.prestige.customerservice.dtos.AddressQuery;
import com.prestige.customerservice.dtos.BankQuery;
import com.prestige.customerservice.dtos.CustomerQuery;
import com.prestige.customerservice.exception.CustomerNotFoundException;
import com.prestige.customerservice.services.abstractions.CustomerServiceManager;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class CustomerServiceManagerImpl
        implements CustomerServiceManager {

    private final CustomerRepository customerRepository;
    private final AddressRepository addressRepository;

    public CustomerServiceManagerImpl(
            CustomerRepository customerRepository,
            AddressRepository addressRepository
    ) {
        this.customerRepository = customerRepository;
        this.addressRepository = addressRepository;
    }

    @Override
    public CustomerQuery getMyCustomer(Long customerId) {

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() ->
                        new CustomerNotFoundException("Customer not found: " + customerId));

        CustomerQuery customerQuery = new CustomerQuery();

        customerQuery.setCustomerId(customer.getCustomerId());
        customerQuery.setCustomerName(customer.getCustomerName());
        customerQuery.setAge(customer.getAge());
        customerQuery.setStatus(customer.getStatus().name());

        if (customer.getBank() != null) {
            // Bank details are optional, so omit them rather than returning an empty object.

            BankQuery bankQuery = new BankQuery();

            bankQuery.setBankId(customer.getBank().getBankId());
            bankQuery.setBankName(customer.getBank().getBankName());
            bankQuery.setIfscCode(customer.getBank().getIfscCode());
            bankQuery.setBranchName(customer.getBank().getBranchName());

            customerQuery.setBank(bankQuery);
        }

        List<Address> addresses =
                addressRepository.findByCustomer_CustomerId(customerId);

        if (!addresses.isEmpty()) {
            // A customer can have multiple addresses; the API currently exposes the first one.

            Address address = addresses.getFirst();

            AddressQuery addressQuery = new AddressQuery();

            addressQuery.setAddressId(address.getAddressId());
            addressQuery.setStreetName(address.getStreetName());
            addressQuery.setCity(address.getCity());
            addressQuery.setState(address.getState());
            addressQuery.setPinCode(address.getPinCode());

            customerQuery.setAddress(addressQuery);
        }

        return customerQuery;
    }
}
