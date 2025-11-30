package ee.pw.ecowardrobebackend.entity.user;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Embeddable
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Preference {
    @ElementCollection
    private Set<Allergy> allergies = new HashSet<>();

    @ElementCollection
    private Set<PreferredMaterials> preferredMaterials = new HashSet<>();
}
