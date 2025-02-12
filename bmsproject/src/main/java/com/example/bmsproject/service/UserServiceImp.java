package com.example.bmsproject.service;

import com.example.bmsproject.entities.Users;
import com.example.bmsproject.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImp implements UserService{
    @Autowired
    private PasswordEncoder bcryptEncoder;
    @Autowired
    private UserRepository userRepository;
    @Override
    public Users addStudent(Users users) {
        Users users1=userRepository.findByEmail(users.getEmail()).orElse(null);
        users.setPassword(bcryptEncoder.encode(users.getPassword()));
        return (users1==null)? userRepository.save(users):null;
    }




}
