package ee.pw.ecowardrobebackend.entity.product;

import jakarta.persistence.Embeddable;
import jakarta.persistence.Embedded;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class DurabilityAndCare {
    private Integer expectedLifetimeCycles;
    private String washInstructions;

    @Embedded
    private Repairability repairability;
}

