package com.example.s3transfer.controller;

import com.example.s3transfer.service.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;

import java.util.List;

@RestController
@RequestMapping("/api/s3")
@RequiredArgsConstructor
public class S3Controller {

    private final S3Service s3Service;

    @GetMapping("/{bucket}/files")
    public ResponseEntity<List<String>> listFiles(@PathVariable String bucket) {
        if (!s3Service.bucketExists(bucket)) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(s3Service.listFiles(bucket));
    }

    @PostMapping("/{bucket}/upload")
    public ResponseEntity<String> uploadFile(
            @PathVariable String bucket,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "key", required = false) String key) {
        try {
            String fileKey = key != null ? key : file.getOriginalFilename();
            s3Service.uploadFile(bucket, fileKey, file.getInputStream(), file.getSize());
            return ResponseEntity.ok("File uploaded successfully: " + fileKey);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Upload failed: " + e.getMessage());
        }
    }

    @GetMapping("/{bucket}/download/{key}")
    public ResponseEntity<InputStreamResource> downloadFile(
            @PathVariable String bucket,
            @PathVariable String key) {
        try {
            ResponseInputStream<GetObjectResponse> s3Object = s3Service.downloadFile(bucket, key);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + key + "\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(new InputStreamResource(s3Object));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}