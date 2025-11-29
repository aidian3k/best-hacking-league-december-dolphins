package ee.pw.ecowardrobebackend.entity.product;

import ee.pw.ecowardrobebackend.entity.common.Auditable;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "products")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@SuperBuilder
public class Product extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Embedded
    private ProductInformation productInformation;

    @ElementCollection
    private List<MaterialComposition> materialCompositions = new ArrayList<>();

    @Embedded
    private ProductEnvironmentImpact productEnvironmentImpact;

    @Embedded
    private Manufacturing manufacturing;

    @Embedded
    private DurabilityAndCare durabilityAndCare;

    @Embedded
    private EndOfLife endOfLife;

    @Embedded
    private SupplyChainTraceability supplyChainTraceability;

    @Embedded
    private Metadata metadata;

    @Lob
    @Column(columnDefinition = "BLOB")
    private byte[] image;
}
