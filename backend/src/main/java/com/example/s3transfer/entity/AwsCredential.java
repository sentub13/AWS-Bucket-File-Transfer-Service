package com.example.s3transfer.entity;

import javax.persistence.*;
import lombok.Data;
import java.util.UUID;

@Entity
@Table(name = "aws_credentials")
@Data
public class AwsCredential {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String accountName;
    
    @Column(nullable = false)
    private String accessKeyEncrypted;
    
    @Column(nullable = false)
    private String secretKeyEncrypted;
    
    @Column(nullable = false)
    private String region;
}