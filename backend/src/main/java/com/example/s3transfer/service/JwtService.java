package com.example.s3transfer.service;

import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Service
public class JwtService {

    // Minimal token generation for demo purposes
    public String generateToken(String username) {
        String raw = username + ":" + System.currentTimeMillis();
        return Base64.getEncoder().encodeToString(raw.getBytes(StandardCharsets.UTF_8));
    }

    public boolean validateToken(String token) {
        try {
            byte[] decoded = Base64.getDecoder().decode(token);
            String s = new String(decoded, StandardCharsets.UTF_8);
            return s.contains(":");
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
}

