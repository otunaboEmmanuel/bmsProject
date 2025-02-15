package com.example.bmsproject.controller;

import com.example.bmsproject.entities.BookOrder;
import com.example.bmsproject.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/orders")
@RestController
@CrossOrigin
public class OrderController {
    @Autowired
    private OrderService orderService;

    // Fetch all orders
    @GetMapping("/all")
    public ResponseEntity<List<BookOrder>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // Fetch orders for a specific student
    @GetMapping("/{studentId}")
    public ResponseEntity<List<BookOrder>> getOrdersByStudent(@PathVariable Integer studentId) {
        return ResponseEntity.ok(orderService.getOrdersByStudent(studentId));
    }

    // Checkout (Create an order from cart)
    @PostMapping("/checkout/{userId}")
    public ResponseEntity<?> checkout(@PathVariable Integer userId) {
        try {
            BookOrder order = orderService.checkout(userId);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
