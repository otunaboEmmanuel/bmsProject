package com.example.bmsproject.service;

import com.example.bmsproject.entities.Admins;
import com.example.bmsproject.entities.Users;
import com.example.bmsproject.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminServiceImp implements AdminService{
    @Autowired
    private AdminRepository adminRepository;
    @Autowired
    private PasswordEncoder bcryptEncoder;
    @Override
    public Admins addAdmin(Admins admins) {
        Admins admins1=adminRepository.findByEmail(admins.getEmail()).orElse(null);
        admins.setPassword(bcryptEncoder.encode(admins.getPassword()));
        return (admins1==null)? adminRepository.save(admins):null;
    }
}
