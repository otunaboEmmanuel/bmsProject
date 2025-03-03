package com.example.bmsproject.controller;

import com.example.bmsproject.dto.LoginDto;
import com.example.bmsproject.dto.StudentProfile;
import com.example.bmsproject.entities.Admins;
import com.example.bmsproject.entities.Users;
import com.example.bmsproject.repository.AdminRepository;
import com.example.bmsproject.repository.UserRepository;
import com.example.bmsproject.responses.Response;
import com.example.bmsproject.responses.Responses;
import com.example.bmsproject.responses.loginResponse;
import com.example.bmsproject.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin")
@CrossOrigin
public class AdminController {
    @Autowired
    private AdminService adminService;
    @Autowired
    private AdminRepository adminRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private UserRepository userRepository;
    @PostMapping("/add")
    public ResponseEntity<?> addStudent(@RequestBody Admins admins) {
        Responses responses = new Responses();
        Admins admins1 = adminService.addAdmin(admins);
        return (admins1== null) ? new ResponseEntity<>(new Responses("100", "email or username already in use"), HttpStatus.OK)
                : new ResponseEntity<>(new Responses("00", "admin saved successfully"), HttpStatus.OK);
    }
    @PostMapping("/login")
    public ResponseEntity<?> LoginUser (@RequestBody LoginDto loginDto) {
        Admins login = adminRepository.findByEmail(loginDto.getEmail()).orElse(null);
        if (login != null) {
            String password = loginDto.getPassword();
            String encodedPassword = login.getPassword();
            Boolean isPwdRight = passwordEncoder.matches(password, encodedPassword);
            if (isPwdRight) {
                return new ResponseEntity<>(new loginResponse("00", " Admin Login success", login.getRole(), login.getId(), login.getUserName()), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(new Responses("111", "password doesn't match"), HttpStatus.OK);
            }
        } else {
            return new ResponseEntity<>(new Responses("111", "Email doesn't exist"), HttpStatus.OK);
        }
    }
    @GetMapping("/allStudents")
    public ResponseEntity<?> getStudents() {
        List<Admins> usersList = adminRepository.findAll();

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
//    @DeleteMapping("/deleted")
//    public String delete(@RequestBody LoginDto loginDto){
//        Users users1=userRepository.findById(loginDto.getUserId()).orElse(null);
//        if (users1==null){
//            return "user doesn't exist";
//        }else
//            userRepository.deleteById(loginDto.getUserId());
//        return "successfully deleted";
//    }
   @DeleteMapping("/deleteUser/{id}")
      public ResponseEntity<?> deleteUser(@PathVariable Integer id){
     Users users=userRepository.findById(id).orElse(null);
    if (users==null){
        return new ResponseEntity<>(new Responses("99", "USER DOESN'T EXIST"),HttpStatus.OK);
    }else {
        userRepository.deleteById(id);
        return new ResponseEntity<>(new Responses("00", "SUCCESSFULLY DELETED"),HttpStatus.OK);
    }
}
}
