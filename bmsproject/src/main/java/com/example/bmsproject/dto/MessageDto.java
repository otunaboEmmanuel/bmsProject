package com.example.bmsproject.dto;

import com.example.bmsproject.entities.Messages;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;


public class MessageDto {
    private Long id;
    private Integer userId;
    private String message;
    private boolean isAdminMessage;
    private String userName;
    private Date timestamp;

    public MessageDto(Messages message) {
        this.id = Long.valueOf(message.getId());
        this.userId = message.getUser().getId();
        this.userName = message.getUser().getUserName();

        this.message = message.getContent();
        this.isAdminMessage = message.isAdminMessage();
        this.timestamp = message.getTimestamp();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isAdminMessage() {
        return isAdminMessage;
    }

    public void setAdminMessage(boolean adminMessage) {
        isAdminMessage = adminMessage;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public MessageDto() {
    }
}
