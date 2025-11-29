package ee.pw.ecowardrobebackend.controller;

import ee.pw.ecowardrobebackend.dto.UserDTO;
import ee.pw.ecowardrobebackend.dto.UserRegistrationDTO;
import ee.pw.ecowardrobebackend.entity.User;
import ee.pw.ecowardrobebackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@RequestBody UserRegistrationDTO dto) {
        User user = new User();
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());

        User saved = userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToDTO(saved));
    }

    @PostMapping("/login")
    public ResponseEntity<UserDTO> login(@RequestBody LoginRequest req) {
        Optional<User> user = userRepository.findByEmail(req.getEmail());
        if (user.isPresent() && user.get().getPassword().equals(req.getPassword())) {
            return ResponseEntity.ok(mapToDTO(user.get()));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable UUID id) {
        return userRepository.findById(id)
            .map(u -> ResponseEntity.ok(mapToDTO(u)))
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/user/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable UUID id, @RequestBody UserDTO dto) {
        return userRepository.findById(id)
            .map(user -> {
                user.setFirstName(dto.getFirstName());
                user.setLastName(dto.getLastName());
                user.setBio(dto.getBio());
                user.setProfilePictureUrl(dto.getProfilePictureUrl());
                User updated = userRepository.save(user);
                return ResponseEntity.ok(mapToDTO(updated));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    private UserDTO mapToDTO(User user) {
        return new UserDTO(user.getId(), user.getEmail(), user.getFirstName(),
            user.getLastName(), user.getBio(), user.getProfilePictureUrl(),
            user.getCreatedAt(), user.getUpdatedAt());
    }

    @lombok.Data
    public static class LoginRequest {
        private String email;
        private String password;
    }
}

