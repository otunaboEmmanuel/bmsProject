package com.example.bmsproject.repository;

import com.example.bmsproject.entities.Admins;
import com.example.bmsproject.entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admins,Integer> {
    Optional<Admins> findByEmail(String email);
}
