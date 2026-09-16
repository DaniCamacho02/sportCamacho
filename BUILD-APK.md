# Generar la APK de sportCamacho

Este proyecto está preparado para generar una APK Android mediante Expo Application Services (EAS).

## Requisitos

- Node.js 18 o superior
- Una cuenta de Expo
- Expo CLI/EAS CLI

## Comandos

```bash
npm install -g eas-cli
cd sportCamacho
npm install
eas login
eas build -p android --profile preview
```

El perfil `preview` genera una **APK instalable directamente** en Android. Cuando termine la compilación, EAS mostrará un enlace de descarga. Abre ese enlace desde el móvil y acepta la instalación.

Para una publicación en Google Play usa:

```bash
eas build -p android --profile production
```

El perfil `production` genera un Android App Bundle (`.aab`), que es el formato recomendado para Google Play.

> Nota: la cámara y los permisos nativos funcionan en la build Android. El preview web incluido en el proyecto usa un modo demo de cámara.
