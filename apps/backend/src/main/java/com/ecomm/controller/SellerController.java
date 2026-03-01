package com.ecomm.controller;

import com.ecomm.dto.ProductDTO;
import com.ecomm.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seller")
@RequiredArgsConstructor
public class SellerController {

    private final ProductService productService;

    @GetMapping("/products")
    public List<ProductDTO> getMyProducts(@AuthenticationPrincipal Jwt jwt) {
        String sellerId = jwt.getSubject();
        return productService.getProductsBySeller(sellerId);
    }

    @PostMapping("/products")
    public ProductDTO createProduct(@RequestBody ProductDTO productDTO, @AuthenticationPrincipal Jwt jwt) {
        String sellerId = jwt.getSubject();
        return productService.createProduct(productDTO, sellerId);
    }

    @PutMapping("/products/{id}")
    public ProductDTO updateProduct(@PathVariable Long id, @RequestBody ProductDTO productDTO, @AuthenticationPrincipal Jwt jwt) {
        String sellerId = jwt.getSubject();
        return productService.updateProduct(id, productDTO, sellerId);
    }

    @DeleteMapping("/products/{id}")
    public void deleteProduct(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        String sellerId = jwt.getSubject();
        productService.deleteProduct(id, sellerId);
    }
}
