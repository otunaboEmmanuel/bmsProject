package com.example.bmsproject.entities;

import lombok.*;

import javax.persistence.*;




@Getter
@Setter
@Entity
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;
    @ManyToOne
    @JoinColumn(name = "book_id",referencedColumnName = "id")
    private Book book;
    @ManyToOne
    @JoinColumn(name = "user_id",referencedColumnName = "id")
    private Users user;


    public Cart(Book book, Users user) {
        this.book = book;
        this.user = user;
    }

    public Cart() {
    }
}
