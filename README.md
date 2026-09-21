# preisscan

Private PWA „Einkaufshilfe“ für Preisvergleich, Produktsuche, Preiswecker und kommende Angebote.

## Stand v0.2.0

Bereits umgesetzt:
- echte PWA-Struktur und responsive Oberfläche
- Übersicht der beobachteten Produkte
- vollständiger Preisvergleich aller getrackten Märkte
- Händlerlogos mit getrenntem Filial-/Standorttext
- Produktbilder mit robustem Fallback
- Preiswecker-Oberfläche mit lokaler Speicherung
- Statusmodell: Preis vorhanden / nicht im Sortiment / Preis nicht ermittelbar / noch nicht geprüft
- Zeitstempel-Unterstützung
- Datenmodell für kommende Angebote
- freie Produktsuche als Produktfamilien-Suche
- mehrere Größen/Packungsformen als getrennte Varianten
- Grundpreislogik für €/l und €/kg vorbereitet
- zusätzliche Suchtreffer können lokal „beobachtet“ werden
- Service Worker / Offline-App-Shell
- remote geladene Bilder werden nach erfolgreichem Abruf durch den Service Worker gecacht

Noch nicht aktiv:
- Live-Preisabfragen
- serverseitige Cron-Jobs
- zentrale Preis-Historie
- echte Push-Benachrichtigungen
- Cloudflare Worker / KV / D1
- dynamischer Händlerkatalog aus Live-Quellen

## Technischer Projektname
preisscan

## Sichtbarer App-Name
Einkaufshilfe

## Asset-Hinweis
Die aktuelle Version verwendet Web-Quellen für Händlerlogos und die drei initialen Produktbilder. Das UI besitzt Fallbacks, falls ein externer Asset nicht geladen werden kann. Die Referenzen können später ohne Änderung der UI gegen lokale Dateien ausgetauscht werden.
