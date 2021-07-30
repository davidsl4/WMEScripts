import Translations from "./translations.js";

(async () => {
    console.log("[Roundabout JB] Loading script");

    while(!window.hasOwnProperty("require"))
    {
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    const locale = I18n.locale in Translations ? I18n.locale : "en";
    const localeTranslations = Translations[locale];

    console.log("[Roundabout JB] Script loaded | Locale: %s", locale);

    (await import("./roundaboutJBGeometry.m.js")).default(localeTranslations);
    (await import("./normalizeRoundaboutInstructions.m.js")).default(localeTranslations);
})();