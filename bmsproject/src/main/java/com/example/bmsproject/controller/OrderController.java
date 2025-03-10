package com.example.bmsproject.controller;

import com.example.bmsproject.dto.BookOrderDto;
import com.example.bmsproject.dto.BookOrderStudentDto;
import com.example.bmsproject.entities.BookOrder;
import com.example.bmsproject.repository.OrderRepository;
import com.example.bmsproject.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RequestMapping("/api/orders")
@RestController
@CrossOrigin
public class OrderController {
    @Autowired
    private OrderService orderService;
    @Autowired
    private OrderRepository orderRepository;


    @GetMapping("/{studentId}")
    public ResponseEntity<List<BookOrderDto>> getOrdersByStudent(@PathVariable Integer studentId) {
        //List<BookOrder> orders = orderService.getOrdersByStudent(studentId);
        List<BookOrder> orders = orderRepository.findAllByStatus("approved");
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
    @PutMapping("/updateStatus/{orderId}")
    public ResponseEntity<String> updateOrderStatus(@PathVariable Integer orderId, @RequestBody Map<String, String> request) {
        BookOrder order = orderRepository.findById(orderId).orElse(null);

        if (order == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found");
        }

        String status = request.get("status");

        if (!status.equalsIgnoreCase("approved") && !status.equalsIgnoreCase("denied")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid status value");
        }

        order.setStatus(status);
        orderRepository.save(order);

        return ResponseEntity.ok("Order status updated to " + status);
    }

}
