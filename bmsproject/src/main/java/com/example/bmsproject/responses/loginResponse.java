package com.example.bmsproject.responses;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class loginResponse {
    private String code;
    private String message;
    private String role;

    public loginResponse(String code, String message, String role) {
        this.code = code;
        this.message = message;
        this.role = role;
    }

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

    public loginResponse() {
    }
}
