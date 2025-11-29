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
public class SupplyChainStage {
    private String stage;
    private String supplier;
    private String country;
    private String certificate;
}

