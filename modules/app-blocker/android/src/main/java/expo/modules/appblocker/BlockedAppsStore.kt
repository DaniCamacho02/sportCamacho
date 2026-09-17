package expo.modules.appblocker

import android.content.Context
import org.json.JSONArray
import org.json.JSONObject

/**
 * El AccessibilityService corre de forma independiente del puente de React Native
 * (puede seguir vivo aunque la UI de la app esté cerrada), así que no puede leer el
 * estado de React directamente. En su lugar, el módulo escribe aquí cada vez que
 * cambian las apps vetadas o las sesiones activas, y el servicio simplemente lee
 * estas SharedPreferences en cada evento de ventana.
 */
object BlockedAppsStore {
  private const val PREFS_NAME = "sportcamacho_app_blocker"
  private const val KEY_BLOCKED = "blocked_packages"
  private const val KEY_SESSIONS = "active_sessions"

  fun save(context: Context, blockedPackages: List<String>, sessions: List<Pair<String, Long>>) {
    val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    val blockedJson = JSONArray(blockedPackages)
    val sessionsJson = JSONArray()
    sessions.forEach { (packageName, expiresAt) ->
      sessionsJson.put(JSONObject().apply {
        put("packageName", packageName)
        put("expiresAt", expiresAt)
      })
    }
    prefs.edit()
      .putString(KEY_BLOCKED, blockedJson.toString())
      .putString(KEY_SESSIONS, sessionsJson.toString())
      .apply()
  }

  fun getBlockedPackages(context: Context): Set<String> {
    val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    val raw = prefs.getString(KEY_BLOCKED, "[]") ?: "[]"
    val array = JSONArray(raw)
    return (0 until array.length()).map { array.getString(it) }.toSet()
  }

  /** Devuelve true si hay una sesión de tiempo pagado todavía vigente para ese paquete. */
  fun hasActiveSession(context: Context, packageName: String): Boolean {
    val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    val raw = prefs.getString(KEY_SESSIONS, "[]") ?: "[]"
    val array = JSONArray(raw)
    val now = System.currentTimeMillis()
    for (i in 0 until array.length()) {
      val entry = array.getJSONObject(i)
      if (entry.getString("packageName") == packageName && entry.getLong("expiresAt") > now) {
        return true
      }
    }
    return false
  }
}
