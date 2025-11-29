package ee.pw.ecowardrobebackend.controller;

import ee.pw.ecowardrobebackend.dto.WardrobeItemDTO;
import ee.pw.ecowardrobebackend.entity.Product;
import ee.pw.ecowardrobebackend.entity.WardrobeItem;
import ee.pw.ecowardrobebackend.repository.ProductRepository;
import ee.pw.ecowardrobebackend.repository.WardrobeItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/wardrobe")
@RequiredArgsConstructor
public class WardrobeController {

    private final WardrobeItemRepository wardrobeItemRepository;
    private final ProductRepository productRepository;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<WardrobeItemDTO>> getUserWardrobe(@PathVariable UUID userId) {
        List<WardrobeItemDTO> items = wardrobeItemRepository.findByUserId(userId)
            .stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(items);
    }

    @GetMapping("/user/{userId}/category/{category}")
    public ResponseEntity<List<WardrobeItemDTO>> getUserWardrobeByCategory(@PathVariable UUID userId, @PathVariable String category) {
        List<WardrobeItemDTO> items = wardrobeItemRepository.findByUserIdAndProductCategory(userId, category)
            .stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(items);
    }

    @PostMapping
    public ResponseEntity<WardrobeItemDTO> addToWardrobe(@RequestBody WardrobeItemDTO dto) {
        WardrobeItem item = new WardrobeItem();
        item.setUserId(dto.getUserId());

        Product product = productRepository.findById(dto.getProductId()).orElseThrow();
        item.setProduct(product);

        item.setSize(dto.getSize());
        item.setColor(dto.getColor());
        item.setQuantity(dto.getQuantity());
        item.setCondition(dto.getCondition());
        item.setIsFavorite(dto.getIsFavorite() != null ? dto.getIsFavorite() : false);

        WardrobeItem saved = wardrobeItemRepository.save(item);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToDTO(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<WardrobeItemDTO> updateWardrobe(@PathVariable UUID id, @RequestBody WardrobeItemDTO dto) {
        return wardrobeItemRepository.findById(id)
            .map(item -> {
                item.setSize(dto.getSize());
                item.setColor(dto.getColor());
                item.setQuantity(dto.getQuantity());
                item.setCondition(dto.getCondition());
                item.setIsFavorite(dto.getIsFavorite());
                WardrobeItem updated = wardrobeItemRepository.save(item);
                return ResponseEntity.ok(mapToDTO(updated));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFromWardrobe(@PathVariable UUID id) {
        wardrobeItemRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private WardrobeItemDTO mapToDTO(WardrobeItem item) {
        WardrobeItemDTO dto = new WardrobeItemDTO();
        dto.setId(item.getId());
        dto.setUserId(item.getUserId());
        dto.setProductId(item.getProduct().getId());
        dto.setSize(item.getSize());
        dto.setColor(item.getColor());
        dto.setQuantity(item.getQuantity());
        dto.setCondition(item.getCondition());
        dto.setIsFavorite(item.getIsFavorite());
        dto.setAddedAt(item.getAddedAt());
        dto.setUpdatedAt(item.getUpdatedAt());
        return dto;
    }
}
