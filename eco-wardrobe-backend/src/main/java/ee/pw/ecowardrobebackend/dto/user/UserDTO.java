package ee.pw.ecowardrobebackend.dto.user;

import ee.pw.ecowardrobebackend.entity.user.Preference;
import lombok.Builder;

import java.util.UUID;

@Builder
public record UserDTO(UUID id, String email, String name, byte[] profilePicture, boolean isInfluencer, Preference preference) {
}

