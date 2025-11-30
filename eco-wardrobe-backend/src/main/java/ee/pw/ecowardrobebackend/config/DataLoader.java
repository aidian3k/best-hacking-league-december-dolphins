package ee.pw.ecowardrobebackend.config;

import ee.pw.ecowardrobebackend.entity.product.*;
import ee.pw.ecowardrobebackend.entity.user.User;
import ee.pw.ecowardrobebackend.repository.ProductRepository;
import ee.pw.ecowardrobebackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            loadTestData();
        }
    }

    private void loadTestData() {
        // Tworzenie użytkowników regularnych
        User user1 = User.builder()
                .name("Jan Kowalski")
                .email("jan.kowalski@example.com")
                .password(passwordEncoder.encode("password123"))
                .isInfluencer(false)
                .products(new HashSet<>())
                .build();

        User user2 = User.builder()
                .name("Anna Nowak")
                .email("anna.nowak@example.com")
                .password(passwordEncoder.encode("password123"))
                .isInfluencer(false)
                .products(new HashSet<>())
                .build();

        User user3 = User.builder()
                .name("Piotr Wiśniewski")
                .email("piotr.wisniewski@example.com")
                .password(passwordEncoder.encode("password123"))
                .isInfluencer(false)
                .products(new HashSet<>())
                .build();

        // Tworzenie influencerów
        User influencer1 = User.builder()
                .name("Marta Stylowa")
                .email("marta.stylowa@example.com")
                .password(passwordEncoder.encode("influencer123"))
                .isInfluencer(true)
                .products(new HashSet<>())
                .build();

        User influencer2 = User.builder()
                .name("Karol Modny")
                .email("karol.modny@example.com")
                .password(passwordEncoder.encode("influencer123"))
                .isInfluencer(true)
                .products(new HashSet<>())
                .build();

        // Zapisanie użytkowników
        user1 = userRepository.save(user1);
        user2 = userRepository.save(user2);
        user3 = userRepository.save(user3);
        influencer1 = userRepository.save(influencer1);
        influencer2 = userRepository.save(influencer2);

        // Tworzenie produktów dla użytkownika 1
        Product product1 = createProduct(
                "1234567890123",
                "Organic Cotton T-Shirt",
                "T-Shirts",
                "EcoWear",
                "Basic Tee 2024",
                95, // 95% organic cotton
                5,  // 5% elastane
                12.5,
                150.0,
                45.0,
                80.0
        );
        product1 = productRepository.save(product1);
        user1.getProducts().add(product1);

        Product product2 = createProduct(
                "2345678901234",
                "Recycled Denim Jeans",
                "Jeans",
                "GreenDenim",
                "Slim Fit Eco",
                80,
                20,
                25.8,
                2500.0,
                120.0,
                60.0
        );
        product2 = productRepository.save(product2);
        user1.getProducts().add(product2);

        // Tworzenie produktów dla użytkownika 2
        Product product3 = createProduct(
                "3456789012345",
                "Hemp Blend Hoodie",
                "Hoodies",
                "NatureCloth",
                "Comfort Hood",
                70,
                30,
                18.3,
                800.0,
                85.0,
                50.0
        );
        product3 = productRepository.save(product3);
        user2.getProducts().add(product3);

        Product product4 = createProduct(
                "4567890123456",
                "Bamboo Socks Set",
                "Socks",
                "BambooComfort",
                "Daily Essentials",
                100,
                0,
                2.1,
                50.0,
                15.0,
                90.0
        );
        product4 = productRepository.save(product4);
        user2.getProducts().add(product4);

        // Tworzenie produktów dla użytkownika 3
        Product product5 = createProduct(
                "5678901234567",
                "Merino Wool Sweater",
                "Sweaters",
                "WoolCraft",
                "Alpine Warmth",
                100,
                0,
                35.2,
                1200.0,
                180.0,
                40.0
        );
        product5 = productRepository.save(product5);
        user3.getProducts().add(product5);

        // Tworzenie produktów dla influencera 1 (Marta Stylowa)
        Product product6 = createProduct(
                "6789012345678",
                "Designer Linen Dress",
                "Dresses",
                "LuxeLinen",
                "Summer Breeze",
                100,
                0,
                22.4,
                1800.0,
                200.0,
                70.0
        );
        product6 = productRepository.save(product6);
        influencer1.getProducts().add(product6);

        Product product7 = createProduct(
                "7890123456789",
                "Sustainable Leather Jacket",
                "Jackets",
                "EcoLeather Co",
                "Urban Classic",
                100,
                0,
                45.7,
                3500.0,
                280.0,
                30.0
        );
        product7 = productRepository.save(product7);
        influencer1.getProducts().add(product7);

        Product product8 = createProduct(
                "8901234567890",
                "Organic Silk Blouse",
                "Blouses",
                "SilkNature",
                "Elegant Flow",
                100,
                0,
                28.9,
                2200.0,
                220.0,
                65.0
        );
        product8 = productRepository.save(product8);
        influencer1.getProducts().add(product8);

        // Tworzenie produktów dla influencera 2 (Karol Modny)
        Product product9 = createProduct(
                "9012345678901",
                "Recycled Polyester Jacket",
                "Jackets",
                "ReWear Tech",
                "Urban Shield",
                100,
                0,
                32.1,
                1500.0,
                140.0,
                85.0
        );
        product9 = productRepository.save(product9);
        influencer2.getProducts().add(product9);

        Product product10 = createProduct(
                "0123456789012",
                "Tencel Chino Pants",
                "Pants",
                "TencelWear",
                "Smart Casual",
                95,
                5,
                19.6,
                1100.0,
                95.0,
                75.0
        );
        product10 = productRepository.save(product10);
        influencer2.getProducts().add(product10);

        Product product11 = createProduct(
                "1234567890124",
                "Eco-Friendly Sneakers",
                "Shoes",
                "GreenSteps",
                "Urban Walk",
                60,
                40,
                38.4,
                2800.0,
                165.0,
                55.0
        );
        product11 = productRepository.save(product11);
        influencer2.getProducts().add(product11);

        // Aktualizacja użytkowników
        userRepository.save(user1);
        userRepository.save(user2);
        userRepository.save(user3);
        userRepository.save(influencer1);
        userRepository.save(influencer2);

        System.out.println("Test data loaded successfully!");
        System.out.println("Regular users: Jan Kowalski, Anna Nowak, Piotr Wiśniewski");
        System.out.println("Influencers: Marta Stylowa, Karol Modny");
        System.out.println("Total products created: 11");
    }

    private Product createProduct(
            String gtin,
            String productName,
            String category,
            String brand,
            String model,
            int mainMaterialPercentage,
            int secondaryMaterialPercentage,
            Double carbonFootprint,
            Double waterUsage,
            Double energyUsage,
            Double recycledContent
    ) {
        // Product Information
        ProductInformation productInfo = new ProductInformation(
                gtin,
                productName,
                category,
                brand,
                model
        );

        // Material Compositions
        List<MaterialComposition> materials = Arrays.asList(
                MaterialComposition.builder()
                        .materialName(getMaterialName(category, true))
                        .compositionPercentage(mainMaterialPercentage)
                        .certifications(Arrays.asList("GOTS", "OEKO-TEX"))
                        .build(),
                secondaryMaterialPercentage > 0 ? MaterialComposition.builder()
                        .materialName(getMaterialName(category, false))
                        .compositionPercentage(secondaryMaterialPercentage)
                        .certifications(Arrays.asList("OEKO-TEX"))
                        .build() : null
        );
        materials.removeIf(m -> m == null);

        // Environment Impact
        ProductEnvironmentImpact environmentImpact = new ProductEnvironmentImpact(
                carbonFootprint,
                waterUsage,
                energyUsage,
                recycledContent,
                Arrays.asList("None detected")
        );

        // Manufacturing
        Manufacturing manufacturing = new Manufacturing(
                new Producer(brand + " Manufacturer", "Green Valley Industrial Zone, Poland", "contact@" + brand.toLowerCase().replace(" ", "") + ".com"),
                Arrays.asList(
                        new ProductionSite("Poland", "FAC-001", Arrays.asList("Weaving", "Dyeing")),
                        new ProductionSite("Portugal", "FAC-002", Arrays.asList("Assembly", "Quality Control"))
                ),
                LocalDateTime.now().minusMonths(6).toString()
        );

        // Durability and Care
        DurabilityAndCare durability = new DurabilityAndCare(
                200,
                "Machine wash at 30°C, tumble dry low, iron medium heat",
                new Repairability("Medium", true, "https://repair." + brand.toLowerCase().replace(" ", "") + ".com")
        );

        // End of Life
        EndOfLife endOfLife = new EndOfLife(
                85.0,
                "https://recycle." + brand.toLowerCase().replace(" ", "") + ".com/disassembly",
                Arrays.asList(
                        new TakeBackProgram("Green Return Program", "https://" + brand.toLowerCase().replace(" ", "") + ".com/takeback"),
                        new TakeBackProgram("Textile Recycling Initiative", "https://recycling-network.eu")
                )
        );

        // Supply Chain
        SupplyChainTraceability supplyChain = new SupplyChainTraceability(
                Arrays.asList(
                        new SupplyChainStage("Raw Material", "Organic Cotton Farm Co-op", "Turkey", "GOTS"),
                        new SupplyChainStage("Fabric Production", "EcoTextile Mills", "Poland", "OEKO-TEX"),
                        new SupplyChainStage("Manufacturing", brand + " Manufacturer", "Portugal", "Fair Trade")
                )
        );

        // Metadata
        Metadata metadata = new Metadata(
                LocalDateTime.now().minusMonths(6).toString(),
                LocalDateTime.now().toString(),
                brand
        );

        return Product.builder()
                .productInformation(productInfo)
                .materialCompositions(materials)
                .productEnvironmentImpact(environmentImpact)
                .manufacturing(manufacturing)
                .durabilityAndCare(durability)
                .endOfLife(endOfLife)
                .supplyChainTraceability(supplyChain)
                .metadata(metadata)
                .build();
    }

    private String getMaterialName(String category, boolean isPrimary) {
        if (isPrimary) {
            return switch (category) {
                case "T-Shirts", "Blouses" -> "Organic Cotton";
                case "Jeans" -> "Recycled Denim";
                case "Hoodies" -> "Hemp";
                case "Socks" -> "Bamboo Fiber";
                case "Sweaters" -> "Merino Wool";
                case "Dresses" -> "Organic Linen";
                case "Jackets" -> category.contains("Leather") ? "Sustainable Leather" : "Recycled Polyester";
                case "Pants" -> "Tencel Lyocell";
                case "Shoes" -> "Recycled Rubber";
                default -> "Organic Cotton";
            };
        } else {
            return "Elastane";
        }
    }
}
