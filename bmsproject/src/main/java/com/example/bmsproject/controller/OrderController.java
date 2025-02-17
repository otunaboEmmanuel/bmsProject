package com.example.bmsproject.controller;

import com.example.bmsproject.dto.BookOrderDto;
import com.example.bmsproject.dto.BookOrderStudentDto;
import com.example.bmsproject.entities.BookOrder;
import com.example.bmsproject.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RequestMapping("/api/orders")
@RestController
@CrossOrigin
public class OrderController {
    @Autowired
    private OrderService orderService;


    @GetMapping("/{studentId}")
    public ResponseEntity<List<BookOrderDto>> getOrdersByStudent(@PathVariable Integer studentId) {
        List<BookOrder> orders = orderService.getOrdersByStudent(studentId);
        List<BookOrderDto> orderDTOs = orders.stream()
                .map(BookOrderDto::new) // This should now work
                .collect(Collectors.toList());
        return ResponseEntity.ok(orderDTOs);
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
    @GetMapping("/all")
    public ResponseEntity<List<BookOrderStudentDto>> getAllOrders() {
        List<BookOrderStudentDto> orderDTOs = orderService.getAllOrders().stream()
                .map(BookOrderStudentDto::new) // Convert each BookOrder to BookOrderWithStudentDto
                .collect(Collectors.toList());
        return ResponseEntity.ok(orderDTOs);
    }

}
