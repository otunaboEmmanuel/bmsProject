package com.example.bmsproject.service;

import com.example.bmsproject.entities.Admins;
import com.example.bmsproject.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class Utility {
    @Autowired
    private AdminRepository adminRepository;
    public Admins validateUser(String adminId) {
        return adminRepository.findById(Integer.valueOf(adminId)).orElse(null);
    }
}
