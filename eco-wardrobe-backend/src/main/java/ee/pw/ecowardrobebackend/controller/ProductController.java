package ee.pw.ecowardrobebackend.controller;

import ee.pw.ecowardrobebackend.dto.product.CreateProductDTO;
import ee.pw.ecowardrobebackend.dto.product.WardrobeItemsDTO;
import ee.pw.ecowardrobebackend.entity.product.Product;
import ee.pw.ecowardrobebackend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @PostMapping("/create/{id}")
    public ResponseEntity<Product> createProduct(
            @RequestBody CreateProductDTO createProductDTO,
            @PathVariable(name = "id") UUID userId
    ) {
        final Product product = productService.createProduct(createProductDTO, userId);
        return ResponseEntity.ok(product);
    }

    @GetMapping("/{id}")
    public ResponseEntity<WardrobeItemsDTO> getUserWardrobeItems(@PathVariable(name = "id") UUID userId) {
        final WardrobeItemsDTO wardrobeItems = productService.getUserWardrobeItems(userId);
        return new ResponseEntity<>(wardrobeItems, HttpStatus.OK);
    }
}
