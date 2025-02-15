package com.example.bmsproject.responses;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class loginResponse {
    private String code;
    private String message;
    private String role;
    private Integer id;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public loginResponse(String code, String message, String role, Integer id) {
        this.code = code;
        this.message = message;
        this.role = role;
        this.id = id;
    }

    public loginResponse() {
    }
}
