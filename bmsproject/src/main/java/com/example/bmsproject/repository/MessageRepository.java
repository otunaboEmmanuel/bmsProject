package com.example.bmsproject.repository;

import com.example.bmsproject.entities.Messages;
import com.example.bmsproject.entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Messages,Integer> {
    List<Messages> findByUser(Users users);
}
