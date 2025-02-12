package com.example.bmsproject.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer bookId;
    private String title;
    private String author;
    private String price;
    private String level;
    private String quantity;
    private String availability;
    private String filepath;
}
