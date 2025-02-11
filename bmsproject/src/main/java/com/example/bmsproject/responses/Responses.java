package com.example.bmsproject.responses;


import com.example.bmsproject.dto.StudentProfile;

import java.util.List;

public class Responses {
    private String code;
    private String message;



    public Responses(String code, String message) {
        this.code = code;
        this.message = message;
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

    public Responses() {
    }

}
