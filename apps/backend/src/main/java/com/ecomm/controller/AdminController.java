package com.ecomm.controller;

import com.ecomm.dto.ProductDTO;
import com.ecomm.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ProductService productService;
    private final Keycloak keycloak;

    @Value("${keycloak.realm}")
    private String realm;

    @GetMapping("/products")
    public List<ProductDTO> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/users")
    public List<UserRepresentation> getAllUsers() {
        return keycloak.realm(realm).users().list();
    }
}
