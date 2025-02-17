package com.example.bmsproject.dto;

import com.example.bmsproject.entities.BookOrder;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

public class BookOrderStudentDto {
    private Integer id;
    private String username;
    private double totalPrice;
    private Date createdAt;
    private List<OrderItemDto> books;

    public BookOrderStudentDto(BookOrder order) {
        this.id = order.getId();
        this.username = order.getStudent().getUserName(); // Fetch the username
        this.totalPrice = order.getTotalPrice();
        this.createdAt = order.getCreatedAt();
        this.books = order.getBooks().stream()
                .map(OrderItemDto::new)
                .collect(Collectors.toList());
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public List<OrderItemDto> getBooks() {
        return books;
    }

    public void setBooks(List<OrderItemDto> books) {
        this.books = books;
    }
}
