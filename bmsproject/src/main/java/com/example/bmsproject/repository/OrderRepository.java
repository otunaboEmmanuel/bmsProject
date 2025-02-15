package com.example.bmsproject.repository;

import com.example.bmsproject.entities.BookOrder;
import com.example.bmsproject.entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<BookOrder, Integer> {
    List<BookOrder> findByStudent(Users student);

}
