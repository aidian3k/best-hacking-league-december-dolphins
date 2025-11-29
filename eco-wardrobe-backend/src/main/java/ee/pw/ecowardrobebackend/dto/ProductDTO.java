package ee.pw.ecowardrobebackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private UUID id;
    private String name;
    private String description;
    private String category;
    private String brand;
    private Double ecoScore;
    private String imageUrl;
    private String barcode;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
