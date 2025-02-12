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
        Users user1=userRepository.findById(user.getUserId()).orElse(null);
        if (user1==null) {
            Book book = bookRepository.findById(user.getBookId()).orElse(null);
            if (book == null) {
                return new ResponseEntity<>(new Responses("00", "could not find Book "), HttpStatus.OK);
            }
            Cart cart = new Cart(book, user1);
            cartRepository.save(cart);
            return new ResponseEntity<>(new Responses("00", "successfully added to cart "), HttpStatus.OK);

        }else
        {
            return new ResponseEntity<>(new Responses("99", "USER DOESN'T EXIST"), HttpStatus.OK);
        }
    }
    @GetMapping("/getCartDetails")
    public ResponseEntity<?> getCartDetails(@RequestBody LoginDto user){
        Users user1 = userRepository.findById(user.getUserId()).orElse(null);
        if (user1!=null)
        {
           List<Cart> carts= cartRepository.findByUser(user1);
           return new ResponseEntity<>(carts,HttpStatus.OK);
        }
        return new ResponseEntity<>(new Responses("99","USER DOESN'T EXIST"),HttpStatus.OK);
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
