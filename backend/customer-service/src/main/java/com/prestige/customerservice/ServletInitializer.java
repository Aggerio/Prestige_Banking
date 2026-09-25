package com.prestige.customerservice;

import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

/**
 * Adapts the service for deployment to an external servlet container.
 * Local executable-jar startup continues to use CustomerServiceApplication directly.
 */
public class ServletInitializer extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(CustomerServiceApplication.class);
    }

}
