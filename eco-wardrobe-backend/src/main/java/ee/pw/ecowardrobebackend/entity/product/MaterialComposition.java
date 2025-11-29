package ee.pw.ecowardrobebackend.entity.product;

import ee.pw.ecowardrobebackend.config.ListStringConverter;
import jakarta.persistence.Convert;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Embeddable
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class MaterialComposition {
    private String materialName;
    private int compositionPercentage;

    @Convert(converter = ListStringConverter.class)
    @Builder.Default
    private List<String> certifications = new ArrayList<>();
}
