package com.example.bmsproject.repository;

import com.example.bmsproject.entities.Book;
import com.example.bmsproject.entities.Cart;
import com.example.bmsproject.entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartRepository extends JpaRepository<Cart,Integer> {
    public List<Cart> findByUser(Users user);
    Cart findByUserAndBook(Users user, Book book);
}
