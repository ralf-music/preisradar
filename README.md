# preisscan

Private PWA „Einkaufshilfe“ für Preisvergleich, Produktsuche, Preiswecker und kommende Angebote.

## Stand v0.3.1

Umgesetzt:
- responsive PWA-Oberfläche
- sichtbare Versionsnummer
- finales Preisscan-App-Logo und Browser-/PWA-Icon
- Übersicht, vollständiger Preisvergleich, Produktsuche und Preiswecker
- lokale Speicherung des Referenzstandorts
- Standort kann jederzeit geändert werden
- Standort ist keine harte Radiusgrenze; weiter entfernte günstigere Märkte bleiben sichtbar
- lokale Verwaltung beobachteter Produkte; auch Startprodukte sind löschbar
- Produktfamilien-Suche mit Größenvarianten
- Grundpreislogik €/l und €/kg
- Preiszustände: Preis vorhanden / nicht im Sortiment / Preis nicht ermittelbar / noch nicht geprüft
- mehrere Preisarten pro Händler: regulär, Angebot, App/Kundenkarte, später Coupon
- bekannte aktuelle Preisbeispiele für Coca-Cola Zero 1,25 l
- Händlerdarstellung ohne externe Logo-Abhängigkeit
- Service Worker / Offline-App-Shell

Noch nicht aktiv:
- automatische Live-Preisabfragen bei Händlern
- automatische Standort-/Entfernungsberechnung
- serverseitige Cron-Jobs
- zentrale Preis-Historie
- echte Push-Benachrichtigungen
- Cloudflare Worker / KV / D1
- Barcode-/EAN-Scanner

## Technischer Projektname
preisscan

## Sichtbarer App-Name
Einkaufshilfe
