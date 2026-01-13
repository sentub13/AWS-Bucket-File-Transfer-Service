package com.example.s3transfer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication // Main Spring Boot annotation - enables auto-configuration, component scanning, and configuration properties
@EntityScan("com.example.s3transfer.entity") // Specifies packages to scan for JPA entities - tells Spring where to find database entity classes
@EnableJpaRepositories("com.example.s3transfer.repository") // Enables JPA repositories - activates Spring Data JPA repository interfaces for database operations
public class Application {
    public static void main(String[] args) {

        SpringApplication.run(Application.class, args);
    }
}