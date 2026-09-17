package expo.modules.appblocker

import android.content.Intent
import android.provider.Settings
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class AppBlockerModule : Module() {

  override fun definition() = ModuleDefinition {
    Name("AppBlocker")

    AsyncFunction("syncState") { blockedPackages: List<String>, sessions: List<Map<String, Any>> ->
      val context = appContext.reactContext ?: return@AsyncFunction
      val parsedSessions = sessions.mapNotNull { entry ->
        val packageName = entry["packageName"] as? String ?: return@mapNotNull null
        val expiresAt = (entry["expiresAt"] as? Number)?.toLong() ?: return@mapNotNull null
        packageName to expiresAt
      }
      BlockedAppsStore.save(context, blockedPackages, parsedSessions)
    }

    AsyncFunction("isAccessibilityServiceEnabled") {
      val context = appContext.reactContext ?: return@AsyncFunction false
      val expectedComponent = "${context.packageName}/${AppBlockerAccessibilityService::class.java.name}"
      val enabledServices = Settings.Secure.getString(
        context.contentResolver,
        Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES,
      ) ?: ""
      enabledServices.split(':').any { it.equals(expectedComponent, ignoreCase = true) }
    }

    AsyncFunction("openAccessibilitySettings") {
      val context = appContext.reactContext ?: return@AsyncFunction
      val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS).apply {
        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      }
      context.startActivity(intent)
    }
  }
}
