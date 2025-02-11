package com.example.bmsproject.repository;

import com.example.bmsproject.entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository <Users,Integer>{
    Optional<Users> findByEmail(String email);
    Optional<Users> findByEmailAndPassword(String email, String Password);

}
