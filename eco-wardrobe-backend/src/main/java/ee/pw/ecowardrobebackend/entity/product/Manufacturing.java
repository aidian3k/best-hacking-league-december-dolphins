package ee.pw.ecowardrobebackend.entity.product;

import jakarta.persistence.Embeddable;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embedded;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;

@Embeddable
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Manufacturing {
    @Embedded
    private Producer producer;

    @ElementCollection
    private List<ProductionSite> productionSites;

    private String manufacturingDate;
}

