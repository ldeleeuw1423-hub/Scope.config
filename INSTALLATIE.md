# Scope Configurator NuRijnland — Installatie

## Vereisten

Node.js v20 of hoger: https://nodejs.org/en/download

Kies **Windows Installer (.msi) — LTS** en installeer met standaardinstellingen.
Start daarna een **nieuw** PowerShell-venster zodat `node` en `npm` beschikbaar zijn.

---

## Eerste keer opstarten

```powershell
# 1. Open PowerShell en ga naar de projectmap
cd C:\Users\ldlw\scope-configurator

# 2. Installeer backend-afhankelijkheden
npm install

# 3. Installeer frontend-afhankelijkheden
cd client
npm install
cd ..

# 4. Laad de volledige bouwblokbibliotheek (~90 blokken)
npm run seed

# 5. Start de applicatie (backend + frontend tegelijk)
npm run dev
```

De app opent op:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api

---

## Dagelijks gebruik

```powershell
cd C:\Users\ldlw\scope-configurator
npm run dev
```

Open daarna http://localhost:5173 in de browser.

---

## Projectdata

De SQLite-database staat in `data/scope.db`. Maak regelmatig een backup van dit bestand.

---

## Problemen oplossen

| Probleem | Oplossing |
|----------|-----------|
| `npm: command not found` | Node.js niet geïnstalleerd of nieuw terminalvenster nodig |
| Poort 3000 bezet | `$env:PORT=3001; npm run server` |
| Lege bibliotheek | `npm run seed` opnieuw uitvoeren |
| Word-export mislukt | Controleer of `node_modules` compleet is met `npm install` |
