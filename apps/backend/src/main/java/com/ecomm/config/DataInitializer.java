package com.ecomm.config;

import com.ecomm.model.Category;
import com.ecomm.model.Product;
import com.ecomm.repository.CategoryRepository;
import com.ecomm.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    @Override
    public void run(String... args) {
        if (categoryRepository.count() == 0) {
            Category electronics = new Category();
            electronics.setName("Electronics");
            electronics.setDescription("High-tech gadgets");

            Category fashion = new Category();
            fashion.setName("Fashion");
            fashion.setDescription("Premium apparel");

            categoryRepository.saveAll(List.of(electronics, fashion));

            if (productRepository.count() == 0) {
                Product macbook = Product.builder()
                        .name("MacBook Pro M3 Max")
                        .description("Unprecedented performance for professional creators.")
                        .price(3499.00)
                        .stockQuantity(10)
                        .imageUrl("https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000")
                        .additionalImages(List.of(
                            "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=1000",
                            "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=1000"
                        ))
                        .rating(4.9)
                        .reviewCount(128)
                        .sellerId("system-admin")
                        .category(electronics)
                        .build();
                
                Product headphones = Product.builder()
                        .name("Premium ANC Headphones")
                        .description("Industry-leading noise cancellation.")
                        .price(399.00)
                        .stockQuantity(50)
                        .imageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000")
                        .additionalImages(List.of(
                            "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=1000",
                            "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=1000"
                        ))
                        .rating(4.7)
                        .reviewCount(450)
                        .sellerId("system-admin")
                        .category(electronics)
                        .build();

                productRepository.saveAll(List.of(macbook, headphones));
            }
        }
    }
}
