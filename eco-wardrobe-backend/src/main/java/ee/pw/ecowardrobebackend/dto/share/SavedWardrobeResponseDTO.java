package ee.pw.ecowardrobebackend.dto.share;

import ee.pw.ecowardrobebackend.dto.user.UserDTO;
import ee.pw.ecowardrobebackend.entity.product.Product;

import java.util.List;
import java.util.Set;

public record SavedWardrobeResponseDTO(Set<SavedWardrobeItemDTO> savedWardrobeItems) {
    public record SavedWardrobeItemDTO(UserDTO user, Set<Product> products) {
    }
}
