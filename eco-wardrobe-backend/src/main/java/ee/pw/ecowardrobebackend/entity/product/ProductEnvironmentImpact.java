package ee.pw.ecowardrobebackend.entity.product;

import ee.pw.ecowardrobebackend.config.ListStringConverter;
import jakarta.persistence.Convert;
import jakarta.persistence.Embeddable;
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
public class ProductEnvironmentImpact {

    private Double carbonFootprintKgCO2e;

    private Double waterUsageLiters;

    private Double energyKwh;

    private Double recycledContentPercentage;

    @Convert(converter = ListStringConverter.class)
    private List<String> hazardousSubstances;
}
