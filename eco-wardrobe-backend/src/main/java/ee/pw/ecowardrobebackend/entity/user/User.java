package ee.pw.ecowardrobebackend.entity.user;

import ee.pw.ecowardrobebackend.entity.common.Auditable;
import ee.pw.ecowardrobebackend.entity.product.Product;
import ee.pw.ecowardrobebackend.entity.sharing.SavedUserWardrobe;
import ee.pw.ecowardrobebackend.entity.sharing.WardrobeShare;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "users")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@SuperBuilder
public class User extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String email;

    private String name;

    private String password;

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @Builder.Default
    private Set<Product> products = new HashSet<>();

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @Builder.Default
    private Set<SavedUserWardrobe> savedUserWardrobes = new HashSet<>();

    @Lob
    @Column(name = "profile_picture", columnDefinition = "BLOB")
    private byte[] profilePicture;

    private boolean isInfluencer;

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<WardrobeShare> wardrobeShares = new HashSet<>();

    @ElementCollection
    private Set<Allergy> allergies = new HashSet<>();

    @ElementCollection
    private Set<PreferredMaterials> preferredMaterials = new HashSet<>();
}