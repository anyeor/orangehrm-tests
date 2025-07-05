# 🚀 OrangeHRM TDD - Testy Automatyczne w Cypress

## 📋 Opis projektu

Projekt testów automatycznych dla systemu OrangeHRM oparty na **Test Driven Development (TDD)** i frameworku **Cypress**. Zawiera kompleksowy zestaw testów E2E pokrywających główne funkcjonalności systemu HR.

## 🎯 Funkcjonalności testowe

### 🔐 **Logowanie**
- Logowanie z prawidłowymi danymi
- Walidacja nieprawidłowych danych logowania
- Sprawdzanie walidacji pustych pól

### 👥 **Administracja**
- Zarządzanie użytkownikami (dodawanie, usuwanie)
- Zarządzanie stanowiskami pracy
- Walidacja duplikatów użytkowników

### 🏢 **Zarządzanie pracownikami (PIM)**
- Dodawanie nowych pracowników
- Edycja danych pracowników
- Usuwanie pracowników
- Wyszukiwanie pracowników

### 📢 **Rekrutacja**
- Zarządzanie ogłoszeniami o pracę
- Dodawanie i usuwanie wakatów
- Walidacja formularzy rekrutacyjnych

### 💬 **Buzz (Media społecznościowe)**
- Tworzenie postów
- Polubienia i anulowanie polubień
- Interakcje społecznościowe

### 🔧 **Tryb maintenance**
- Dostęp do trybu serwisowego
- Walidacja uprawnień administratora

## 📁 Struktura projektu

```
orangehrm-tests/
├── cypress/
│   ├── fixtures/
│   │   └── data.json                 # Dane testowe
│   ├── integration/
│   │   ├── admin.js                  # Testy administracyjne
│   │   ├── buzz.js                   # Testy mediów społecznościowych
│   │   ├── login.js                  # Testy logowania
│   │   ├── maintenance.js            # Testy trybu maintenance
│   │   ├── PIM.js                    # Testy zarządzania pracownikami
│   │   └── recruitment.js            # Testy rekrutacji
│   └── support/
│       ├── commands.js               # Komendy niestandardowe
│       └── e2e.js                    # Konfiguracja globalna
├── cypress.config.js                 # Konfiguracja Cypress
├── package.json                      # Zależności i skrypty
└── README.md                         # Dokumentacja
```

## 🛠️ Instalacja

### Wymagania wstępne
- **Node.js** (wersja 16.x lub wyższa)
- **npm** (wersja 8.x lub wyższa)

### Kroki instalacji

1. **Sklonuj repozytorium**
```bash
git clone https://github.com/anyeor/orangehrm-tests.git
cd orangehrm-tests
```

2. **Zainstaluj zależności**
```bash
npm install
```

3. **Sprawdź instalację**
```bash
npx cypress --version
```

## 🚀 Uruchamianie testów

### 🖥️ **Tryb interaktywny (GUI)**
```bash
npm run open
```
**Zalecane dla:** debugowania, rozwoju testów, obserwowania wykonania

### ⚡ **Tryb headless (bez GUI)**
```bash
npm test
```
**Zalecane dla:** CI/CD, szybkie uruchomienie wszystkich testów

### 🌐 **Uruchamianie w konkretnej przeglądarce**
```bash
# Chrome
npm run chrome

# Firefox
npm run firefox

# Microsoft Edge
npm run edge

# Electron (domyślny)
npm run electron
```

### 👁️ **Tryb headed (z widoczną przeglądarką)**
```bash
npm run headed
```

## 📊 Dostępne skrypty

| Skrypt | Opis | Zastosowanie |
|--------|------|-------------|
| `npm run open` | Otwiera GUI Cypress | Rozwój i debugowanie |
| `npm test` | Uruchamia testy w trybie headless | CI/CD, szybkie testy |
| `npm run headed` | Uruchamia testy z widoczną przeglądarką | Obserwowanie wykonania |
| `npm run chrome` | Uruchamia testy w Chrome | Testy specyficzne dla Chrome |
| `npm run firefox` | Uruchamia testy w Firefox | Testy specyficzne dla Firefox |
| `npm run edge` | Uruchamia testy w Edge | Testy specyficzne dla Edge |

## 🔧 Konfiguracja

### Środowisko testowe
Testy są skonfigurowane do pracy z:
- **URL:** `https://opensource-demo.orangehrmlive.com/`
- **Wzorzec plików:** `cypress/integration/*.js`
- **Ponawianie testów:** 3 razy w przypadku niepowodzenia

### Dane testowe
Wszystkie dane testowe są centralizowane w `cypress/fixtures/data.json`:

```json
{
  "authentication": {
    "validCredentials": {
      "username": "Admin",
      "password": "admin123"
    }
  },
  "employees": {
    "newEmployee": {
      "firstName": "Automation",
      "lastName": "Engineer",
      "employeeID": "123456789"
    }
  }
}
```

## 🔍 Opis testów

### **Login Tests** (`login.js`)
- Weryfikacja poprawnego logowania
- Testowanie nieprawidłowych danych uwierzytelniania
- Walidacja pustych pól formularza

### **Admin Tests** (`admin.js`)
- Zarządzanie użytkownikami systemu
- Operacje CRUD na stanowiskach pracy
- Walidacja duplikatów i uprawnień

### **PIM Tests** (`PIM.js`)
- Pełny cykl życia pracownika
- Operacje wyszukiwania i filtrowania
- Zarządzanie danymi osobowymi

### **Recruitment Tests** (`recruitment.js`)
- Zarządzanie procesem rekrutacji
- Tworzenie i usuwanie wakatów
- Walidacja formularzy aplikacyjnych

### **Buzz Tests** (`buzz.js`)
- Funkcjonalności mediów społecznościowych
- Interakcje użytkowników (posty, lajki)
- Zarządzanie treściami

### **Maintenance Tests** (`maintenance.js`)
- Dostęp do trybu serwisowego
- Walidacja uprawnień administratora
- Bezpieczeństwo systemu

## 🛡️ Najlepsze praktyki

### 🎯 **Struktura testów:**
- Jeden plik = jedna funkcjonalność
- Grupowanie testów w bloki `describe()`
- Jasne nazewnictwo testów

### 📝 **Kod:**
- Wykorzystanie custom commands
- Centralizacja danych testowych
- Obsługa błędów i warunków brzegowych

### 🔄 **Utrzymanie:**
- Regularne aktualizacje selektorów
- Monitoring stabilności testów
- Dokumentacja zmian

## 🐛 Rozwiązywanie problemów

### **Problem:** Testy nie uruchamiają się
**Rozwiązanie:**
```bash
npm install
npx cypress cache clear
npm run open
```

### **Problem:** Błędy selektorów
**Rozwiązanie:**
- Sprawdź czy aplikacja jest dostępna
- Zweryfikuj selektory w narzędziach deweloperskich
- Użyj `cy.wait()` dla dynamicznych elementów

### **Problem:** Timeouty
**Rozwiązanie:**
- Zwiększ timeout w `cypress.config.js`
- Dodaj `cy.wait()` przed krytycznymi operacjami
- Sprawdź stabilność połączenia internetowego

## 📞 Wsparcie

W przypadku problemów:
1. Sprawdź logi w terminalu
2. Przejrzyj dokumentację Cypress
3. Sprawdź issues w repozytorium
4. Skontaktuj się z zespołem QA

## 📄 Licencja

Projekt jest licencjonowany na licencji Apache-2.0.

---

**Wersja:** 1.0.0  
**Ostatnia aktualizacja:** 2025
**Framework:** Cypress 13.2.0
