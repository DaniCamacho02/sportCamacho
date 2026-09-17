# Modo Guardián Android

La interfaz de sportCamacho ya incluye el flujo de selección y redirección, pero el bloqueo de otras aplicaciones no puede implementarse con JavaScript Expo por sí solo. Android necesita un servicio nativo.

## Integración necesaria para una build real

1. Convertir el proyecto a una build nativa mediante `npx expo prebuild` o mantener un módulo Expo local.
2. Añadir un `AccessibilityService` que reciba `TYPE_WINDOW_STATE_CHANGED`.
3. Leer el `packageName` de la ventana activa y compararlo con la lista seleccionada por el usuario.
4. Cuando el paquete esté vetado, abrir la ruta profunda de `sportCamacho` y mostrar la pantalla de inversión.
5. Usar `PackageManager` para listar las aplicaciones lanzables instaladas y enviar nombre, paquete e icono a React Native.
6. Guardar la lista de paquetes vetados y los minutos invertidos con almacenamiento local.
7. Solicitar al usuario el permiso de accesibilidad desde los Ajustes de Android.

## Por qué no se activa automáticamente en este prototipo

El servicio de accesibilidad requiere código Kotlin/Java y una declaración de servicio en `AndroidManifest.xml`. Añadir solamente `PACKAGE_USAGE_STATS` no permite interceptar ni impedir que otra aplicación se abra. La app muestra el botón de preparación y abre los ajustes del sistema para que la siguiente build nativa pueda completar el permiso.

## Google

La pantalla de perfil está preparada para el flujo de cuenta. Para producción, hay que conectar el cliente OAuth real de Google con los IDs de Android/iOS y los secretos configurados en EAS; el prototipo usa una cuenta de demostración para no fingir una autenticación real.
