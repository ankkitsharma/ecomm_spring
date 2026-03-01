package com.ecomm.controller;

import com.ecomm.dto.OrderDTO;
import com.ecomm.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/buyer")
@RequiredArgsConstructor
public class BuyerController {

    private final OrderService orderService;

    @GetMapping("/orders")
    public List<OrderDTO> getMyOrders(@AuthenticationPrincipal Jwt jwt) {
        return orderService.getBuyerOrders(jwt.getSubject());
    }

    @PostMapping("/orders")
    public OrderDTO placeOrder(@RequestBody OrderDTO orderDTO, @AuthenticationPrincipal Jwt jwt) {
        return orderService.placeOrder(orderDTO, jwt.getSubject());
    }
}
