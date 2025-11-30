# Eco Wardrobe

## Opis Projektu

**Eco Wardrobe** to aplikacja webowa służąca do zarządzania ekologiczną garderobą poprzez analizę wpływu produktów tekstylnych na środowisko. System wykorzystuje **Digital Product Passport (DPP)** do oceny ekologiczności produktów i pomaga użytkownikom w podejmowaniu świadomych decyzji zakupowych.

## Główne Funkcjonalności

### 1. Skanowanie Produktów
- Skanowanie kodów QR produktów tekstylnych
- Automatyczne pobieranie danych z Digital Product Passport
- Wyświetlanie szczegółowych informacji o produkcie
- Dodawanie produktów do wirtualnej szafy

### 2. Zarządzanie Szafą
- Przeglądanie produktów w kategoriach (koszulki, spodnie, bluzy, skarpety)
- Filtrowanie produktów według kategorii
- Statystyki szafy (średni wynik ekologiczny, liczba produktów)
- Szczegółowe informacje o każdym produkcie

### 3. System Oceny Ekologicznej (Eco Score)
- Algorytm punktowy (0-100) oceniający wpływ produktu na środowisko
- Uwzględnia:
  - Ślad węglowy (carbon footprint)
  - Zawartość materiałów z recyklingu
  - Recyklingowalność produktu
  - Obecność substancji niebezpiecznych
  - Naprawialność
  - Trwałość
  - Certyfikaty materiałów
- Szczegółowy opis algorytmu znajduje się w pliku `ECO_SCORE_ALGORITHM.md`

### 4. Analiza i Statystyki
- Globalny wynik ekologiczny szafy
- Analiza składu materiałowego (naturalne vs syntetyczne)
- Statystyki kategorii produktów
- Wskaźniki: produkty ekologiczne, recyklingowalność, naprawialność
- Wizualizacje danych (wykresy kołowe, słupkowe)

### 5. Udostępnianie Szaf
- Generowanie kodów udostępniania szafy
- Obserwowanie szaf innych użytkowników
- System influencerów - publiczne szafy osób promujących ekologię
- Przeglądanie publicznych szaf znajomych

### 6. Autentykacja i Profil
- Rejestracja i logowanie użytkowników
- Zarządzanie profilem użytkownika
- Oznaczenie użytkowników jako influencerów

## Architektura Techniczna

### Backend
- **Framework**: Spring Boot 4.0.0
- **Język**: Java 21
- **Baza danych**: Relational
- **ORM**: JPA/Hibernate
- **API**: RESTful
- **Zarządzanie zależnościami**: Gradle

**Główne komponenty:**
- `AuthController` - autentykacja użytkowników
- `ProductController` - zarządzanie produktami
- `WardrobeShareController` - udostępnianie szaf
- `UserController` - zarządzanie profilami użytkowników

**Modele danych:**
- `User` - użytkownicy z preferencjami i profilami
- `Product` - produkty z pełnymi danymi DPP
- `WardrobeShare` - udostępnienia szaf
- `SavedUserWardrobe` - zapisane szafy innych użytkowników

### Frontend
- **Framework**: React 18.3
- **Język**: TypeScript
- **Build tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Routing**: React Router
- **State Management**: React Query (TanStack Query)
- **Animacje**: Framer Motion
- **Wykresy**: Recharts
- **Skanowanie QR**: html5-qrcode

**Główne strony:**
- `/` - Autentykacja
- `/wardrobe` - Przegląd szafy
- `/scanner` - Skaner produktów
- `/analytics` - Analiza statystyk
- `/discover-wardrobes` - Odkrywanie szaf
- `/settings` - Ustawienia
- `/product/:id` - Szczegóły produktu
- `/public-wardrobe/:id` - Publiczna szafa

## Struktura Projektu

```
best-hacking-league-december-dolphins/
├── eco-wardrobe-backend/          # Backend Spring Boot
│   ├── src/main/java/
│   │   └── ee/pw/ecowardrobebackend/
│   │       ├── config/           # Konfiguracja (CORS, Security, DataLoader)
│   │       ├── controller/       # Kontrolery REST API
│   │       ├── dto/              # Data Transfer Objects
│   │       ├── entity/           # Encje JPA
│   │       ├── repository/       # Repozytoria danych
│   │       └── service/          # Logika biznesowa
│   └── build.gradle
│
└── eco-wardrobe-frontend/         # Frontend React
    ├── src/
    │   ├── api/                  # Klienty API
    │   ├── components/           # Komponenty React
    │   │   ├── auth/            # Komponenty autentykacji
    │   │   ├── layout/          # Layout aplikacji
    │   │   ├── scanner/         # Komponenty skanera
    │   │   ├── ui/              # Komponenty UI (shadcn/ui)
    │   │   └── wardrobe/        # Komponenty szafy
    │   ├── contexts/            # Context API
    │   ├── pages/               # Strony aplikacji
    │   ├── services/            # Serwisy (Eco Score, statystyki)
    │   └── types/               # Definicje TypeScript
    └── package.json
```

## Digital Product Passport (DPP)

Aplikacja wykorzystuje standard Digital Product Passport, który zawiera:
- **Informacje o produkcie**: GTIN, nazwa, kategoria, marka, model
- **Skład materiałowy**: materiały, procentowy skład, certyfikaty
- **Wpływ na środowisko**: ślad węglowy, zużycie wody, energia, zawartość recyklingu
- **Produkcja**: producent, miejsca produkcji, data wytworzenia
- **Trwałość i konserwacja**: oczekiwana żywotność, instrukcje prania, naprawialność
- **Koniec życia**: recyklingowalność, instrukcje demontażu, programy zwrotu
- **Śledzenie łańcucha dostaw**: etapy produkcji, dostawcy, certyfikaty

## Technologie

### Backend
- Spring Boot 4.0.0
- Spring Data JPA
- H2 Database
- Lombok
- Spring Cloud OpenFeign

### Frontend
- React 18.3
- TypeScript 5.8
- Vite 5.4
- Tailwind CSS 3.4
- React Router 6.30
- TanStack Query 5.83
- Framer Motion 12.23
- Recharts 2.15
- html5-qrcode 2.3

## Funkcje Specjalne

### System Influencerów
Użytkownicy mogą być oznaczeni jako influencerzy, co umożliwia:
- Publiczne udostępnianie ich szaf
- Promowanie ekologicznych wyborów modowych
- Inspirowanie innych użytkowników

### Algorytm Eco Score
Zaawansowany algorytm oceny ekologicznej uwzględniający:
- Zróżnicowane progi dla różnych kategorii produktów
- Wagi czynników ekologicznych
- Bonusy za synergię (np. recyklingowalność + materiały z recyklingu)
- Normalizację wyników do zakresu 0-100

## Bezpieczeństwo

- Konfiguracja CORS dla komunikacji frontend-backend
- System autentykacji użytkowników
- Chronione trasy w aplikacji frontendowej
- Walidacja danych wejściowych

## Status Projektu

Projekt został stworzony w ramach **Best Hacking League December Dolphins** i stanowi kompleksowe rozwiązanie do zarządzania ekologiczną garderobą z wykorzystaniem technologii Digital Product Passport.

