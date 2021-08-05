interface RecusriveStringObject {
    [key: string]: RecusriveStringObject|string;
}

import EnglishTranslations from './translations/en.js';
import HebrewTranslations from './translations/he.js';
import RussianTranslations from './translations/ru.js';

export type Languages = "en"|"he"|"ru";

const translations: {
    [key in Languages]: RecusriveStringObject;
} = {
    "en": EnglishTranslations,
    "he": HebrewTranslations,
    "ru": RussianTranslations
};

class Translations {
    private _locale: string;
    private defaultLocale: string = "en";
    private separatorChar: string = ".";

    constructor() {
        this._locale = this.getLocaleOrDefault(I18n.locale);
    }

    get locale() {
        return this._locale;
    }

    private get translations(): { [key in Languages]: RecusriveStringObject } {
        return translations;
    }

    private localeExists(locale: string): boolean {
        return !!translations[locale];
    }

    private getLocaleOrDefault(locale: string): string {
        return this.localeExists(locale) ? locale : this.defaultLocale;
    }

    private translateByLocale(locale: string, keys: string[], ...args: string[][]): string {
        // get the translations for the current locale, and using recursion dive into the nested keys
        let localeTranslations: string[]|string = this.translations[locale];
        for (let i = 0; i < keys.length; i++) {
            localeTranslations = localeTranslations[keys[i]];
            // if the translation doesn't exist, return the key as the translation
            if (!localeTranslations) {
                return null;
            }
        }

        if (typeof localeTranslations !== "string" || localeTranslations.length === 0) return null;

        // replace the placeholders in the translation with the arguments
        // arg is of type [ key, value ]
        for (let [ argKey, argValue ] of args) {
            localeTranslations = localeTranslations.replace(`%{${argKey}}`, argValue);
        }

        return localeTranslations;
    }

    translate(key: string, ...args: string[][]): string {
        // separate the key by the separator char
        const keys = key.split(this.separatorChar);

        return this.translateByLocale(this.locale, keys, ...args) || this.translateByLocale(this.defaultLocale, keys, ...args) || keys[keys.length - 1];
    }
}

export default Translations;