package com.example.s3transfer.controller;

import com.example.s3transfer.dto.AwsCredentialDTO;
import com.example.s3transfer.entity.AwsCredential;
import com.example.s3transfer.repository.AwsCredentialRepository;
import com.example.s3transfer.service.EncryptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AwsCredentialRepository repo;
    private final EncryptionService enc;

    @PostMapping("/aws")
    public ResponseEntity<String> saveCredentials(@RequestBody AwsCredentialDTO dto) {
        try {
            // Validate input
            if (dto.getAccountName() == null || dto.getAccessKey() == null || 
                dto.getSecretKey() == null || dto.getRegion() == null) {
                return ResponseEntity.badRequest().body("All fields are required");
            }

            AwsCredential c = new AwsCredential();
            c.setAccountName(dto.getAccountName());
            c.setRegion(dto.getRegion());
            c.setAccessKeyEncrypted(enc.encrypt(dto.getAccessKey()));
            c.setSecretKeyEncrypted(enc.encrypt(dto.getSecretKey()));
            repo.save(c);
            
            return ResponseEntity.ok("AWS credentials saved successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to save credentials: " + e.getMessage());
        }
    }

    @GetMapping("/aws")
    public ResponseEntity<List<AwsCredentialDTO>> getCredentials() {
        try {
            List<AwsCredentialDTO> credentials = repo.findAll().stream()
                    .map(c -> {
                        AwsCredentialDTO dto = new AwsCredentialDTO();
                        dto.setId(c.getId());
                        dto.setAccountName(c.getAccountName());
                        dto.setRegion(c.getRegion());
                        // Don't return actual keys for security
                        dto.setAccessKey("***");
                        dto.setSecretKey("***");
                        return dto;
                    })
                    .collect(java.util.stream.Collectors.toList());
            return ResponseEntity.ok(credentials);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/aws/{id}")
    public ResponseEntity<String> deleteCredentials(@PathVariable UUID id) {
        try {
            if (repo.existsById(id)) {
                repo.deleteById(id);
                return ResponseEntity.ok("Credentials deleted successfully");
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to delete credentials: " + e.getMessage());
        }
    }
}