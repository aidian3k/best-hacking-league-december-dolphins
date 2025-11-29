package ee.pw.ecowardrobebackend.controller;

import ee.pw.ecowardrobebackend.dto.product.CreateProductDTO;
import ee.pw.ecowardrobebackend.dto.product.WardrobeItemsDTO;
import ee.pw.ecowardrobebackend.entity.product.Product;
import ee.pw.ecowardrobebackend.entity.user.User;
import ee.pw.ecowardrobebackend.repository.ProductRepository;
import ee.pw.ecowardrobebackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @PostMapping("/create/{id}")
    public ResponseEntity<Product> createProduct(
            @RequestBody CreateProductDTO createProductDTO,
            @PathVariable(name = "id") UUID userId
    ) {
        final Product product = Product
                .builder()
                .productInformation(createProductDTO.productInformation())
                .materialCompositions(createProductDTO.materialCompositions())
                .productEnvironmentImpact(createProductDTO.productEnvironmentImpact())
                .manufacturing(createProductDTO.manufacturing())
                .durabilityAndCare(createProductDTO.durabilityAndCare())
                .endOfLife(createProductDTO.endOfLife())
                .supplyChainTraceability(createProductDTO.supplyChainTraceability())
                .metadata(createProductDTO.metadata())
                .image(createProductDTO.image())
                .build();
        final Product persistedProduct = productRepository.save(product);
        return ResponseEntity.ok(persistedProduct);
    }

    @GetMapping("/{id}")
    public ResponseEntity<WardrobeItemsDTO> getUserWardrobeItems(@PathVariable(name = "id") UUID userId) {
        final User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User with id " + userId + " not found"));

        return new ResponseEntity<>(new WardrobeItemsDTO(user.getProducts()), HttpStatus.OK);
    }
}
