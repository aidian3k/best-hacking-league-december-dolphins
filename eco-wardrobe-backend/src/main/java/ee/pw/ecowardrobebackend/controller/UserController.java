package ee.pw.ecowardrobebackend.controller;

import ee.pw.ecowardrobebackend.dto.user.AddUserPhotoRequestDTO;
import ee.pw.ecowardrobebackend.dto.user.UserDTO;
import ee.pw.ecowardrobebackend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
class UserController {
    private final UserService userService;

    @PostMapping("/add-photo/{userId}")
    public UserDTO addProfilePicture(@RequestBody AddUserPhotoRequestDTO addUserPhotoRequestDTO, @PathVariable
                                                     UUID userId) {
        return userService.addUserPhoto(addUserPhotoRequestDTO, userId);
    }
}
