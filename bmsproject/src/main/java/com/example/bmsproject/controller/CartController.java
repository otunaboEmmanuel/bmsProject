package com.example.bmsproject.controller;

import com.example.bmsproject.dto.LoginDto;
import com.example.bmsproject.entities.Book;
import com.example.bmsproject.entities.Cart;
import com.example.bmsproject.entities.Users;
import com.example.bmsproject.repository.BookRepository;
import com.example.bmsproject.repository.CartRepository;
import com.example.bmsproject.repository.UserRepository;
import com.example.bmsproject.responses.Responses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/cart")
@CrossOrigin
@RestController
public class CartController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private BookRepository bookRepository;
    @PostMapping("/addCart")
    public ResponseEntity<?> addCart(@RequestBody LoginDto user) {
        // Check if user exists first
        Users user1 = userRepository.findById(user.getUserId()).orElse(null);
        if (user1 == null) {
            return new ResponseEntity<>(new Responses("99", "USER DOESN'T EXIST"), HttpStatus.OK);
        }

        // Proceed if the user exists, now check for the book
        Book book = bookRepository.findById(user.getBookId()).orElse(null);
        if (book == null) {
            return new ResponseEntity<>(new Responses("00", "could not find Book"), HttpStatus.OK);
        }

        Cart existingCart = cartRepository.findByUserAndBook(user1, book);
        if (existingCart != null) {
            int currentQuantity = (existingCart.getQuantity() != null) ? existingCart.getQuantity() : 0;
            existingCart.setQuantity(currentQuantity + 1);
            cartRepository.save(existingCart);
        } else {
            Cart cart = new Cart(book, user1, 1);
            cartRepository.save(cart);
        }

        return new ResponseEntity<>(new Responses("00", "successfully added to cart"), HttpStatus.OK);
    }
    @GetMapping("/getCartDetails/{userId}")
    public ResponseEntity<?> getCartDetails(@PathVariable Integer userId) {
    // Retrieve user by ID
    Users user1 = userRepository.findById(userId).orElse(null);
    if (user1 != null) {
        // Retrieve the user's carts
        List<Cart> carts = cartRepository.findByUser(user1);
        return new ResponseEntity<>(carts, HttpStatus.OK);
    }
    // If user doesn't exist
    return new ResponseEntity<>(new Responses("99", "USER DOESN'T EXIST"), HttpStatus.OK);
}

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteCart(@PathVariable Integer id){
        Cart cart=cartRepository.findById(id).orElse(null);
        if (cart==null){
            return new ResponseEntity<>(new Responses("99", "cart Id does not exist"), HttpStatus.OK);
        }else {
            cartRepository.deleteById(id);
            return new ResponseEntity<>(new Responses("00", "Successfully deleted"), HttpStatus.OK);
        }
    }
}
