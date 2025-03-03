package com.example.bmsproject.controller;

import com.example.bmsproject.dto.MessageDto;
import com.example.bmsproject.entities.Messages;
import com.example.bmsproject.entities.Users;
import com.example.bmsproject.repository.MessageRepository;
import com.example.bmsproject.repository.UserRepository;
import com.example.bmsproject.responses.Responses;
import com.example.bmsproject.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin
@RequestMapping("/messages")
public class MessageController {
    @Autowired
    private MessageRepository messageRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private MessageService messageService;
    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestBody MessageDto messageDto){
        Users users= userRepository.findById(messageDto.getUserId()).orElse(null);
        if (users!=null){
            Messages messages=new Messages();
            messages.setUser(users);
            messages.setContent(messageDto.getMessage());
            messages.setAdminMessage(messageDto.isAdminMessage());
            messageRepository.save(messages);
            return new ResponseEntity<>(new Responses("00", "message sent"), HttpStatus.OK);
        }else return new ResponseEntity<>(new Responses("99", "user not found"), HttpStatus.NOT_FOUND);
    }
    @GetMapping("/{userId}")
    public List<MessageDto> getMessagesByUser(@PathVariable Integer userId) {
        return messageService.getMessagesByUser(userId);
    }
    @GetMapping("/all")
    public ResponseEntity<List<MessageDto>> getAll()
    {
        List<MessageDto> messageDtoList=messageRepository.findAll().stream()
                .map(MessageDto::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(messageDtoList);
    }
    @PostMapping("/reply")
    public ResponseEntity<?> replyMessage(@RequestBody MessageDto messageDto){
        Users users= userRepository.findById(messageDto.getUserId()).orElse(null);
        if (users!=null){
            Messages messages=new Messages();
            messages.setUser(users);
            messages.setContent(messageDto.getMessage());
            messages.setAdminMessage(messageDto.isAdminMessage());
            messageRepository.save(messages);
            return new ResponseEntity<>(new Responses("00", "message sent"), HttpStatus.OK);
        }else return new ResponseEntity<>(new Responses("99", "user not found"), HttpStatus.NOT_FOUND);
    }
}
