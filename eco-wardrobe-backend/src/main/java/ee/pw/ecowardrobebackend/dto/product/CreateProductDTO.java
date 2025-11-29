package ee.pw.ecowardrobebackend.dto.product;

import ee.pw.ecowardrobebackend.entity.product.DurabilityAndCare;
import ee.pw.ecowardrobebackend.entity.product.EndOfLife;
import ee.pw.ecowardrobebackend.entity.product.Manufacturing;
import ee.pw.ecowardrobebackend.entity.product.MaterialComposition;
import ee.pw.ecowardrobebackend.entity.product.Metadata;
import ee.pw.ecowardrobebackend.entity.product.ProductEnvironmentImpact;
import ee.pw.ecowardrobebackend.entity.product.ProductInformation;
import ee.pw.ecowardrobebackend.entity.product.SupplyChainTraceability;
import lombok.Builder;

import java.util.List;

@Builder
public record CreateProductDTO(
        ProductInformation productInformation,
        List<MaterialComposition> materialCompositions,
        ProductEnvironmentImpact productEnvironmentImpact,
        Manufacturing manufacturing,
        DurabilityAndCare durabilityAndCare,
        EndOfLife endOfLife,
        SupplyChainTraceability supplyChainTraceability,
        Metadata metadata,
        byte[] image
) {}
