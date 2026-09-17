package expo.modules.installedapps

import android.content.Intent
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import android.util.Base64
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.io.ByteArrayOutputStream

class InstalledAppsModule : Module() {

  override fun definition() = ModuleDefinition {
    // Debe coincidir con requireNativeModule("InstalledApps") en el lado JS.
    Name("InstalledApps")

    AsyncFunction("getInstalledApps") {
      val context = appContext.reactContext
        ?: throw IllegalStateException("No se pudo acceder al contexto de Android")

      val packageManager = context.packageManager
      val ownPackageName = context.packageName

      // Buscamos actividades con icono de lanzador (MAIN + LAUNCHER). Esto NO requiere
      // el permiso sensible QUERY_ALL_PACKAGES: basta con declarar esta intención en
      // el bloque <queries> del manifest (ver plugins/withInstalledAppsQueries.js).
      val launcherIntent = Intent(Intent.ACTION_MAIN, null).apply {
        addCategory(Intent.CATEGORY_LAUNCHER)
      }

      packageManager.queryIntentActivities(launcherIntent, 0)
        .distinctBy { it.activityInfo.packageName }
        .filter { it.activityInfo.packageName != ownPackageName }
        .map { resolveInfo ->
          val packageName = resolveInfo.activityInfo.packageName
          val appName = resolveInfo.loadLabel(packageManager)?.toString() ?: packageName
          val icon = try {
            drawableToBase64Png(resolveInfo.loadIcon(packageManager))
          } catch (error: Exception) {
            null
          }
          mapOf(
            "packageName" to packageName,
            "appName" to appName,
            "icon" to icon,
          )
        }
        .sortedBy { (it["appName"] as String).lowercase() }
    }
  }

  /** Convierte el Drawable del icono de la app a un data URI base64 de PNG. */
  private fun drawableToBase64Png(drawable: Drawable): String {
    val bitmap: Bitmap = if (drawable is BitmapDrawable && drawable.bitmap != null) {
      drawable.bitmap
    } else {
      val width = if (drawable.intrinsicWidth > 0) drawable.intrinsicWidth else 96
      val height = if (drawable.intrinsicHeight > 0) drawable.intrinsicHeight else 96
      val bmp = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
      val canvas = Canvas(bmp)
      drawable.setBounds(0, 0, canvas.width, canvas.height)
      drawable.draw(canvas)
      bmp
    }

    val outputStream = ByteArrayOutputStream()
    bitmap.compress(Bitmap.CompressFormat.PNG, 90, outputStream)
    val encoded = Base64.encodeToString(outputStream.toByteArray(), Base64.NO_WRAP)
    return "data:image/png;base64,$encoded"
  }
}
