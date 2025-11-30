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
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import jakarta.transaction.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;
    private final RestTemplate restTemplate;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() == 0) {
            loadTestData();
        }
    }

    private void loadTestData() {
        // Tworzenie użytkowników regularnych
        User user1 = User.builder()
                .name("Jan Kowalski")
                .email("jan.kowalski@wp.pl")
                .password(passwordEncoder.encode("password123"))
                .isInfluencer(false)
                .products(new HashSet<>())
                .profilePicture(restTemplate.getForObject("https://media.licdn.com/dms/image/v2/D4D03AQFWKF59BKdA6w/profile-displayphoto-shrink_800_800/B4DZS35m5XG8Ac-/0/1738252123989?e=1766016000&v=beta&t=U6h4nWQniDIsNMFmVfTa2Ji0lY01WRGUJB0NAJ0v_OE", byte[].class))
                .build();

        User user2 = User.builder()
                .name("Anna Nowak")
                .email("anna.nowak@wp.pl")
                .password(passwordEncoder.encode("password123"))
                .isInfluencer(false)
                .products(new HashSet<>())
                .profilePicture(restTemplate.getForObject("https://media.istockphoto.com/id/1437816897/photo/business-woman-manager-or-human-resources-portrait-for-career-success-company-we-are-hiring.jpg?s=612x612&w=0&k=20&c=tyLvtzutRh22j9GqSGI33Z4HpIwv9vL_MZw_xOE19NQ=", byte[].class))
                .build();

        User user3 = User.builder()
                .name("Piotr Wiśniewski")
                .email("piotr.wisniewski@wp.pl")
                .password(passwordEncoder.encode("password123"))
                .isInfluencer(false)
                .products(new HashSet<>())
                .profilePicture(restTemplate.getForObject("https://media.licdn.com/dms/image/v2/D4D03AQHRyjS_ulUnbQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1698778439429?e=2147483647&v=beta&t=xVyUz4LtIHEsCQXhwOMgP1rhDSNotkZxcBiFwKIF2n4", byte[].class))
                .build();

        // Tworzenie influencerów
        User influencer1 = User.builder()
                .name("Marta Stylowa")
                .email("marta.stylowa@wp.pl")
                .password(passwordEncoder.encode("influencer123"))
                .isInfluencer(true)
                .products(new HashSet<>())
                .profilePicture(restTemplate.getForObject("https://images.immediate.co.uk/production/volatile/sites/64/2024/11/kylie-jenner-rozjasnila-brwi-feacd49.jpg?quality=90&crop=0px,0px,1024px,682px&resize=980,654", byte[].class))
                .build();

        User influencer2 = User.builder()
                .name("Karol Modny")
                .email("karol.modny@wp.pl")
                .password(passwordEncoder.encode("influencer123"))
                .isInfluencer(true)
                .products(new HashSet<>())
                .profilePicture(restTemplate.getForObject("https://plus.unsplash.com/premium_photo-1689977927774-401b12d137d6?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWFuJTIwcHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHx8fDA%3D", byte[].class))
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
                "Koszulka z bawełny organicznej",
                "Koszulki",
                "EcoWear",
                "Basic Tee 2024",
                95, // 95% organic cotton
                5,  // 5% elastane
                12.5,
                150.0,
                45.0,
                80.0,
                "https://hf-hcms-staging1.azureedge.net/034/2526-0400.jpg_Original_637293292886130000.jpg"
        );
        product1 = productRepository.save(product1);
        user1.getProducts().add(product1);

        Product product2 = createProduct(
                "2345678901234",
                "Dżinsy z recyklingu",
                "Spodnie",
                "GreenDenim",
                "Slim Fit Eco",
                80,
                20,
                25.8,
                2500.0,
                120.0,
                60.0,
                "https://wills-vegan-shoes.com/cdn/shop/files/Jeans1_92920de0-e46c-4c62-8383-f10103162e36.png?v=1731077386&width=1445"
        );
        product2 = productRepository.save(product2);
        user1.getProducts().add(product2);

        // Tworzenie produktów dla użytkownika 2
        Product product3 = createProduct(
                "3456789012345",
                "Bluza z konopi",
                "Bluzy",
                "NatureCloth",
                "Comfort Hood",
                70,
                30,
                18.3,
                800.0,
                85.0,
                50.0,
                "https://somewoncollective.com/cdn/shop/files/Hemp-Hoodie-FGreen-front-studio-flat_2048x72ppi.png?v=1713850671&width=1080"
        );
        product3 = productRepository.save(product3);
        user2.getProducts().add(product3);

        Product product4 = createProduct(
                "4567890123456",
                "Zestaw skarpetek bambusowych",
                "Skarpety",
                "BambooComfort",
                "Daily Essentials",
                100,
                0,
                2.1,
                50.0,
                15.0,
                90.0,
                "https://www.mintandoak.in/cdn/shop/files/Combo_1.jpg?v=1757739849"
        );
        product4 = productRepository.save(product4);
        user2.getProducts().add(product4);

        // Tworzenie produktów dla użytkownika 3
        Product product5 = createProduct(
                "5678901234567",
                "Sweter z wełny merino",
                "Bluzy",
                "WoolCraft",
                "Alpine Warmth",
                100,
                0,
                35.2,
                1200.0,
                180.0,
                40.0,
                "https://akn-lacoste.b-cdn.net/products/2024/09/11/281115/a29298eb-ac24-46a9-a711-3cb74af549b5_size2000x2000_cropCenter.jpg"
        );
        product5 = productRepository.save(product5);
        user3.getProducts().add(product5);

        // Tworzenie produktów dla influencera 1 (Marta Stylowa)
        Product product6 = createProduct(
                "6789012345678",
                "Lniana sukienka designerska",
                "Inne",
                "LuxeLinen",
                "Summer Breeze",
                100,
                0,
                22.4,
                1800.0,
                200.0,
                70.0,
                "https://i.pinimg.com/736x/65/98/72/659872f34955e9b3e3a431bdcf88d12e.jpg"
        );
        product6 = productRepository.save(product6);
        influencer1.getProducts().add(product6);

        Product product7 = createProduct(
                "7890123456789",
                "Ekologiczna kurtka skórzana",
                "Inne",
                "EcoLeather Co",
                "Urban Classic",
                100,
                0,
                45.7,
                3500.0,
                280.0,
                30.0,
                "https://images.squarespace-cdn.com/content/v1/547a3834e4b053a861c4874e/37ad42a2-950d-44b6-8442-ab9780a2ad6d/Sustainably%20Chic%20%7C%20Sustainable%20Fashion%20Blog%20%7C%20Sustainable%20Leather%20Jackets%20-%20Vegan,%20Vintage,%20Recycled%20%7C%20Matt%20&%20Nat.jpg"
        );
        product7 = productRepository.save(product7);
        influencer1.getProducts().add(product7);

        Product product8 = createProduct(
                "8901234567890",
                "Bluzka z organicznego jedwabiu",
                "Koszulki",
                "SilkNature",
                "Elegant Flow",
                100,
                0,
                28.9,
                2200.0,
                220.0,
                65.0,
                "https://m.media-amazon.com/images/I/61v57R4nk3L._AC_UY1000_.jpg"
        );
        product8 = productRepository.save(product8);
        influencer1.getProducts().add(product8);

        // Tworzenie produktów dla influencera 2 (Karol Modny)
        Product product9 = createProduct(
                "9012345678901",
                "Kurtka z recyklingowanego poliestru",
                "Inne",
                "ReWear Tech",
                "Urban Shield",
                100,
                0,
                32.1,
                1500.0,
                140.0,
                85.0,
                "https://www.chinaecofiber.com/uploads/image/20210104/11/winter-jackets-for-men.jpg"
        );
        product9 = productRepository.save(product9);
        influencer2.getProducts().add(product9);

        Product product10 = createProduct(
                "0123456789012",
                "Spodnie chino z tencelu",
                "Spodnie",
                "TencelWear",
                "Smart Casual",
                95,
                5,
                19.6,
                1100.0,
                95.0,
                75.0,
                "https://sacksfashion.com/cdn/shop/files/15011_2.jpg?v=1738481569"
        );
        product10 = productRepository.save(product10);
        influencer2.getProducts().add(product10);

        Product product11 = createProduct(
                "1234567890124",
                "Ekologiczne sneakersy",
                "Inne",
                "GreenSteps",
                "Urban Walk",
                60,
                40,
                38.4,
                2800.0,
                165.0,
                55.0,
                "https://www.billboard.com/wp-content/uploads/2022/01/Valentino-Open-for-a-Change-Bio-Based-Material-Sneakers.jpg?w=988"
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
            Double recycledContent,
            String imageUrl
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
        List<MaterialComposition> materials = new ArrayList<>();
        materials.add(MaterialComposition.builder()
                .materialName(getMaterialName(productName, true))
                .compositionPercentage(mainMaterialPercentage)
                .certifications(Arrays.asList("GOTS", "OEKO-TEX"))
                .build());
        if (secondaryMaterialPercentage > 0) {
            materials.add(MaterialComposition.builder()
                    .materialName(getMaterialName(productName, false))
                    .compositionPercentage(secondaryMaterialPercentage)
                    .certifications(Arrays.asList("OEKO-TEX"))
                    .build());
        }

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
                .image(restTemplate.getForObject(imageUrl, byte[].class))
                .build();
    }

    private String getMaterialName(String productName, boolean isPrimary) {
        if (isPrimary) {
            String lowerName = productName.toLowerCase();

            if (lowerName.contains("bawełny") || lowerName.contains("cotton")) {
                return "Organic Cotton";
            } else if (lowerName.contains("dżinsy") || lowerName.contains("denim")) {
                return "Recycled Denim";
            } else if (lowerName.contains("konopi") || lowerName.contains("hemp")) {
                return "Hemp";
            } else if (lowerName.contains("bambusowych") || lowerName.contains("bamboo")) {
                return "Bamboo Fiber";
            } else if (lowerName.contains("wełny") || lowerName.contains("wool") || lowerName.contains("merino")) {
                return "Merino Wool";
            } else if (lowerName.contains("lniana") || lowerName.contains("linen")) {
                return "Organic Linen";
            } else if (lowerName.contains("skórzana") || lowerName.contains("leather")) {
                return "Sustainable Leather";
            } else if (lowerName.contains("jedwabiu") || lowerName.contains("silk")) {
                return "Organic Silk";
            } else if (lowerName.contains("poliestru") || lowerName.contains("polyester")) {
                return "Recycled Polyester";
            } else if (lowerName.contains("tencelu") || lowerName.contains("tencel")) {
                return "Tencel Lyocell";
            } else if (lowerName.contains("sneakersy") || lowerName.contains("buty") || lowerName.contains("shoes")) {
                return "Recycled Rubber";
            } else {
                return "Organic Cotton"; // domyślny materiał
            }
        } else {
            return "Elastane";
        }
    }
}
