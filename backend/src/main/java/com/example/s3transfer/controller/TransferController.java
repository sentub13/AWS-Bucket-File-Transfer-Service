package com.example.s3transfer.controller;

import com.example.s3transfer.dto.TransferRequest;
import com.example.s3transfer.service.TransferService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/transfer")
@RequiredArgsConstructor
public class TransferController {

    private final TransferService service;

    @PostMapping
    public ResponseEntity<UUID> transfer(@RequestBody TransferRequest req) {
        try {
            UUID jobId = service.startTransfer(req);
            return ResponseEntity.ok(jobId);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{jobId}/status")
    public ResponseEntity<String> getStatus(@PathVariable UUID jobId) {
        try {
            String status = service.getTransferStatus(jobId);
            return ResponseEntity.ok(status);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}