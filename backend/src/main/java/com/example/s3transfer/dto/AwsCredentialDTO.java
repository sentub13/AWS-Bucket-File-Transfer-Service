package com.example.s3transfer.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class AwsCredentialDTO {
    private UUID id;
    private String accountName;
    private String accessKey;
    private String secretKey;
    private String region;
}