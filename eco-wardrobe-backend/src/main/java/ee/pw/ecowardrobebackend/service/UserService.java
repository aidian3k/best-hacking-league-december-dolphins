package ee.pw.ecowardrobebackend.service;

import ee.pw.ecowardrobebackend.dto.user.AddUserPhotoRequestDTO;
import ee.pw.ecowardrobebackend.dto.user.UserDTO;
import ee.pw.ecowardrobebackend.dto.user.UserLoginRequestDTO;
import ee.pw.ecowardrobebackend.dto.user.UserRegistrationDTO;
import ee.pw.ecowardrobebackend.entity.user.User;
import ee.pw.ecowardrobebackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserDTO registerUser(UserRegistrationDTO userRegistrationDTO) {
        final User persistedUser = userRepository.save(
                User.builder()
                        .name(userRegistrationDTO.name())
                        .email(userRegistrationDTO.email())
                        .password(passwordEncoder.encode(userRegistrationDTO.password()))
                        .build()
        );
        return UserDTO.builder()
                .id(persistedUser.getId())
                .name(persistedUser.getName())
                .email(persistedUser.getEmail())
                .profilePicture(persistedUser.getProfilePicture())
                .isInfluencer(persistedUser.isInfluencer())
                .build();
    }

    public Optional<UserDTO> loginUser(UserLoginRequestDTO userLoginRequestDTO) {
        Optional<User> optionalUser = userRepository.findByEmail(userLoginRequestDTO.email());
        if (optionalUser.isPresent() && passwordEncoder.matches(userLoginRequestDTO.password(), optionalUser.get().getPassword())) {
            final User user = optionalUser.get();
            return Optional.of(UserDTO.builder()
                    .id(user.getId())
                    .name(user.getName())
                    .email(user.getEmail())
                            .profilePicture(user.getProfilePicture())
                            .isInfluencer(user.isInfluencer())
                    .build());
        }
        return Optional.empty();
    }

    public User getUserById(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User with id " + userId + " not found"));
    }

    public UserDTO addUserPhoto(AddUserPhotoRequestDTO addUserPhotoRequestDTO, UUID userId) {
        final User user = getUserById(userId);
        user.setProfilePicture(addUserPhotoRequestDTO.profilePicture());
        final User updatedUser = userRepository.save(user);
        return UserDTO.builder()
                .id(updatedUser.getId())
                .name(updatedUser.getName())
                .email(updatedUser.getEmail())
                .profilePicture(updatedUser.getProfilePicture())
                .isInfluencer(updatedUser.isInfluencer())
                .build();
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }
}
