package ee.pw.ecowardrobebackend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "wardrobe_items")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class WardrobeItem {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    private String size;
    private String color;
    private Integer quantity;
    private String condition;

    @Column(name = "is_favorite")
    private Boolean isFavorite = false;

    @Column(name = "added_at", nullable = false, updatable = false)
    private LocalDateTime addedAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
}
