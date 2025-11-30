package ee.pw.ecowardrobebackend.service;

import ee.pw.ecowardrobebackend.dto.share.SavedWardrobeResponseDTO;
import ee.pw.ecowardrobebackend.dto.share.WardrobeShareResponseDTO;
import ee.pw.ecowardrobebackend.dto.user.UserDTO;
import ee.pw.ecowardrobebackend.entity.sharing.SavedUserWardrobe;
import ee.pw.ecowardrobebackend.entity.sharing.WardrobeShare;
import ee.pw.ecowardrobebackend.entity.user.User;
import ee.pw.ecowardrobebackend.repository.WardrobeShareRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WardrobeShareService {
    private final WardrobeShareRepository wardrobeShareRepository;
    private final UserService userService;

    public SavedWardrobeResponseDTO getSavedWardrobeItems(UUID userId) {
        final User associatedUser = userService.getUserById(userId);
        final Set<SavedWardrobeResponseDTO.SavedWardrobeItemDTO> savedWardrobeItemDTOS = associatedUser
                .getSavedUserWardrobes()
                .stream()
                .map(savedUserWardrobe -> {
                    final User userWardrobeOwner = savedUserWardrobe.getUserWardrobeOwner();
                    return new SavedWardrobeResponseDTO.SavedWardrobeItemDTO(
                        UserDTO
                        .builder()
                        .id(userWardrobeOwner.getId())
                        .name(userWardrobeOwner.getName())
                        .profilePicture(userWardrobeOwner.getProfilePicture())
                        .isInfluencer(userWardrobeOwner.isInfluencer())
                        .preference(userWardrobeOwner.getPreference())
                        .build(),
                            userWardrobeOwner.getProducts()
                    );
                }).collect(Collectors.toSet());

        return new SavedWardrobeResponseDTO(savedWardrobeItemDTOS);
    }

    public WardrobeShareResponseDTO shareWardrobe(UUID userId) {
        final User associatedUser = userService.getUserById(userId);
        final WardrobeShare wardrobeShare = WardrobeShare.builder()
                .associatedUser(associatedUser)
                .shareCode(UUID.randomUUID().toString())
                .build();
        final WardrobeShare persistedWardrobeShare = wardrobeShareRepository.save(wardrobeShare);

        return new WardrobeShareResponseDTO(
                persistedWardrobeShare.getId(),
                persistedWardrobeShare.getShareCode()
        );
    }

    @Transactional
    public boolean addUserWardrobe(String shareCode, UUID userId) {
        Optional<WardrobeShare> wardrobeShare = wardrobeShareRepository.findByShareCode(shareCode);

        if (wardrobeShare.isEmpty()) {
            return false;
        }

        final User user = userService.getUserById(userId);
        user.getSavedUserWardrobes().add(
                SavedUserWardrobe.builder()
                        .userWardrobeOwner(wardrobeShare.get().getAssociatedUser())
                        .build()
        );
        userService.saveUser(user);

        return true;
    }

    public SavedWardrobeResponseDTO getSharedInfluencerWardrobes() {
        final Set<SavedWardrobeResponseDTO.SavedWardrobeItemDTO> savedWardrobeItemDTOS = userService.getInfluencers()
                .stream()
                .map(influencer -> new SavedWardrobeResponseDTO.SavedWardrobeItemDTO(
                        UserDTO
                            .builder()
                            .id(influencer.getId())
                            .name(influencer.getName())
                            .profilePicture(influencer.getProfilePicture())
                            .isInfluencer(influencer.isInfluencer())
                            .preference(influencer.getPreference())
                            .build(),
                        influencer.getProducts()
                )).collect(Collectors.toSet());

        return new SavedWardrobeResponseDTO(savedWardrobeItemDTOS);
    }
}
