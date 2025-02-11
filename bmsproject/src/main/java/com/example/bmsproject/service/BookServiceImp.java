package com.example.bmsproject.service;

import com.example.bmsproject.entities.Book;
import com.example.bmsproject.repository.BookRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@Slf4j
public class BookServiceImp implements BookService{
    static String DIRECTORY_PATH = "/u01/uploads/";
    @Autowired
    private BookRepository bookRepository;
    @Override
    public Map<String, String> uploadImageToFileSystem(MultipartFile file, Book books) {
        Map<String, String> responseData = new HashMap<>();
        Book users1=bookRepository.findByTitle(books.getTitle()).orElse(null);
        if(users1==null) {
            if (file != null) {
                String filePath = saveFileToStorage(file);
                books.setFilepath(DIRECTORY_PATH + filePath);
                books.setType(file.getContentType());
                books.setName(file.getOriginalFilename());
            }

            Book storeInfo = bookRepository.save(books);
            if (storeInfo != null) {
                responseData.put("code", "00");
                responseData.put("message", "Book saved successfully");
                responseData.put("requestId", String.valueOf(storeInfo.getId()));
            } else {
                responseData.put("code", "90");
                responseData.put("message", "Failed to save Book");
            }

        } else {
            responseData.put("code", "99");
            responseData.put("message", "Book already exists");
        }
        return responseData;
    }

    @Override
    public byte[] downloadImageFromFileSystem(String filepath) throws IOException {
        byte[] images = Files.readAllBytes(new File(filepath).toPath());
        return images;
    }

    public String saveFileToStorage(MultipartFile file) {

        String extensionType = file.getContentType();

        String extension = "";

        if (extensionType != null && !extensionType.isEmpty()) {
            String[] parts = extensionType.split("/");
            if (parts.length > 1) {
                extension = "." + parts[1];
            }
        }
        String fileName = UUID.randomUUID().toString().replace("-", "") + extension;

        try {
            File directory = new File(DIRECTORY_PATH);
            if (!directory.exists()) {
                directory.mkdirs();
            }
            File outputFile = new File(DIRECTORY_PATH + fileName);

            FileOutputStream outputStream = new FileOutputStream(outputFile);
            outputStream.write(file.getBytes());
            outputStream.close();

            log.info("File saved successfully to: " + outputFile.getAbsolutePath());
        } catch (IOException e) {
            log.info("Error saving file: " + e.getMessage());
        }
        return fileName;
    }
}
