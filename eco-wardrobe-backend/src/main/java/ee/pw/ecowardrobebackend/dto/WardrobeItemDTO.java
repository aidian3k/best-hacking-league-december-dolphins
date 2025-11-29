package ee.pw.ecowardrobebackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WardrobeItemDTO {
    private UUID id;
    private UUID userId;
    private UUID productId;
    private String size;
    private String color;
    private Integer quantity;
    private String condition;
    private Boolean isFavorite;
    private LocalDateTime addedAt;
    private LocalDateTime updatedAt;
    private ProductDTO product;
}
