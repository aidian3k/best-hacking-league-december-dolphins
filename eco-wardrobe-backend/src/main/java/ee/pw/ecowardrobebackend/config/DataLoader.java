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
                .profilePicture(restTemplate.getForObject("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTguNUbYXI50tG9bX8iItFYfwA4ks7NLIcGRA&s", byte[].class))
                .build();

        User influencer2 = User.builder()
                .name("Karol Modny")
                .email("karol.modny@wp.pl")
                .password(passwordEncoder.encode("influencer123"))
                .isInfluencer(true)
                .products(new HashSet<>())
                .profilePicture(restTemplate.getForObject("https://fwcdn.pl/fph/97/11/10039711/1277428_1.2.jpg", byte[].class))
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
                "EkoUbrania",
                "Podstawowa Koszulka 2024",
                95,
                5,
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
                "Zielony Denim",
                "Slim Fit Eko",
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
                "Naturalne Ubrania",
                "Wygodna Bluza",
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
                "Bambusowy Komfort",
                "Codzienne Niezbędniki",
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
                "Wełniane Rzemiosło",
                "Alpejskie Ciepło",
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
                "Luksusowy Len",
                "Letnia Bryza",
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
                "Eko Skóra Sp. z o.o.",
                "Miejski Klasyk",
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
                "Naturalny Jedwab",
                "Elegancki Przepływ",
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
                "Ponowne Ubranie Tech",
                "Miejska Ochrona",
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
                "Tencel Ubrania",
                "Elegancki Casual",
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
                "Zielone Kroki",
                "Miejski Spacer",
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

        System.out.println("Dane testowe załadowane pomyślnie!");
        System.out.println("Zwykli użytkownicy: Jan Kowalski, Anna Nowak, Piotr Wiśniewski");
        System.out.println("Influencerzy: Marta Stylowa, Karol Modny");
        System.out.println("Łączna liczba utworzonych produktów: 11");
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
        // Informacje o produkcie
        ProductInformation productInfo = new ProductInformation(
                gtin,
                productName,
                category,
                brand,
                model
        );

        // Skład materiałowy
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

        // Wpływ na środowisko
        ProductEnvironmentImpact environmentImpact = new ProductEnvironmentImpact(
                carbonFootprint,
                waterUsage,
                energyUsage,
                recycledContent,
                Arrays.asList("Nie wykryto")
        );

        // Produkcja
        Manufacturing manufacturing = new Manufacturing(
                new Producer(brand + " Producent", "Strefa Przemysłowa Zielona Dolina, Polska", "kontakt@" + brand.toLowerCase().replace(" ", "") + ".com"),
                Arrays.asList(
                        new ProductionSite("Polska", "FAB-001", Arrays.asList("Tkanie", "Barwienie")),
                        new ProductionSite("Portugalia", "FAB-002", Arrays.asList("Montaż", "Kontrola Jakości"))
                ),
                LocalDateTime.now().minusMonths(6).toString()
        );

        // Trwałość i pielęgnacja
        DurabilityAndCare durability = new DurabilityAndCare(
                200,
                "Prać w pralce w 30°C, suszyć w suszarce na niskiej temperaturze, prasować na średniej temperaturze",
                new Repairability("Średnia", true, "https://naprawa." + brand.toLowerCase().replace(" ", "") + ".com")
        );

        // Koniec życia produktu
        EndOfLife endOfLife = new EndOfLife(
                85.0,
                "https://recykling." + brand.toLowerCase().replace(" ", "") + ".com/demontaz",
                Arrays.asList(
                        new TakeBackProgram("Zielony Program Zwrotów", "https://" + brand.toLowerCase().replace(" ", "") + ".com/zwroty"),
                        new TakeBackProgram("Inicjatywa Recyklingu Tekstyliów", "https://siec-recyklingu.eu")
                )
        );

        // Łańcuch dostaw
        SupplyChainTraceability supplyChain = new SupplyChainTraceability(
                Arrays.asList(
                        new SupplyChainStage("Surowiec", "Spółdzielnia Gospodarstw Bawełny Organicznej", "Turcja", "GOTS"),
                        new SupplyChainStage("Produkcja Tkanin", "Zakłady EkoTekstylne", "Polska", "OEKO-TEX"),
                        new SupplyChainStage("Produkcja", brand + " Producent", "Portugalia", "Sprawiedliwy Handel")
                )
        );

        // Metadane
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
                return "Bawełna organiczna";
            } else if (lowerName.contains("dżinsy") || lowerName.contains("denim")) {
                return "Recyklingowany denim";
            } else if (lowerName.contains("konopi") || lowerName.contains("hemp")) {
                return "Konopie";
            } else if (lowerName.contains("bambusowych") || lowerName.contains("bamboo")) {
                return "Włókno bambusowe";
            } else if (lowerName.contains("wełny") || lowerName.contains("wool") || lowerName.contains("merino")) {
                return "Wełna merino";
            } else if (lowerName.contains("lniana") || lowerName.contains("linen")) {
                return "Organiczny len";
            } else if (lowerName.contains("skórzana") || lowerName.contains("leather")) {
                return "Zrównoważona skóra";
            } else if (lowerName.contains("jedwabiu") || lowerName.contains("silk")) {
                return "Organiczny jedwab";
            } else if (lowerName.contains("poliestru") || lowerName.contains("polyester")) {
                return "Recyklingowany poliester";
            } else if (lowerName.contains("tencelu") || lowerName.contains("tencel")) {
                return "Tencel Lyocell";
            } else if (lowerName.contains("sneakersy") || lowerName.contains("buty") || lowerName.contains("shoes")) {
                return "Recyklingowana guma";
            } else {
                return "Bawełna organiczna"; // domyślny materiał
            }
        } else {
            return "Elastan";
        }
    }
}