package com.example.bmsproject.repository;

import com.example.bmsproject.entities.Book;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BookRepository extends JpaRepository<Book,Integer> {
    Optional<Book> findByTitle(String title);
}
