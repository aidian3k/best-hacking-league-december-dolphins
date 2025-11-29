package ee.pw.ecowardrobebackend.controller;

import ee.pw.ecowardrobebackend.dto.share.WardrobeShareResponseDTO;
import ee.pw.ecowardrobebackend.entity.sharing.WardrobeShare;
import ee.pw.ecowardrobebackend.entity.user.User;
import ee.pw.ecowardrobebackend.repository.UserRepository;
import ee.pw.ecowardrobebackend.repository.WardrobeShareRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController("/api/wardrobe-share")
@RequiredArgsConstructor
class WardrobeShareController {
    private final WardrobeShareRepository wardrobeShareRepository;
    private final UserRepository userRepository;

    @GetMapping("/share/{id}")
    public ResponseEntity<WardrobeShareResponseDTO> shareWardrobe(@PathVariable UUID id) {
       final User associatedUser = userRepository.findById(id)
               .orElseThrow(() -> new IllegalArgumentException("User with id " + id + " not found"));
       final WardrobeShare wardrobeShare = WardrobeShare
               .builder()
               .associatedUser(associatedUser)
               .shareCode(UUID.randomUUID().toString())
               .build();
       final WardrobeShare persistedWardrobeShare = wardrobeShareRepository.save(wardrobeShare);

       return new ResponseEntity<>(new WardrobeShareResponseDTO(persistedWardrobeShare.getId(), persistedWardrobeShare.getShareCode()), HttpStatus.OK);
    }
}
