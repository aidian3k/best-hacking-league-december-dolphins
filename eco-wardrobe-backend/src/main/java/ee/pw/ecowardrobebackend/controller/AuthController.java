package ee.pw.ecowardrobebackend.controller;

import ee.pw.ecowardrobebackend.dto.user.UserDTO;
import ee.pw.ecowardrobebackend.dto.user.UserLoginRequestDTO;
import ee.pw.ecowardrobebackend.dto.user.UserRegistrationDTO;
import ee.pw.ecowardrobebackend.entity.user.User;
import ee.pw.ecowardrobebackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
class AuthController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@RequestBody UserRegistrationDTO userRegistrationDTO) {
        final User persistedUser = userRepository.save(
                User.builder()
                        .name(userRegistrationDTO.name())
                        .email(userRegistrationDTO.email())
                        .password(passwordEncoder.encode(userRegistrationDTO.password()))
                        .build()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(UserDTO.
                builder().id(persistedUser.getId()).name(userRegistrationDTO.name()).email(userRegistrationDTO.email()).build());
    }

    @PostMapping("/login")
    public ResponseEntity<UserDTO> login(@RequestBody UserLoginRequestDTO userLoginRequestDTO) {
        Optional<User> optionalUser = userRepository.findByEmail(userLoginRequestDTO.email());
        if (optionalUser.isPresent() && passwordEncoder.matches(userLoginRequestDTO.password(), optionalUser.get().getPassword())) {
            final User user = optionalUser.get();
            return ResponseEntity.ok(UserDTO.
                    builder().id(user.getId()).name(user.getName()).email(user.getEmail()).build());
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}

