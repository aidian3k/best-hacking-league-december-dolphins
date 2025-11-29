package ee.pw.ecowardrobebackend.controller;

import ee.pw.ecowardrobebackend.dto.ProductDTO;
import ee.pw.ecowardrobebackend.entity.Product;
import ee.pw.ecowardrobebackend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductRepository productRepository;

    @GetMapping("/scan/{barcode}")
    public ResponseEntity<ProductDTO> scanProduct(@PathVariable String barcode) {
        return productRepository.findByBarcode(barcode)
            .map(p -> ResponseEntity.ok(mapToDTO(p)))
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(@RequestBody ProductDTO dto) {
        Product product = new Product();
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setCategory(dto.getCategory());
        product.setBrand(dto.getBrand());
        product.setEcoScore(dto.getEcoScore());
        product.setImageUrl(dto.getImageUrl());
        product.setBarcode(dto.getBarcode());

        Product saved = productRepository.save(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToDTO(saved));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProduct(@PathVariable UUID id) {
        return productRepository.findById(id)
            .map(p -> ResponseEntity.ok(mapToDTO(p)))
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<ProductDTO>> getByCategory(@PathVariable String category) {
        List<ProductDTO> products = productRepository.findByCategory(category)
            .stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(products);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable UUID id, @RequestBody ProductDTO dto) {
        return productRepository.findById(id)
            .map(product -> {
                product.setName(dto.getName());
                product.setDescription(dto.getDescription());
                product.setCategory(dto.getCategory());
                product.setBrand(dto.getBrand());
                product.setEcoScore(dto.getEcoScore());
                product.setImageUrl(dto.getImageUrl());
                Product updated = productRepository.save(product);
                return ResponseEntity.ok(mapToDTO(updated));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable UUID id) {
        productRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private ProductDTO mapToDTO(Product product) {
        return new ProductDTO(product.getId(), product.getName(), product.getDescription(),
            product.getCategory(), product.getBrand(), product.getEcoScore(),
            product.getImageUrl(), product.getBarcode(), product.getCreatedAt(), product.getUpdatedAt());
    }
}
