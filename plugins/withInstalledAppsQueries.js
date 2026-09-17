const { withAndroidManifest } = require("@expo/config-plugins");

/**
 * Añade un bloque <queries> al AndroidManifest.xml declarando que la app
 * necesita ver actividades MAIN/LAUNCHER de otras apps. Esto permite listar
 * las apps instaladas con PackageManager.queryIntentActivities sin pedir el
 * permiso sensible QUERY_ALL_PACKAGES (que exige justificación extra en la
 * revisión de Google Play).
 *
 * Referencia: https://developer.android.com/training/package-visibility
 */
function withInstalledAppsQueries(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;

    if (!Array.isArray(manifest.queries)) {
      manifest.queries = manifest.queries ? [manifest.queries] : [{}];
    }

    const queriesBlock = manifest.queries[0] ?? {};
    if (!Array.isArray(queriesBlock.intent)) {
      queriesBlock.intent = queriesBlock.intent ? [queriesBlock.intent] : [];
    }

    const hasMainLauncherIntent = queriesBlock.intent.some((intent) => {
      const actionName = intent?.action?.[0]?.$?.["android:name"];
      return actionName === "android.intent.action.MAIN";
    });

    if (!hasMainLauncherIntent) {
      queriesBlock.intent.push({
        action: [{ $: { "android:name": "android.intent.action.MAIN" } }],
        category: [{ $: { "android:name": "android.intent.category.LAUNCHER" } }],
      });
    }

    manifest.queries[0] = queriesBlock;
    return config;
  });
}

module.exports = withInstalledAppsQueries;
