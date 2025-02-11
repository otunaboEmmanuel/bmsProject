package com.example.bmsproject.service;

import com.example.bmsproject.entities.Book;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

public interface BookService {
    Map<String, String> uploadImageToFileSystem(MultipartFile file, Book books);

    byte[] downloadImageFromFileSystem(String filepath) throws IOException;
}
