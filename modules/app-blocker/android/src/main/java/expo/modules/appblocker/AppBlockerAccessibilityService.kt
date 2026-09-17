package expo.modules.appblocker

import android.accessibilityservice.AccessibilityService
import android.content.Intent
import android.net.Uri
import android.view.accessibility.AccessibilityEvent

/**
 * Escucha qué app pasa a primer plano. Si es una app vetada y no hay una sesión
 * de minutos vigente para ella, lanza sportCamacho mediante su deep link propio
 * (manussportcamacho://blocked?package=...) en vez de dejar que la app vetada
 * se muestre. El usuario ve sportCamacho, no la app que intentó abrir.
 */
class AppBlockerAccessibilityService : AccessibilityService() {

  private var lastRedirectedPackage: String? = null
  private var lastRedirectedAt: Long = 0L

  override fun onAccessibilityEvent(event: AccessibilityEvent?) {
    if (event == null || event.eventType != AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) return
    val packageName = event.packageName?.toString() ?: return

    if (packageName == applicationContext.packageName) return
    if (isLauncherOrSystemUi(packageName)) return

    val blocked = BlockedAppsStore.getBlockedPackages(applicationContext)
    if (packageName !in blocked) return
    if (BlockedAppsStore.hasActiveSession(applicationContext, packageName)) return

    // Evita relanzar en bucle si llegan varios eventos seguidos para el mismo paquete.
    val now = System.currentTimeMillis()
    if (packageName == lastRedirectedPackage && now - lastRedirectedAt < 1500) return
    lastRedirectedPackage = packageName
    lastRedirectedAt = now

    redirectToSportCamacho(packageName)
  }

  private fun redirectToSportCamacho(blockedPackageName: String) {
    val uri = Uri.parse("manussportcamacho://blocked").buildUpon()
      .appendQueryParameter("package", blockedPackageName)
      .build()

    val intent = Intent(Intent.ACTION_VIEW, uri).apply {
      setPackage(applicationContext.packageName)
      addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP)
    }
    try {
      applicationContext.startActivity(intent)
    } catch (error: Exception) {
      // Si por lo que sea no se puede lanzar (dispositivo raro, permisos...), no rompemos el servicio.
    }
  }

  private fun isLauncherOrSystemUi(packageName: String): Boolean {
    return packageName.contains("launcher") ||
      packageName == "com.android.systemui" ||
      packageName == "android"
  }

  override fun onInterrupt() {
    // No-op: no necesitamos limpiar nada especial.
  }
}
