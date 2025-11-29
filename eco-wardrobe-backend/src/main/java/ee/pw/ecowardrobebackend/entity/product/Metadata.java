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
public class Metadata {
    private String passportCreated;
    private String passportLastUpdated;
    private String dataOwner;
}

