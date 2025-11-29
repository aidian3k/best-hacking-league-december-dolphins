package ee.pw.ecowardrobebackend.entity.product;

import ee.pw.ecowardrobebackend.config.ListStringConverter;
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
public class ProductionSite {
    private String country;
    private String facilityId;

    @jakarta.persistence.Convert(converter = ListStringConverter.class)
    private List<String> processes;
}

