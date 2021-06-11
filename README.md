# Monaco Omnisharp POC
## Was?
Innerhalb dieses Repositories soll versucht werden die Verbindung zwischen dem [Monaco-Editor](https://github.com/Microsoft/monaco-editor) (Unterbau von VSCode) und dem [omnisharp-roslyn](https://github.com/OmniSharp/omnisharp-roslyn) 
herzustellen, sodass verschiedene IDE-Funktionalitäten innerhalb des Monaco-Editors funktionieren. Dazu gehört insbesondere die Diagnostics (bspw.: Typen-Konformität, ...).

## Warum?
Innerhalb der Erweiterung des MARS-Explorers soll es eine Mini-IDE geben, die den fachfremden Modellierenden bei der Modellierung unterstützen.
Die Modelle werden in dotnet geschrieben, weshalb minimal eine Typen-Prüfung stattfinden sollte, sodass die Modellierenden die Fehler nicht erst bei der Validierung/Kompilierung ihrer Modelle feststellen.

Da dies keine triviale Aufgabe ist und auch nicht Hauptaufgabe der Master-Thesis sein soll einen eigenen Compiler zu schreiben, wird zu dem [Language Server Protokoll](https://microsoft.github.io/language-server-protocol/) gegriffen, der eine solche Kommunikation zwischen dem Client (die IDE des Modellierenden) und Server (der Compiler) standardisiert.

## Wie?

Für diesen relativ jungen Standard gibt es bereits ein paar Lösungen, die eingesetzt werden können:
- [Language Client für den Monaco-Editor](https://github.com/TypeFox/monaco-languageclient)
- [dotnet Language Server](https://github.com/OmniSharp/omnisharp-roslyn)

Das Repository basiert auf [diesem Repo](https://github.com/patilarpith/monaco-languageclient-omnisharp-lsp), welches wiederum auf dem [diesem Beispiel](https://github.com/TypeFox/monaco-languageclient/tree/master/example) des `monaco-languageclient` basiert. 

Bisher ist erfolgt:
- Entfernen unnötiger Abhängigkeiten und Ordnerstrukturen
- Anpassung des `Dockerfile`
- Upgrade der verwendeten Abhängigkeiten

## Ausführung
### Lokal
1. `yarn install`
2. `yarn prepare`
3. `yarn start:ext`
### Im Docker Container
1. `docker build -t monaco-omnisharp-poc .`
2. `docker run --rm -p 3000:3000 monaco-omnisharp-poc`
