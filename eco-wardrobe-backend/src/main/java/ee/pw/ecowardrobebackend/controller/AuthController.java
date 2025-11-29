package ee.pw.ecowardrobebackend.controller;

import ee.pw.ecowardrobebackend.dto.user.UserDTO;
import ee.pw.ecowardrobebackend.dto.user.UserLoginRequestDTO;
import ee.pw.ecowardrobebackend.dto.user.UserRegistrationDTO;
import ee.pw.ecowardrobebackend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
class AuthController {
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@RequestBody UserRegistrationDTO userRegistrationDTO) {
        final UserDTO userDTO = userService.registerUser(userRegistrationDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(userDTO);
    }

    @PostMapping("/login")
    public ResponseEntity<UserDTO> login(@RequestBody UserLoginRequestDTO userLoginRequestDTO) {
        return userService.loginUser(userLoginRequestDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }
}

