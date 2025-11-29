package com.dogumgunu.backend.service;

import org.springframework.web.multipart.MultipartFile;

public interface FirebaseStorageService {

    /**
     * Dosyayı Firebase Storage'a yükler ve public URL döner
     *
     * @param file yüklenecek multipart dosya
     * @param folder storage'daki klasör yolu (örn. "timeline")
     * @return public indirme URL'i
     */
    String uploadFile(MultipartFile file, String folder);

    /**
     * Firebase Storage'dan dosyayı public URL kullanarak siler
     *
     * @param fileUrl daha önce dönen public URL
     */
    void deleteFile(String fileUrl);
}
