package ee.pw.ecowardrobebackend.entity.product;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ProductInformation {
    private String gtin;
    private String productName;
    private String category;
    private String brand;
    private String model;
}
