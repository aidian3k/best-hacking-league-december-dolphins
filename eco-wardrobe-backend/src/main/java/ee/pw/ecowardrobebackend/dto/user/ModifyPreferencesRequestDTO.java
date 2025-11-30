package ee.pw.ecowardrobebackend.dto.user;

import java.util.List;

public record ModifyPreferencesRequestDTO(List<String> allergies, List<String> preferredMaterials) {
}
