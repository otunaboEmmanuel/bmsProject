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

    @Column(nullable = false)
    private Integer quantity = 0;


    public Cart(Book book, Users user, Integer quantity) {
        this.book = book;
        this.user = user;
        this.quantity = (quantity != null) ? quantity : 0;
    }

    public Cart() {
    }



}
