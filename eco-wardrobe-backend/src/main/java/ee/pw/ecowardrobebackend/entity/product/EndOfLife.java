package ee.pw.ecowardrobebackend.entity.product;

import jakarta.persistence.Embeddable;
import jakarta.persistence.ElementCollection;
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
public class EndOfLife {
    private Double recyclabilityPercentage;
    private String disassemblyInstructionsURL;

    @ElementCollection
    private List<TakeBackProgram> takeBackPrograms;
}

