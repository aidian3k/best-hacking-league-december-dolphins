package ee.pw.ecowardrobebackend.dto.user;

import lombok.Builder;

import java.util.UUID;

@Builder
public record UserDTO(UUID id, String email, String name) {
}

