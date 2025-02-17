package com.example.bmsproject.dto;

import com.example.bmsproject.entities.BookOrder;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

public class BookOrderDto {
    private Integer id;
    private double totalPrice;
    private Date createdAt;
    private List<OrderItemDto> books;

    public BookOrderDto(BookOrder order) {
        this.id = order.getId();
        this.totalPrice = order.getTotalPrice();
        this.createdAt = order.getCreatedAt();
        this.books = order.getBooks().stream()
                .map(OrderItemDto::new)
                .collect(Collectors.toList());
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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
