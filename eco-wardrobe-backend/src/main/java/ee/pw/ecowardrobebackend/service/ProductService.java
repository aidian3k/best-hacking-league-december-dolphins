package ee.pw.ecowardrobebackend.service;

import ee.pw.ecowardrobebackend.dto.product.CreateProductDTO;
import ee.pw.ecowardrobebackend.dto.product.WardrobeItemsDTO;
import ee.pw.ecowardrobebackend.entity.product.Product;
import ee.pw.ecowardrobebackend.entity.user.User;
import ee.pw.ecowardrobebackend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final UserService userService;

    @Transactional
    public Product createProduct(CreateProductDTO createProductDTO, UUID userId) {
        final User user = userService.getUserById(userId);
        final Product product = Product.builder()
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
        final Product savedProduct =  productRepository.save(product);
        user.getProducts().add(savedProduct);
        userService.saveUser(user);
        return savedProduct;
    }

    public WardrobeItemsDTO getUserWardrobeItems(UUID userId) {
        final User user = userService.getUserById(userId);
        return new WardrobeItemsDTO(user.getProducts());
    }
}
