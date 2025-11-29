package ee.pw.ecowardrobebackend.controller;

import ee.pw.ecowardrobebackend.dto.share.SavedWardrobeResponseDTO;
import ee.pw.ecowardrobebackend.dto.share.WardrobeShareResponseDTO;
import ee.pw.ecowardrobebackend.dto.share.AddWardrobeShareRequestDTO;
import ee.pw.ecowardrobebackend.dto.user.UserDTO;
import ee.pw.ecowardrobebackend.entity.sharing.SavedUserWardrobe;
import ee.pw.ecowardrobebackend.entity.sharing.WardrobeShare;
import ee.pw.ecowardrobebackend.entity.user.User;
import ee.pw.ecowardrobebackend.repository.UserRepository;
import ee.pw.ecowardrobebackend.repository.WardrobeShareRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController("/api/wardrobe-share")
@RequiredArgsConstructor
class WardrobeShareController {
    private final WardrobeShareRepository wardrobeShareRepository;
    private final UserRepository userRepository;

    @GetMapping("/get-saved-wardrobes/{userId}")
    public ResponseEntity<SavedWardrobeResponseDTO> getSavedWardrobeItems(UUID userId) {
        final User associatedUser = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User with id " + userId + " not found"));
        final Set<SavedWardrobeResponseDTO.SavedWardrobeItemDTO> savedWardrobeItemDTOS = associatedUser
                .getSavedUserWardrobes()
                .stream()
                .map(savedUserWardrobe -> {
                    final User userWardrobeOwner = savedUserWardrobe.getUserWardrobeOwner();
                    return new SavedWardrobeResponseDTO.SavedWardrobeItemDTO(
                            UserDTO.builder().id(userWardrobeOwner.getId()).name(userWardrobeOwner.getName()).build(),
                            userWardrobeOwner.getProducts()
                    );
                }).collect(Collectors.toSet());

        return new ResponseEntity<>(new SavedWardrobeResponseDTO(savedWardrobeItemDTOS), HttpStatus.OK);
    }

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

    @PostMapping("/add-wardrobe/{userId}")
    public ResponseEntity<Void> addUserWardrobe(
            @RequestBody AddWardrobeShareRequestDTO addWardrobeShareRequestDTO,
            @PathVariable UUID userId
    ) {
        Optional<WardrobeShare> wardrobeShare = wardrobeShareRepository.findByShareCode(addWardrobeShareRequestDTO.shareCode().toString());

        if (wardrobeShare.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        final User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User with id " + userId + " not found"));
        user.getSavedUserWardrobes().add(
                SavedUserWardrobe
                        .builder()
                        .userWardrobeOwner(wardrobeShare.get().getAssociatedUser())
                        .build()
        );
        final User persistedUser = userRepository.save(user);

        return ResponseEntity.ok().build();
    }
}
