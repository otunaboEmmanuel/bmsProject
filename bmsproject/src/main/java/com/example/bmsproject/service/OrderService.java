package com.example.bmsproject.service;

import com.example.bmsproject.entities.*;
import com.example.bmsproject.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private BookRepository bookRepository;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private OrderItemRepository orderItemRepository;
    public BookOrder checkout(Integer userId) {
        Users user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        List<Cart> cartItems = cartRepository.findByUser(user);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        List<OrderItem> orderItems = cartItems.stream().map(cart -> {
            Book book = cart.getBook();
            book.setQuantity(book.getQuantity() - cart.getQuantity());
            bookRepository.save(book);
            return new OrderItem(null, book, cart.getQuantity());
        }).collect(Collectors.toList());

        double totalPrice = orderItems.stream()
                .mapToDouble(orderItem -> orderItem.getBook().getPrice() * orderItem.getQuantity())
                .sum();

        BookOrder order = new BookOrder(user, orderItems, totalPrice);
        orderRepository.save(order);

        orderItems.forEach(orderItem -> orderItem.setOrder(order));
        orderItemRepository.saveAll(orderItems);

        cartRepository.deleteAll(cartItems);

        return order;
    }
    // Fetch all orders
    public List<BookOrder> getAllOrders() {
        return orderRepository.findAll();
    }
    public List<BookOrder> getOrdersByStudent(Integer studentId) {
        Users student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return orderRepository.findByStudent(student);
    }

}
