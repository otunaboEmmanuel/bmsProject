package com.example.bmsproject.dto;

import com.example.bmsproject.entities.OrderItem;

public class OrderItemDto {
    private String title;
    private int quantity;

    public OrderItemDto(OrderItem item) {
        this.title = item.getBook().getTitle();
        this.quantity = item.getQuantity();
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
