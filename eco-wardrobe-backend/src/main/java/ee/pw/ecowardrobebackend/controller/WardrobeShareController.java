package ee.pw.ecowardrobebackend.controller;

import ee.pw.ecowardrobebackend.dto.share.SavedWardrobeResponseDTO;
import ee.pw.ecowardrobebackend.dto.share.WardrobeShareResponseDTO;
import ee.pw.ecowardrobebackend.dto.share.AddWardrobeShareRequestDTO;
import ee.pw.ecowardrobebackend.service.WardrobeShareService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/wardrobe-share")
@RequiredArgsConstructor
class WardrobeShareController {
    private final WardrobeShareService wardrobeShareService;

    @GetMapping("/get-saved-wardrobes/{userId}")
    public ResponseEntity<SavedWardrobeResponseDTO> getSavedWardrobeItems(@PathVariable UUID userId) {
        final SavedWardrobeResponseDTO response = wardrobeShareService.getSavedWardrobeItems(userId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/share/{id}")
    public ResponseEntity<WardrobeShareResponseDTO> shareWardrobe(@PathVariable UUID id) {
        final WardrobeShareResponseDTO response = wardrobeShareService.shareWardrobe(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/add-wardrobe/{userId}")
    public ResponseEntity<Void> addUserWardrobe(
            @RequestBody AddWardrobeShareRequestDTO addWardrobeShareRequestDTO,
            @PathVariable UUID userId
    ) {
        boolean success = wardrobeShareService.addUserWardrobe(
                addWardrobeShareRequestDTO.shareCode().toString(),
                userId
        );

        if (!success) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        return ResponseEntity.ok().build();
    }

    @GetMapping("/get-shared-influencers-wardrobes")
    public ResponseEntity<WardrobeShareResponseDTO> getSharedInfluencersWardrobes() {
        final WardrobeShareResponseDTO response = wardrobeShareService.getSharedInfluencerWardrobes();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
