# Moderne Wetter App

Eine elegante und moderne Wetter-App, die mit Next.js, TypeScript, Tailwind CSS und Framer Motion erstellt wurde. 

## Features

- 🌦️ Aktuelle Wetterdaten für jede Stadt weltweit
- 🔍 Suchfunktion mit Standortvorschlag basierend auf IP-Adresse
- 🌙 Tag/Nacht-Anzeige basierend auf Sonnenaufgang/Sonnenuntergang
- 📱 Vollständig responsives Design für alle Geräte
- 🎨 Modernes UI mit Glasmorphismus-Effekten
- ✨ Flüssige Animationen und Übergänge mit Framer Motion
- 🌐 Deutsche Benutzeroberfläche

## Technologien

- [Next.js 15](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Open-Meteo API](https://open-meteo.com/) (kostenlos, keine API-Key erforderlich)
- [IP-API](http://ip-api.com/) für Geolokalisierung (kostenlos, keine API-Key erforderlich)

## Installation

1. Repository klonen:
   ```bash
   git clone https://github.com/Miro23081/wetter-app.git
   cd wetter-app
   ```

2. Abhängigkeiten installieren:
   ```bash
   npm install
   # oder
   yarn install
   # oder
   pnpm install
   ```

3. Entwicklungsserver starten:
   ```bash
   npm run dev
   # oder
   yarn dev
   # oder
   pnpm dev
   ```

4. Öffne [http://localhost:3000](http://localhost:3000) in deinem Browser.

## Verwendung

1. Beim Laden der App wird automatisch versucht, deinen Standort anhand deiner IP-Adresse zu finden.
2. Wenn du die Suchleiste anklickst, wird dein Standort als Vorschlag angezeigt. Du kannst die Tab-Taste drücken, um diesen Vorschlag zu übernehmen.
3. Alternativ kannst du den Pin-Button neben der Suchleiste klicken, um direkt nach dem Wetter an deinem aktuellen Standort zu suchen.
4. Gib den Namen einer Stadt ein und drücke Enter oder klicke auf die Suchen-Schaltfläche, um das aktuelle Wetter anzuzeigen.

## API-Endpunkte

Die App verwendet zwei kostenlose APIs:

1. **Open-Meteo API**: Für Wetterdaten und Geocoding
   - Keine Authentifizierung erforderlich
   - Dokumentation: [https://open-meteo.com/en/docs](https://open-meteo.com/en/docs)

2. **IP-API**: Für die Geolokalisierung basierend auf der IP-Adresse
   - Keine Authentifizierung erforderlich
   - Dokumentation: [http://ip-api.com/docs](http://ip-api.com/docs)

## Projektstruktur

```
weather-app/
├── public/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── SearchBar.tsx
│   │   └── WeatherCard.tsx
│   └── services/
│       └── weatherService.ts
├── .gitignore
├── next.config.js
├── package.json
├── README.md
├── tailwind.config.js
└── tsconfig.json
```

## Anpassung

Du kannst das Erscheinungsbild der App anpassen, indem du die Tailwind-Konfiguration in `tailwind.config.js` änderst oder die CSS-Stile in `src/app/globals.css` bearbeitest.

## Lizenz

MIT

## Autor

Erstellt mit ❤️ von Miro
