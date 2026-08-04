# 💌 Interaktywna laurka

Słodka, interaktywna laurka w czystym HTML/CSS/JS. Otwierasz dwuklikiem `index.html` — nie trzeba nic instalować.

## Jak uruchomić
Kliknij dwa razy w `index.html` — otworzy się w przeglądarce.

## Co zawiera
1. **Ekran otwierania** – klikana koperta z animacją.
2. **Animowany list** – tekst pojawia się linijka po linijce.
3. **Galeria wspomnień** – siatka zdjęć z efektem po najechaniu.
4. **Karteczki „za co Cię kocham"** – klikasz i się odwracają.
5. **Finał** – pytanie z uciekającym przyciskiem „Nie" i konfetti po kliknięciu „Tak".

## Jak podmienić treść na swoją

| Co zmienić | Gdzie |
|---|---|
| Tekst listu | `index.html` → sekcja `LIST` (`#letter-text`) |
| Zdjęcia | wrzuć do `assets/img/`, potem podmień kafelki w sekcji `GALERIA` (instrukcja w `assets/img/TU-WRZUC-ZDJECIA.txt`) |
| Powody „za co Cię kocham" | `index.html` → sekcja `KARTECZKI` (tekst w `.flip-back`) |
| Pytanie na końcu | `index.html` → sekcja `FINAŁ` (`.final-q`) |
| Kolory / motyw | `css/style.css` → sekcja `ZMIENNE / MOTYW` (na górze) |

## Struktura
```
├── index.html
├── css/style.css
├── js/script.js
├── assets/img/     (tu Twoje zdjęcia)
└── README.md
```

## Muzyka w tle (opcjonalnie)
Wrzuć plik do `assets/music/piosenka.mp3` i dodaj w `index.html` przed `</body>`:
```html
<audio src="assets/music/piosenka.mp3" autoplay loop></audio>
```
> Uwaga: przeglądarki często blokują autoodtwarzanie — dźwięk zwykle ruszy dopiero po kliknięciu (np. po otwarciu koperty).
