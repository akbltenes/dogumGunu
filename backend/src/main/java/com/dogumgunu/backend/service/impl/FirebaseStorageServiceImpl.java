package com.dogumgunu.backend.service.impl;

import com.dogumgunu.backend.service.FirebaseStorageService;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.firebase.cloud.StorageClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Slf4j
@Service
public class FirebaseStorageServiceImpl implements FirebaseStorageService {

    private static final String BUCKET_NAME = "dogumgunu-3ed67.firebasestorage.app";

    @Override
    public String uploadFile(MultipartFile file, String folder) {
        try {
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".")
                    ? originalFilename.substring(originalFilename.lastIndexOf("."))
                    : "";
            String filename = folder + "/" + UUID.randomUUID() + extension;

            Storage storage = StorageClient.getInstance().bucket().getStorage();

            BlobInfo blobInfo = BlobInfo.newBuilder(BUCKET_NAME, filename)
                    .setContentType(file.getContentType())
                    .build();

            Blob blob = storage.create(blobInfo, file.getBytes());

            String publicUrl = String.format(
                    "https://firebasestorage.googleapis.com/v0/b/%s/o/%s?alt=media",
                    BUCKET_NAME,
                    filename.replace("/", "%2F")
            );

            log.info("File uploaded successfully: {}", publicUrl);
            return publicUrl;

        } catch (IOException e) {
            log.error("Failed to upload file to Firebase Storage", e);
            throw new RuntimeException("File upload failed", e);
        }
    }

    @Override
    public void deleteFile(String fileUrl) {
        if (fileUrl == null || fileUrl.isBlank()) {
            return;
        }

        try {
            String prefix = String.format("https://firebasestorage.googleapis.com/v0/b/%s/o/", BUCKET_NAME);
            if (!fileUrl.startsWith(prefix)) {
                log.warn("Skipping deletion, URL does not belong to this bucket: {}", fileUrl);
                return;
            }

            String encodedPath = fileUrl.substring(prefix.length());
            int tokenIndex = encodedPath.indexOf("?");
            if (tokenIndex != -1) {
                encodedPath = encodedPath.substring(0, tokenIndex);
            }
            String blobName = encodedPath.replace("%2F", "/");

            Storage storage = StorageClient.getInstance().bucket().getStorage();
            BlobId blobId = BlobId.of(BUCKET_NAME, blobName);
            boolean deleted = storage.delete(blobId);
            if (deleted) {
                log.info("File deleted from Firebase Storage: {}", blobName);
            } else {
                log.warn("File not found in Firebase Storage: {}", blobName);
            }
        } catch (Exception e) {
            log.error("Failed to delete file from Firebase Storage", e);
        }
    }
}
