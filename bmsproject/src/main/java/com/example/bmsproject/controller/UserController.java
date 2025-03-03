package com.example.bmsproject.controller;


import com.example.bmsproject.dto.LoginDto;
import com.example.bmsproject.dto.StudentProfile;
import com.example.bmsproject.entities.Users;
import com.example.bmsproject.repository.UserRepository;
import com.example.bmsproject.responses.Response;
import com.example.bmsproject.responses.Responses;
import com.example.bmsproject.responses.loginResponse;
import com.example.bmsproject.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin
@RequestMapping("/students")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    //register new student
    @PostMapping("/add")
    public ResponseEntity<?> addStudent(@RequestBody Users users) {
        Responses responses = new Responses();
        Users users1 = userService.addStudent(users);
        return (users1 == null) ? new ResponseEntity<>(new Responses("100", "email or username already in use"), HttpStatus.OK)
                : new ResponseEntity<>(new Responses("00", "student saved successfully"), HttpStatus.OK);
    }


    @PostMapping("/login")
    public ResponseEntity<?> LoginUser (@RequestBody LoginDto loginDto) {
        Users login = userRepository.findByEmail(loginDto.getEmail()).orElse(null);
        if (login != null) {
            String password = loginDto.getPassword();
            String encodedPassword = login.getPassword();
            Boolean isPwdRight = passwordEncoder.matches(password, encodedPassword);
            if (isPwdRight) {
                return new ResponseEntity<>(new loginResponse("00", " Student Login success", login.getRole(), login.getId(),login.getUserName()), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(new Responses("111", "password doesn't match"), HttpStatus.OK);
            }
        } else {
            return new ResponseEntity<>(new Responses("111", "Email doesn't exist"), HttpStatus.OK);
        }
    }
    @GetMapping("/allStudents")
    public ResponseEntity<?> getStudents() {
        List<Users> usersList = userRepository.findAll();

        if (!usersList.isEmpty()) {
            List<StudentProfile> studentProfiles = usersList.stream().map(user -> {
                StudentProfile studentProfile = new StudentProfile();
                studentProfile.setUserId(user.getId());
                studentProfile.setUserName(user.getUserName());
                studentProfile.setEmail(user.getEmail());
                return studentProfile;
            }).collect(Collectors.toList());

            return new ResponseEntity<>(new Response("00", "Success", studentProfiles), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new Responses("99", "No students found"), HttpStatus.NOT_FOUND);
        }
    }
    //alternatives
//    @GetMapping("/allStudents")
//    public ResponseEntity<?> getStudents() {
//        List<Users> usersList = userRepository.findAll();  // Retrieve all users
//
//        if (usersList.isEmpty()) {
//            return new ResponseEntity<>(new Response("99", "No students found"), HttpStatus.NOT_FOUND);
//        }
//
//        List<StudentProfile> studentProfiles = new ArrayList<>();
//
//        for (Users user : usersList) {
//            StudentProfile studentProfile = new StudentProfile();
//            studentProfile.setUserId(user.getId());
//            studentProfile.setUserName(user.getUserName());
//            studentProfile.setEmail(user.getEmail());
//            studentProfiles.add(studentProfile);
//        }
//
//        return new ResponseEntity<>(new Response("00", "Success", studentProfiles), HttpStatus.OK);
//    }

}
