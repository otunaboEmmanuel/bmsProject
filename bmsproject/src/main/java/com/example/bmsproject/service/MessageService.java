package com.example.bmsproject.service;

import com.example.bmsproject.dto.MessageDto;
import com.example.bmsproject.entities.Messages;
import com.example.bmsproject.entities.Users;
import com.example.bmsproject.repository.MessageRepository;
import com.example.bmsproject.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageService {
    @Autowired
    private MessageRepository messageRepository;
    @Autowired
    private UserRepository userRepository;
    public List<MessageDto> getMessagesByUser(Integer userId) {
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Messages> messages = messageRepository.findByUser(user);
        return messages.stream()
                .map(MessageDto::new)
                .collect(Collectors.toList());
    }
}
