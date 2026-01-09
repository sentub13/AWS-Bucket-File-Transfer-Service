package com.example.s3transfer.dto;

import lombok.Data;

@Data
public class TransferRequest {
    private String sourceBucket;
    private String destinationBucket;
    private String fileKey;
}