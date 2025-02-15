package com.example.bmsproject.entities;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@Entity

@Table(name = "book_order") // Avoid using reserved keywords
public class BookOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private Users student; // Student who made the order

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> books; // Books in the order

    private double totalPrice;
    private Date createdAt;

    public BookOrder(Users student, List<OrderItem> books, double totalPrice) {
        this.student = student;
        this.books = books;
        this.totalPrice = totalPrice;
        this.createdAt = new Date();
    }

    public BookOrder() {
    }
}



