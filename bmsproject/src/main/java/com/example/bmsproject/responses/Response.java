package com.example.bmsproject.responses;

import com.example.bmsproject.dto.StudentProfile;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class Response {
    private String code;
    private String message;
    private List<StudentProfile> profile;

    public Response(String code, String message, List<StudentProfile> profile) {
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

    public List<StudentProfile> getProfile() {
        return profile;
    }

    public void setProfile(List<StudentProfile> profile) {
        this.profile = profile;
    }

    public Response() {
    }
}
