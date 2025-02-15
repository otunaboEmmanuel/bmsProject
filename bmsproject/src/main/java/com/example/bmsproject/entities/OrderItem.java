package com.example.bmsproject.entities;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "order_id") // Refers to BookOrder, not Order
    private BookOrder order;

    @ManyToOne
    @JoinColumn(name = "book_id", referencedColumnName = "id")
    private Book book; // Book purchased

    private int quantity;

    public OrderItem(BookOrder order, Book book, int quantity) {
        this.order = order;
        this.book = book;
        this.quantity = quantity;
    }

    public OrderItem() {
    }

}
