package com.ecomm.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private Integer stockQuantity;
    private String imageUrl;
    private List<String> additionalImages;
    private Double rating;
    private Integer reviewCount;
    private Long categoryId;
    private String categoryName;
    private String sellerId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
