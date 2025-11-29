package ee.pw.ecowardrobebackend.dto.product;

import ee.pw.ecowardrobebackend.entity.product.Product;

import java.util.Collection;

public record WardrobeItemsDTO(Collection<Product> products) {
}
