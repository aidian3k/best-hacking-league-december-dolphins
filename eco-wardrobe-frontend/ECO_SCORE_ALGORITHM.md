# Algorytm Oceny Ekologicznej Produktów

## Wprowadzenie

Algorytm oceny ekologicznej produktów (Eco Score) to system punktowy, który ocenia wpływ produktu tekstylnego na środowisko na podstawie danych z Digital Product Passport. Wynik jest wyrażony w skali 0-100, gdzie wyższa wartość oznacza bardziej ekologiczny produkt.

## Punkt Startowy

Każdy produkt rozpoczyna z **100 punktami**. Następnie punkty są dodawane lub odejmowane w zależności od różnych czynników ekologicznych.

## Składniki Oceny

### 1. Ślad Węglowy (Carbon Footprint)

Ocena zależy od kategorii produktu, ponieważ różne kategorie mają różne progi akceptowalności:

| Kategoria | Próg (kg CO₂e) |
|-----------|---------------|
| Skarpety  | 2.0           |
| Koszulki  | 3.0           |
| Spodnie   | 5.0           |
| Bluzy     | 6.0           |
| Inne      | 5.0           |

**Punktacja:**
- ≤ 50% progu: **+10 punktów** (doskonały)
- ≤ próg: **+5 punktów** (dobry)
- ≤ 150% progu: **0 punktów** (średni)
- ≤ 200% progu: **-10 punktów** (słaby)
- ≤ 300% progu: **-20 punktów** (bardzo słaby)
- > 300% progu: **-30 punktów** (katastrofalny)

**Waga:** 1.0

### 2. Materiały z Recyklingu (Recycled Content)

Progresywna ocena procentowej zawartości materiałów z recyklingu:

| Procent | Punkty |
|---------|--------|
| ≥ 80%   | +15    |
| ≥ 60%   | +12    |
| ≥ 40%   | +8     |
| ≥ 20%   | +4     |
| > 0%    | +2     |
| 0%      | -10    |

**Bonus za certyfikaty:**
- Jeśli ≥ 50% materiałów ma certyfikaty recyklingu (Recycled, RPET, GRS): **+5 punktów**

**Waga:** 1.2

### 3. Recyklingowalność (Recyclability)

Gradacja możliwości recyklingu produktu po zakończeniu życia:

| Procent | Punkty |
|---------|--------|
| ≥ 90%   | +15    |
| ≥ 70%   | +10    |
| ≥ 50%   | +5     |
| ≥ 30%   | -5     |
| ≥ 10%   | -15    |
| < 10%   | -25    |

**Waga:** 1.3

### 4. Synergia Recyklingowalności i Materiałów z Recyklingu

Bonus za produkty, które łączą wysoką recyklingowalność z materiałami z recyklingu (zamknięty obieg):

- Recyklingowalność ≥ 70% **I** Materiały z recyklingu ≥ 50%: **+8 punktów**
- Recyklingowalność ≥ 50% **I** Materiały z recyklingu ≥ 30%: **+4 punkty**

### 5. Substancje Niebezpieczne (Hazardous Substances)

- Obecność substancji niebezpiecznych: **-20 punktów**

**Waga:** 1.5

### 6. Naprawialność (Repairability)

Ocena łatwości naprawy produktu:

| Poziom trudności | Punkty |
|------------------|--------|
| Low              | +5     |
| Medium           | 0      |
| High             | -10    |

**Waga:** 0.8

### 7. Trwałość (Durability)

Ocena oczekiwanej żywotności produktu (w cyklach użytkowania):

| Cykle | Punkty |
|-------|--------|
| ≥ 100 | +8     |
| ≥ 70  | +5     |
| ≥ 50  | +2     |
| ≥ 30  | 0      |
| ≥ 15  | -5     |
| < 15  | -10    |

**Waga:** 0.6

### 8. Certyfikaty Materiałów (Certifications)

- Obecność certyfikatów materiałów (GOTS, Organic, Fair Trade, etc.): **+10 punktów**

**Waga:** 0.7

## Normalizacja Wyniku

Końcowy wynik jest normalizowany do zakresu **0-100**:
- Wynik < 0 → 0
- Wynik > 100 → 100
- Wynik jest zaokrąglany do liczby całkowitej

## Wagi Czynników

Różne czynniki mają różne wagi, co odzwierciedla ich względne znaczenie:

| Czynnik                | Waga |
|------------------------|------|
| Substancje niebezpieczne | 1.5 |
| Recyklingowalność      | 1.3 |
| Materiały z recyklingu | 1.2 |
| Ślad węglowy          | 1.0 |
| Naprawialność         | 0.8 |
| Certyfikaty           | 0.7 |
| Trwałość              | 0.6 |

## Przykład Obliczeń

### Produkt A: Koszulka ekologiczna
- Ślad węglowy: 2.5 kg CO₂e (próg: 3.0) → +5 × 1.0 = **+5**
- Materiały z recyklingu: 70% → +12 × 1.2 = **+14.4**
- Recyklingowalność: 85% → +15 × 1.3 = **+19.5**
- Synergia: 85% + 70% → **+8**
- Substancje niebezpieczne: brak → **0**
- Naprawialność: Low → +5 × 0.8 = **+4**
- Trwałość: 60 cykli → +2 × 0.6 = **+1.2**
- Certyfikaty: GOTS → +10 × 0.7 = **+7**

**Wynik:** 100 + 5 + 14.4 + 19.5 + 8 + 4 + 1.2 + 7 = **158.1** → **100** (maksimum)

### Produkt B: Koszulka fast fashion
- Ślad węglowy: 8.0 kg CO₂e (próg: 3.0) → -20 × 1.0 = **-20**
- Materiały z recyklingu: 0% → -10 × 1.2 = **-12**
- Recyklingowalność: 20% → -15 × 1.3 = **-19.5**
- Synergia: brak → **0**
- Substancje niebezpieczne: obecne → -20 × 1.5 = **-30**
- Naprawialność: High → -10 × 0.8 = **-8**
- Trwałość: 12 cykli → -5 × 0.6 = **-3**
- Certyfikaty: brak → **0**

**Wynik:** 100 - 20 - 12 - 19.5 - 30 - 8 - 3 = **7.5** → **8**

## Interpretacja Wyników

| Zakres | Ocena | Opis |
|--------|-------|------|
| 80-100 | Excellent | Doskonały wybór ekologiczny |
| 60-79  | Good      | Dobry wybór ekologiczny |
| 40-59  | Medium    | Średni wpływ na środowisko |
| 20-39  | Poor      | Słaby wybór ekologiczny |
| 0-19   | Bad       | Bardzo zły wpływ na środowisko |

## Elastyczność Algorytmu

Algorytm jest zaprojektowany z myślą o elastyczności. Wagi poszczególnych czynników mogą być dostosowane do zmieniających się priorytetów ekologicznych lub specyfiki branży. Domyślne wagi są zoptymalizowane pod kątem zrównoważonego rozwoju w branży tekstylnej.

## Uwagi Techniczne

- Wszystkie obliczenia są wykonywane na wartościach numerycznych z Digital Product Passport
- Algorytm obsługuje brakujące dane poprzez wartości domyślne (0 lub puste tablice)
- Kategorie produktów są automatycznie mapowane z nazw kategorii w DPP na standardowe kategorie systemu

