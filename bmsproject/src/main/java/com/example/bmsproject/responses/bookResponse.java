package com.example.bmsproject.responses;

import com.example.bmsproject.dto.BookDetail;
import com.example.bmsproject.dto.StudentProfile;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class bookResponse {
    private String code;
    private String message;
    private List<BookDetail> profile;

    public bookResponse(String code, String message, List<BookDetail> profile) {
        this.code = code;
        this.message = message;
        this.profile = profile;
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

    public List<BookDetail> getProfile() {
        return profile;
    }

    public void setProfile(List<BookDetail> profile) {
        this.profile = profile;
    }

    public bookResponse() {
    }
}
