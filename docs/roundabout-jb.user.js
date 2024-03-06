// ==UserScript==
// @name        WME Roundabout Junction Box
// @version     1.3.1709753938501
// @author      r0den
// @description Provide some useful tools for maintaining Junction Boxes
// @match       https://*.waze.com/*editor*
// @match       https://waze.com/*editor*
// @downloadURL https://davidsl4.github.io/WMEScripts/roundabout-jb.user.js
// @grant       GM_xmlhttpRequest
// @connect     davidsl4.github.io
// @connect     distributions.crowdin.net
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 8703:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const axiosClient_1 = __webpack_require__(7632);
const exportPattern_1 = __webpack_require__(5634);
const strings_1 = __webpack_require__(7406);
class OtaClient {
    /**
     * @param distributionHash hash of released Crowdin project distribution
     * @param config client config
     */
    constructor(distributionHash, config) {
        this.distributionHash = distributionHash;
        this.disableManifestCache = false;
        this.stringsCache = {};
        this.disableStringsCache = false;
        this.disableJsonDeepMerge = false;
        this.httpClient = (config === null || config === void 0 ? void 0 : config.httpClient) || new axiosClient_1.AxiosHttpClient();
        this.disableManifestCache = !!(config === null || config === void 0 ? void 0 : config.disableManifestCache);
        this.locale = config === null || config === void 0 ? void 0 : config.languageCode;
        this.disableStringsCache = !!(config === null || config === void 0 ? void 0 : config.disableStringsCache);
        this.disableJsonDeepMerge = !!(config === null || config === void 0 ? void 0 : config.disableJsonDeepMerge);
    }
    /**
     * Distribution hash
     */
    getHash() {
        return this.distributionHash;
    }
    /**
     * Default language code to be used if language was not passed as an input argument of the method
     *
     * @param languageCode laguage code
     */
    setCurrentLocale(languageCode) {
        this.locale = languageCode;
    }
    /**
     * Get language code
     */
    getCurrentLocale() {
        return this.locale;
    }
    /**
     * Get manifest timestamp of distribution
     */
    getManifestTimestamp() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.manifest).timestamp;
        });
    }
    /**
     * List of files in distribution
     */
    listFiles() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.manifest).files;
        });
    }
    /**
     * List of project language codes
     */
    listLanguages() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.manifest).languages;
        });
    }
    /**
     * Language mappings
     */
    getLanguageMappings() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.manifest).language_mapping;
        });
    }
    /**
     * Custom languages
     */
    getCustomLanguages() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.manifest).custom_languages;
        });
    }
    /**
     * Returns all translations per each language code
     */
    getTranslations() {
        return __awaiter(this, void 0, void 0, function* () {
            const languages = yield this.listLanguages();
            const translations = {};
            yield Promise.all(languages.map((language) => __awaiter(this, void 0, void 0, function* () {
                translations[language] = yield this.getLanguageTranslations(language);
            })));
            return translations;
        });
    }
    /**
     * Returns translations per each file in disribution for specific language
     *
     * @param languageCode language code
     */
    getLanguageTranslations(languageCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const language = this.getLanguageCode(languageCode);
            const files = yield this.listFiles();
            return Promise.all(files.map((file) => __awaiter(this, void 0, void 0, function* () {
                const content = yield this.getFileTranslations(file, language);
                return { content, file };
            })));
        });
    }
    /**
     * Returns file translations
     *
     * @param file file from distribution
     * @param languageCode language code
     */
    getFileTranslations(file, languageCode) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = `${OtaClient.BASE_URL}/${this.distributionHash}/content`;
            const language = this.getLanguageCode(languageCode);
            const languageMappings = yield this.getLanguageMappings();
            const customLanguages = yield this.getCustomLanguages();
            const languageMapping = (languageMappings || {})[language];
            const customLanguage = (customLanguages || {})[language];
            if ((0, exportPattern_1.includesLanguagePlaceholders)(file)) {
                url += (0, exportPattern_1.replaceLanguagePlaceholders)(file, language, languageMapping, customLanguage);
            }
            else {
                url += `/${language}${file}`;
            }
            return this.httpClient.get(url);
        });
    }
    /**
     * Returns translation strings from json-based files for all languages
     *
     * @param file filter strings by specific file (leave undefined to get from all json files)
     */
    getStrings(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const files = yield this.getJsonFiles(file);
            const languages = yield this.listLanguages();
            const res = {};
            yield Promise.all(languages.map((language) => __awaiter(this, void 0, void 0, function* () {
                res[language] = yield this.getStringsByFilesAndLocale(files, language);
            })));
            return res;
        });
    }
    /**
     * Returns translation strings from json-based files for specific language
     *
     * @param file filter strings by specific file (leave undefined to get from all json files)
     * @param languageCode language code
     */
    getStringsByLocale(file, languageCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const language = this.getLanguageCode(languageCode);
            const files = yield this.getJsonFiles(file);
            return this.getStringsByFilesAndLocale(files, language);
        });
    }
    /**
     * Returns translation string for language for specific key
     *
     * @param key path to the translation string in json file
     * @param file filter strings by specific file (leave undefined to get from all json files)
     * @param languageCode language code
     */
    getStringByKey(key, file, languageCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const strings = yield this.getStringsByLocale(file, languageCode);
            const path = Array.isArray(key) ? key : [key];
            const firstKey = path.shift();
            if (!firstKey) {
                return undefined;
            }
            let res = strings[firstKey];
            for (const keyPart of path) {
                res = res && res[keyPart];
            }
            return res;
        });
    }
    /**
     * Clear cache of translation strings
     */
    clearStringsCache() {
        this.stringsCache = {};
    }
    getStringsByFilesAndLocale(files, language) {
        return __awaiter(this, void 0, void 0, function* () {
            let strings = {};
            for (const filePath of files) {
                let content;
                if (!!this.stringsCache[filePath]) {
                    content = yield this.stringsCache[filePath];
                }
                else {
                    if (!this.disableStringsCache) {
                        this.stringsCache[filePath] = this.getFileTranslations(filePath, language);
                    }
                    content = yield this.stringsCache[filePath];
                }
                if (this.disableJsonDeepMerge) {
                    strings = Object.assign(Object.assign({}, strings), content);
                }
                else {
                    (0, strings_1.mergeDeep)(strings, content);
                }
            }
            return strings;
        });
    }
    get manifest() {
        if (this.manifestHolder && !this.disableManifestCache) {
            return this.manifestHolder;
        }
        else {
            this.manifestHolder = this.httpClient.get(`${OtaClient.BASE_URL}/${this.distributionHash}/manifest.json`);
            return this.manifestHolder;
        }
    }
    getLanguageCode(lang) {
        const languageCode = lang || this.getCurrentLocale();
        if (languageCode) {
            return languageCode;
        }
        else {
            throw new Error('Language code should be either provided through input arguments or by "setCurrentLocale" method');
        }
    }
    getJsonFiles(file) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.listFiles()).filter(f => !file || file === f).filter(strings_1.isJsonFile);
        });
    }
}
exports.default = OtaClient;
OtaClient.BASE_URL = 'https://distributions.crowdin.net';


/***/ }),

/***/ 7632:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AxiosHttpClient = void 0;
const axios_1 = __webpack_require__(9669);
class AxiosHttpClient {
    constructor() {
        this.axios = axios_1.default.create({});
    }
    get(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.axios.get(url)).data;
        });
    }
}
exports.AxiosHttpClient = AxiosHttpClient;


/***/ }),

/***/ 5634:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.replaceLanguagePlaceholders = exports.includesLanguagePlaceholders = void 0;
const languagePlaceholders = {
    '%language%': lang => lang.name,
    '%two_letters_code%': lang => lang.twoLettersCode,
    '%three_letters_code%': lang => lang.threeLettersCode,
    '%locale%': lang => lang.locale,
    '%locale_with_underscore%': lang => lang.localeWithUnderscore || lang.locale.replace(/-/g, '_'),
    '%android_code%': lang => lang.androidCode,
    '%osx_code%': lang => lang.osxCode,
    '%osx_locale%': lang => lang.osxLocale,
};
const languages = [
    {
        name: 'Acholi',
        twoLettersCode: 'ach',
        threeLettersCode: 'ach',
        locale: 'ach-UG',
        androidCode: 'ach-rUG',
        osxCode: 'ach.lproj',
        osxLocale: 'ach',
    },
    {
        name: 'Afar',
        twoLettersCode: 'aa',
        threeLettersCode: 'aar',
        locale: 'aa-ER',
        androidCode: 'aa-rER',
        osxCode: 'aa.lproj',
        osxLocale: 'aa',
    },
    {
        name: 'Afrikaans',
        twoLettersCode: 'af',
        threeLettersCode: 'afr',
        locale: 'af-ZA',
        androidCode: 'af-rZA',
        osxCode: 'af.lproj',
        osxLocale: 'af',
    },
    {
        name: 'Akan',
        twoLettersCode: 'ak',
        threeLettersCode: 'aka',
        locale: 'ak-GH',
        androidCode: 'ak-rGH',
        osxCode: 'ak.lproj',
        osxLocale: 'ak',
    },
    {
        name: 'Akan, Twi',
        twoLettersCode: 'tw',
        threeLettersCode: 'twi',
        locale: 'tw-TW',
        androidCode: 'tw-rTW',
        osxCode: 'tw.lproj',
        osxLocale: 'tw',
    },
    {
        name: 'Albanian',
        twoLettersCode: 'sq',
        threeLettersCode: 'sqi',
        locale: 'sq-AL',
        androidCode: 'sq-rAL',
        osxCode: 'sq.lproj',
        osxLocale: 'sq',
    },
    {
        name: 'Amharic',
        twoLettersCode: 'am',
        threeLettersCode: 'amh',
        locale: 'am-ET',
        androidCode: 'am-rET',
        osxCode: 'am.lproj',
        osxLocale: 'am',
    },
    {
        name: 'Arabic',
        twoLettersCode: 'ar',
        threeLettersCode: 'ara',
        locale: 'ar-SA',
        androidCode: 'ar-rSA',
        osxCode: 'ar.lproj',
        osxLocale: 'ar',
    },
    {
        name: 'Arabic, Bahrain',
        twoLettersCode: 'ar',
        threeLettersCode: 'ara',
        locale: 'ar-BH',
        androidCode: 'ar-rBH',
        osxCode: 'ar-BH.lproj',
        osxLocale: 'ar_BH',
    },
    {
        name: 'Arabic, Egypt',
        twoLettersCode: 'ar',
        threeLettersCode: 'ara',
        locale: 'ar-EG',
        androidCode: 'ar-rEG',
        osxCode: 'ar-EG.lproj',
        osxLocale: 'ar_EG',
    },
    {
        name: 'Arabic, Saudi Arabia',
        twoLettersCode: 'ar',
        threeLettersCode: 'ara',
        locale: 'ar-SA',
        androidCode: 'ar-rSA',
        osxCode: 'ar-SA.lproj',
        osxLocale: 'ar_SA',
    },
    {
        name: 'Arabic, Yemen',
        twoLettersCode: 'ar',
        threeLettersCode: 'ara',
        locale: 'ar-YE',
        androidCode: 'ar-rYE',
        osxCode: 'ar-YE.lproj',
        osxLocale: 'ar_YE',
    },
    {
        name: 'Aragonese',
        twoLettersCode: 'an',
        threeLettersCode: 'arg',
        locale: 'an-ES',
        androidCode: 'an-rES',
        osxCode: 'an.lproj',
        osxLocale: 'an',
    },
    {
        name: 'Armenian',
        twoLettersCode: 'hy',
        threeLettersCode: 'hye',
        locale: 'hy-AM',
        androidCode: 'hy-rAM',
        osxCode: 'hy.lproj',
        osxLocale: 'hy',
    },
    {
        name: 'Arpitan',
        twoLettersCode: 'frp',
        threeLettersCode: 'frp',
        locale: 'frp-IT',
        androidCode: 'frp-rIT',
        osxCode: 'frp.lproj',
        osxLocale: 'frp',
    },
    {
        name: 'Assamese',
        twoLettersCode: 'as',
        threeLettersCode: 'asm',
        locale: 'as-IN',
        androidCode: 'as-rIN',
        osxCode: 'as.lproj',
        osxLocale: 'as',
    },
    {
        name: 'Asturian',
        twoLettersCode: 'ast',
        threeLettersCode: 'ast',
        locale: 'ast-ES',
        androidCode: 'ast-rES',
        osxCode: 'ast.lproj',
        osxLocale: 'ast',
    },
    {
        name: 'Atayal',
        twoLettersCode: 'tay',
        threeLettersCode: 'tay',
        locale: 'tay-TW',
        androidCode: 'tay-rTW',
        osxCode: 'tay.lproj',
        osxLocale: 'tay',
    },
    {
        name: 'Avaric',
        twoLettersCode: 'av',
        threeLettersCode: 'ava',
        locale: 'av-DA',
        androidCode: 'av-rDA',
        osxCode: 'av.lproj',
        osxLocale: 'av',
    },
    {
        name: 'Avestan',
        twoLettersCode: 'ae',
        threeLettersCode: 'ave',
        locale: 'ae-IR',
        androidCode: 'ae-rIR',
        osxCode: 'ae.lproj',
        osxLocale: 'ae',
    },
    {
        name: 'Aymara',
        twoLettersCode: 'ay',
        threeLettersCode: 'aym',
        locale: 'ay-BO',
        androidCode: 'ay-rBO',
        osxCode: 'ay.lproj',
        osxLocale: 'ay',
    },
    {
        name: 'Azerbaijani',
        twoLettersCode: 'az',
        threeLettersCode: 'aze',
        locale: 'az-AZ',
        androidCode: 'az-rAZ',
        osxCode: 'az.lproj',
        osxLocale: 'az',
    },
    {
        name: 'Balinese',
        twoLettersCode: 'ban',
        threeLettersCode: 'ban',
        locale: 'ban-ID',
        androidCode: 'ban-rID',
        osxCode: 'ban.lproj',
        osxLocale: 'ban',
    },
    {
        name: 'Balochi',
        twoLettersCode: 'bal',
        threeLettersCode: 'bal',
        locale: 'bal-BA',
        androidCode: 'bal-rBA',
        osxCode: 'bal.lproj',
        osxLocale: 'bal',
    },
    {
        name: 'Bambara',
        twoLettersCode: 'bm',
        threeLettersCode: 'bam',
        locale: 'bm-ML',
        androidCode: 'bm-rML',
        osxCode: 'bm.lproj',
        osxLocale: 'bm',
    },
    {
        name: 'Bashkir',
        twoLettersCode: 'ba',
        threeLettersCode: 'bak',
        locale: 'ba-RU',
        androidCode: 'ba-rRU',
        osxCode: 'ba.lproj',
        osxLocale: 'ba',
    },
    {
        name: 'Basque',
        twoLettersCode: 'eu',
        threeLettersCode: 'eus',
        locale: 'eu-ES',
        androidCode: 'eu-rES',
        osxCode: 'eu.lproj',
        osxLocale: 'eu',
    },
    {
        name: 'Belarusian',
        twoLettersCode: 'be',
        threeLettersCode: 'bel',
        locale: 'be-BY',
        androidCode: 'be-rBY',
        osxCode: 'be.lproj',
        osxLocale: 'be',
    },
    {
        name: 'Bengali',
        twoLettersCode: 'bn',
        threeLettersCode: 'ben',
        locale: 'bn-BD',
        androidCode: 'bn-rBD',
        osxCode: 'bn.lproj',
        osxLocale: 'bn',
    },
    {
        name: 'Bengali, India',
        twoLettersCode: 'bn',
        threeLettersCode: 'ben',
        locale: 'bn-IN',
        androidCode: 'bn-rIN',
        osxCode: 'bn-IN.lproj',
        osxLocale: 'bn_IN',
    },
    {
        name: 'Berber',
        twoLettersCode: 'ber',
        threeLettersCode: 'ber',
        locale: 'ber-DZ',
        androidCode: 'ber-rDZ',
        osxCode: 'ber.lproj',
        osxLocale: 'ber',
    },
    {
        name: 'Bihari',
        twoLettersCode: 'bh',
        threeLettersCode: 'bih',
        locale: 'bh-IN',
        androidCode: 'bh-rIN',
        osxCode: 'bh.lproj',
        osxLocale: 'bh',
    },
    {
        name: 'Birifor',
        twoLettersCode: 'bfo',
        threeLettersCode: 'bfo',
        locale: 'bfo-BF',
        androidCode: 'bfo-rBF',
        osxCode: 'bfo.lproj',
        osxLocale: 'bfo',
    },
    {
        name: 'Bislama',
        twoLettersCode: 'bi',
        threeLettersCode: 'bis',
        locale: 'bi-VU',
        androidCode: 'bi-rVU',
        osxCode: 'bi.lproj',
        osxLocale: 'bi',
    },
    {
        name: 'Bosnian',
        twoLettersCode: 'bs',
        threeLettersCode: 'bos',
        locale: 'bs-BA',
        androidCode: 'bs-rBA',
        osxCode: 'bs.lproj',
        osxLocale: 'bs',
    },
    {
        name: 'Breton',
        twoLettersCode: 'br',
        threeLettersCode: 'bre',
        locale: 'br-FR',
        androidCode: 'br-rFR',
        osxCode: 'br.lproj',
        osxLocale: 'br',
    },
    {
        name: 'Bulgarian',
        twoLettersCode: 'bg',
        threeLettersCode: 'bul',
        locale: 'bg-BG',
        androidCode: 'bg-rBG',
        osxCode: 'bg.lproj',
        osxLocale: 'bg',
    },
    {
        name: 'Burmese',
        twoLettersCode: 'my',
        threeLettersCode: 'mya',
        locale: 'my-MM',
        androidCode: 'my-rMM',
        osxCode: 'my.lproj',
        osxLocale: 'my',
    },
    {
        name: 'Catalan',
        twoLettersCode: 'ca',
        threeLettersCode: 'cat',
        locale: 'ca-ES',
        androidCode: 'ca-rES',
        osxCode: 'ca.lproj',
        osxLocale: 'ca',
    },
    {
        name: 'Cebuano',
        twoLettersCode: 'ceb',
        threeLettersCode: 'ceb',
        locale: 'ceb-PH',
        androidCode: 'ceb-rPH',
        osxCode: 'ceb.lproj',
        osxLocale: 'ceb',
    },
    {
        name: 'Chamorro',
        twoLettersCode: 'ch',
        threeLettersCode: 'cha',
        locale: 'ch-GU',
        androidCode: 'ch-rGU',
        osxCode: 'ch.lproj',
        osxLocale: 'ch',
    },
    {
        name: 'Chechen',
        twoLettersCode: 'ce',
        threeLettersCode: 'che',
        locale: 'ce-CE',
        androidCode: 'ce-rCE',
        osxCode: 'ce.lproj',
        osxLocale: 'ce',
    },
    {
        name: 'Cherokee',
        twoLettersCode: 'chr',
        threeLettersCode: 'chr',
        locale: 'chr-US',
        androidCode: 'chr-rUS',
        osxCode: 'chr.lproj',
        osxLocale: 'chr',
    },
    {
        name: 'Chewa',
        twoLettersCode: 'ny',
        threeLettersCode: 'nya',
        locale: 'ny-MW',
        androidCode: 'ny-rMW',
        osxCode: 'ny.lproj',
        osxLocale: 'ny',
    },
    {
        name: 'Chinese Simplified',
        twoLettersCode: 'zh',
        threeLettersCode: 'zho',
        locale: 'zh-CN',
        androidCode: 'zh-rCN',
        osxCode: 'zh-Hans.lproj',
        osxLocale: 'zh-Hans',
    },
    {
        name: 'Chinese Traditional',
        twoLettersCode: 'zh',
        threeLettersCode: 'zho',
        locale: 'zh-TW',
        androidCode: 'zh-rTW',
        osxCode: 'zh-Hant.lproj',
        osxLocale: 'zh-Hant',
    },
    {
        name: 'Chinese Traditional, Hong Kong',
        twoLettersCode: 'zh',
        threeLettersCode: 'zho',
        locale: 'zh-HK',
        androidCode: 'zh-rHK',
        osxCode: 'zh-HK.lproj',
        osxLocale: 'zh_HK',
    },
    {
        name: 'Chinese Traditional, Macau',
        twoLettersCode: 'zh',
        threeLettersCode: 'zho',
        locale: 'zh-MO',
        androidCode: 'zh-rMO',
        osxCode: 'zh-MO.lproj',
        osxLocale: 'zh_MO',
    },
    {
        name: 'Chinese Traditional, Singapore',
        twoLettersCode: 'zh',
        threeLettersCode: 'zho',
        locale: 'zh-SG',
        androidCode: 'zh-rSG',
        osxCode: 'zh-SG.lproj',
        osxLocale: 'zh_SG',
    },
    {
        name: 'Chuvash',
        twoLettersCode: 'cv',
        threeLettersCode: 'chv',
        locale: 'cv-CU',
        androidCode: 'cv-rCU',
        osxCode: 'cv.lproj',
        osxLocale: 'cv',
    },
    {
        name: 'Cornish',
        twoLettersCode: 'kw',
        threeLettersCode: 'cor',
        locale: 'kw-GB',
        androidCode: 'kw-rGB',
        osxCode: 'kw.lproj',
        osxLocale: 'kw',
    },
    {
        name: 'Corsican',
        twoLettersCode: 'co',
        threeLettersCode: 'cos',
        locale: 'co-FR',
        androidCode: 'co-rFR',
        osxCode: 'co.lproj',
        osxLocale: 'co',
    },
    {
        name: 'Cree',
        twoLettersCode: 'cr',
        threeLettersCode: 'cre',
        locale: 'cr-NT',
        androidCode: 'cr-rNT',
        osxCode: 'cr.lproj',
        osxLocale: 'cr',
    },
    {
        name: 'Croatian',
        twoLettersCode: 'hr',
        threeLettersCode: 'hrv',
        locale: 'hr-HR',
        androidCode: 'hr-rHR',
        osxCode: 'hr.lproj',
        osxLocale: 'hr',
    },
    {
        name: 'Czech',
        twoLettersCode: 'cs',
        threeLettersCode: 'ces',
        locale: 'cs-CZ',
        androidCode: 'cs-rCZ',
        osxCode: 'cs.lproj',
        osxLocale: 'cs',
    },
    {
        name: 'Danish',
        twoLettersCode: 'da',
        threeLettersCode: 'dan',
        locale: 'da-DK',
        androidCode: 'da-rDK',
        osxCode: 'da.lproj',
        osxLocale: 'da',
    },
    {
        name: 'Dari',
        twoLettersCode: 'fa',
        threeLettersCode: 'prs',
        locale: 'fa-AF',
        androidCode: 'fa-rAF',
        osxCode: 'fa-AF.lproj',
        osxLocale: 'fa_AF',
    },
    {
        name: 'Dhivehi',
        twoLettersCode: 'dv',
        threeLettersCode: 'div',
        locale: 'dv-MV',
        androidCode: 'dv-rMV',
        osxCode: 'dv.lproj',
        osxLocale: 'dv',
    },
    {
        name: 'Dutch',
        twoLettersCode: 'nl',
        threeLettersCode: 'nld',
        locale: 'nl-NL',
        androidCode: 'nl-rNL',
        osxCode: 'nl.lproj',
        osxLocale: 'nl',
    },
    {
        name: 'Dutch, Belgium',
        twoLettersCode: 'nl',
        threeLettersCode: 'nld',
        locale: 'nl-BE',
        androidCode: 'nl-rBE',
        osxCode: 'nl-BE.lproj',
        osxLocale: 'nl_BE',
    },
    {
        name: 'Dutch, Suriname',
        twoLettersCode: 'nl',
        threeLettersCode: 'nld',
        locale: 'nl-SR',
        androidCode: 'nl-rSR',
        osxCode: 'nl-SR.lproj',
        osxLocale: 'nl_SR',
    },
    {
        name: 'Dzongkha',
        twoLettersCode: 'dz',
        threeLettersCode: 'dzo',
        locale: 'dz-BT',
        androidCode: 'dz-rBT',
        osxCode: 'dz.lproj',
        osxLocale: 'dz',
    },
    {
        name: 'English',
        twoLettersCode: 'en',
        threeLettersCode: 'eng',
        locale: 'en-US',
        androidCode: 'en-rUS',
        osxCode: 'en.lproj',
        osxLocale: 'en',
    },
    {
        name: 'English, Arabia',
        twoLettersCode: 'en',
        threeLettersCode: 'eng',
        locale: 'en-AR',
        androidCode: 'en-rAR',
        osxCode: 'en-AR.lproj',
        osxLocale: 'en_AR',
    },
    {
        name: 'English, Australia',
        twoLettersCode: 'en',
        threeLettersCode: 'eng',
        locale: 'en-AU',
        androidCode: 'en-rAU',
        osxCode: 'en-AU.lproj',
        osxLocale: 'en_AU',
    },
    {
        name: 'English, Belize',
        twoLettersCode: 'en',
        threeLettersCode: 'eng',
        locale: 'en-BZ',
        androidCode: 'en-rBZ',
        osxCode: 'en-BZ.lproj',
        osxLocale: 'en_BZ',
    },
    {
        name: 'English, Canada',
        twoLettersCode: 'en',
        threeLettersCode: 'eng',
        locale: 'en-CA',
        androidCode: 'en-rCA',
        osxCode: 'en-CA.lproj',
        osxLocale: 'en_CA',
    },
    {
        name: 'English, Caribbean',
        twoLettersCode: 'en',
        threeLettersCode: 'eng',
        locale: 'en-CB',
        androidCode: 'en-rCB',
        osxCode: 'en-CB.lproj',
        osxLocale: 'en_CB',
    },
    {
        name: 'English, China',
        twoLettersCode: 'en',
        threeLettersCode: 'eng',
        locale: 'en-CN',
        androidCode: 'en-rCN',
        osxCode: 'en-CN.lproj',
        osxLocale: 'en_CN',
    },
    {
        name: 'English, Denmark',
        twoLettersCode: 'en',
        threeLettersCode: 'eng',
        locale: 'en-DK',
        androidCode: 'en-rDK',
        osxCode: 'en-DK.lproj',
        osxLocale: 'en_DK',
    },
    {
        name: 'English, Hong Kong',
        twoLettersCode: 'en',
        threeLettersCode: 'eng',
        locale: 'en-HK',
        androidCode: 'en-rHK',
        osxCode: 'en-HK.lproj',
        osxLocale: 'en_HK',
    },
    {
        name: 'English, India',
        twoLettersCode: 'en',
        threeLettersCode: 'eng',
        locale: 'en-IN',
        androidCode: 'en-rIN',
        osxCode: 'en-IN.lproj',
        osxLocale: 'en_IN',
    },
    {
        name: 'English, Indonesia',
        twoLettersCode: 'en',
        threeLettersCode: 'eng',
        locale: 'en-ID',
        androidCode: 'en-rID',
        osxCode: 'en-ID.lproj',
        osxLocale: 'en_ID',
    },
    {
        name: 'English, Ireland',
        twoLettersCode: 'en',
        threeLettersCode: 'eng',
        locale: 'en-IE',
        androidCode: 'en-rIE',
        osxCode: 'en-IE.lproj',
        osxLocale: 'en_IE',
    },
    {
        name: 'English, Jamaica',
        twoLettersCode: 'en',
        threeLettersCode: 'eng',
        locale: 'en-JM',
        androidCode: 'en-rJM',
        osxCode: 'en-JM.lproj',
        osxLocale: 'en_JM',
    },
    {
        name: 'English, Japan',
        twoLettersCode: 'en',
        threeLettersCode: 'eng',
        locale: 'en-JA',
        androidCode: 'en-rJA',
        osxCode: 'en-JA.lproj',
        osxLocale: 'en_JA',
    },
    {
        name: 'English, Malaysia',
        twoLettersCode: 'en',
        threeLettersCode: 'eng',
        locale: 'en-MY',
        androidCode: 'en-rMY',
        osxCode: 'en-MY.lproj',
        osxLocale: 'en_MY',
    },
    {
        name: 'English, New Zealand',
        twoLettersCode: 'en',
        threeLettersCode: 'eng',
        locale: 'en-NZ',
        androidCode: 'en-rNZ',
        osxCode: 'en-NZ.lproj',
        osxLocale: 'en_NZ',
    },
    {
        name: 'English, Norway',
        twoLettersCode: 'en',
        threeLettersCode: 'eng',
        locale: 'en-NO',
        androidCode: 'en-rNO',
        osxCode: 'en-NO.lproj',
        osxLocale: 'en_NO',
    },
    {
        name: 'English, Philippines',
        twoLettersCode: 'en',
        threeLettersCode: 'eng',
        locale: 'en-PH',
        androidCode: 'en-rPH',
        osxCode: 'en-PH.lproj',
        osxLocale: 'en_PH',
    },
    {
        name: 'English, Puerto Rico',
        twoLettersCode: 'en',
        threeLettersCode: 'eng',
        locale: 'en-PR',
        androidCode: 'en-rPR',
        osxCode: 'en-PR.lproj',
        osxLocale: 'en_PR',
    },
    {
        name: 'English, Singapore',
        twoLettersCode: 'en',
        threeLettersCode: 'eng',
        locale: 'en-SG',
        androidCode: 'en-rSG',
        osxCode: 'en-SG.lproj',
        osxLocale: 'en_SG',
    },
    {
        name: 'English, South Africa',
        twoLettersCode: 'en',
        threeLettersCode: 'eng',
        locale: 'en-ZA',
        androidCode: 'en-rZA',
        osxCode: 'en-ZA.lproj',
        osxLocale: 'en_ZA',
    },
    {
        name: 'English, Sweden',
        twoLettersCode: 'en',
        threeLettersCode: 'eng',
        locale: 'en-SE',
        androidCode: 'en-rSE',
        osxCode: 'en-SE.lproj',
        osxLocale: 'en_SE',
    },
    {
        name: 'English, United Kingdom',
        twoLettersCode: 'en',
        threeLettersCode: 'eng',
        locale: 'en-GB',
        androidCode: 'en-rGB',
        osxCode: 'en-GB.lproj',
        osxLocale: 'en_GB',
    },
    {
        name: 'English, United States',
        twoLettersCode: 'en',
        threeLettersCode: 'eng',
        locale: 'en-US',
        androidCode: 'en-rUS',
        osxCode: 'en-US.lproj',
        osxLocale: 'en_US',
    },
    {
        name: 'English, Zimbabwe',
        twoLettersCode: 'en',
        threeLettersCode: 'eng',
        locale: 'en-ZW',
        androidCode: 'en-rZW',
        osxCode: 'en-ZW.lproj',
        osxLocale: 'en_ZW',
    },
    {
        name: 'Esperanto',
        twoLettersCode: 'eo',
        threeLettersCode: 'epo',
        locale: 'eo-UY',
        androidCode: 'eo-rUY',
        osxCode: 'eo.lproj',
        osxLocale: 'eo',
    },
    {
        name: 'Estonian',
        twoLettersCode: 'et',
        threeLettersCode: 'est',
        locale: 'et-EE',
        androidCode: 'et-rEE',
        osxCode: 'et.lproj',
        osxLocale: 'et',
    },
    {
        name: 'Ewe',
        twoLettersCode: 'ee',
        threeLettersCode: 'ewe',
        locale: 'ee-GH',
        androidCode: 'ee-rGH',
        osxCode: 'ee.lproj',
        osxLocale: 'ee',
    },
    {
        name: 'Faroese',
        twoLettersCode: 'fo',
        threeLettersCode: 'fao',
        locale: 'fo-FO',
        androidCode: 'fo-rFO',
        osxCode: 'fo.lproj',
        osxLocale: 'fo',
    },
    {
        name: 'Fijian',
        twoLettersCode: 'fj',
        threeLettersCode: 'fij',
        locale: 'fj-FJ',
        androidCode: 'fj-rFJ',
        osxCode: 'fj.lproj',
        osxLocale: 'fj',
    },
    {
        name: 'Filipino',
        twoLettersCode: 'fil',
        threeLettersCode: 'fil',
        locale: 'fil-PH',
        androidCode: 'fil-rPH',
        osxCode: 'fil.lproj',
        osxLocale: 'fil',
    },
    {
        name: 'Finnish',
        twoLettersCode: 'fi',
        threeLettersCode: 'fin',
        locale: 'fi-FI',
        androidCode: 'fi-rFI',
        osxCode: 'fi.lproj',
        osxLocale: 'fi',
    },
    {
        name: 'Flemish',
        twoLettersCode: 'vls',
        threeLettersCode: 'vls',
        locale: 'vls-BE',
        androidCode: 'vls-rBE',
        osxCode: 'vls.lproj',
        osxLocale: 'vls',
    },
    {
        name: 'Franconian',
        twoLettersCode: 'fra',
        threeLettersCode: 'gem',
        locale: 'fra-DE',
        androidCode: 'fra-rDE',
        osxCode: 'fra.lproj',
        osxLocale: 'fra',
    },
    {
        name: 'French',
        twoLettersCode: 'fr',
        threeLettersCode: 'fra',
        locale: 'fr-FR',
        androidCode: 'fr-rFR',
        osxCode: 'fr.lproj',
        osxLocale: 'fr',
    },
    {
        name: 'French, Belgium',
        twoLettersCode: 'fr',
        threeLettersCode: 'fra',
        locale: 'fr-BE',
        androidCode: 'fr-rBE',
        osxCode: 'fr-BE.lproj',
        osxLocale: 'fr_BE',
    },
    {
        name: 'French, Canada',
        twoLettersCode: 'fr',
        threeLettersCode: 'fra',
        locale: 'fr-CA',
        androidCode: 'fr-rCA',
        osxCode: 'fr-CA.lproj',
        osxLocale: 'fr_CA',
    },
    {
        name: 'French, Luxembourg',
        twoLettersCode: 'fr',
        threeLettersCode: 'fra',
        locale: 'fr-LU',
        androidCode: 'fr-rLU',
        osxCode: 'fr-LU.lproj',
        osxLocale: 'fr_LU',
    },
    {
        name: 'French, Quebec',
        twoLettersCode: 'fr',
        threeLettersCode: 'fra',
        locale: 'fr-QC',
        androidCode: 'fr-rQC',
        osxCode: 'fr-QC.lproj',
        osxLocale: 'fr_QC',
    },
    {
        name: 'French, Switzerland',
        twoLettersCode: 'fr',
        threeLettersCode: 'fra',
        locale: 'fr-CH',
        androidCode: 'fr-rCH',
        osxCode: 'fr-CH.lproj',
        osxLocale: 'fr_CH',
    },
    {
        name: 'Frisian',
        twoLettersCode: 'fy',
        threeLettersCode: 'fry',
        locale: 'fy-NL',
        androidCode: 'fy-rNL',
        osxCode: 'fy.lproj',
        osxLocale: 'fy',
    },
    {
        name: 'Friulian',
        twoLettersCode: 'fur',
        threeLettersCode: 'fur',
        locale: 'fur-IT',
        androidCode: 'fur-rIT',
        osxCode: 'fur.lproj',
        osxLocale: 'fur',
    },
    {
        name: 'Fula',
        twoLettersCode: 'ff',
        threeLettersCode: 'ful',
        locale: 'ff-ZA',
        androidCode: 'ff-rZA',
        osxCode: 'ff.lproj',
        osxLocale: 'ff',
    },
    {
        name: 'Ga',
        twoLettersCode: 'gaa',
        threeLettersCode: 'gaa',
        locale: 'gaa-GH',
        androidCode: 'gaa-rGH',
        osxCode: 'gaa.lproj',
        osxLocale: 'gaa',
    },
    {
        name: 'Galician',
        twoLettersCode: 'gl',
        threeLettersCode: 'glg',
        locale: 'gl-ES',
        androidCode: 'gl-rES',
        osxCode: 'gl.lproj',
        osxLocale: 'gl',
    },
    {
        name: 'Georgian',
        twoLettersCode: 'ka',
        threeLettersCode: 'kat',
        locale: 'ka-GE',
        androidCode: 'ka-rGE',
        osxCode: 'ka.lproj',
        osxLocale: 'ka',
    },
    {
        name: 'German',
        twoLettersCode: 'de',
        threeLettersCode: 'deu',
        locale: 'de-DE',
        androidCode: 'de-rDE',
        osxCode: 'de.lproj',
        osxLocale: 'de',
    },
    {
        name: 'German, Austria',
        twoLettersCode: 'de',
        threeLettersCode: 'deu',
        locale: 'de-AT',
        androidCode: 'de-rAT',
        osxCode: 'de-AT.lproj',
        osxLocale: 'de_AT',
    },
    {
        name: 'German, Belgium',
        twoLettersCode: 'de',
        threeLettersCode: 'deu',
        locale: 'de-BE',
        androidCode: 'de-rBE',
        osxCode: 'de-BE.lproj',
        osxLocale: 'de_BE',
    },
    {
        name: 'German, Liechtenstein',
        twoLettersCode: 'de',
        threeLettersCode: 'deu',
        locale: 'de-LI',
        androidCode: 'de-rLI',
        osxCode: 'de-LI.lproj',
        osxLocale: 'de_LI',
    },
    {
        name: 'German, Luxembourg',
        twoLettersCode: 'de',
        threeLettersCode: 'deu',
        locale: 'de-LU',
        androidCode: 'de-rLU',
        osxCode: 'de-LU.lproj',
        osxLocale: 'de_LU',
    },
    {
        name: 'German, Switzerland',
        twoLettersCode: 'de',
        threeLettersCode: 'deu',
        locale: 'de-CH',
        androidCode: 'de-rCH',
        osxCode: 'de-CH.lproj',
        osxLocale: 'de_CH',
    },
    {
        name: 'Greek',
        twoLettersCode: 'el',
        threeLettersCode: 'ell',
        locale: 'el-GR',
        androidCode: 'el-rGR',
        osxCode: 'el.lproj',
        osxLocale: 'el',
    },
    {
        name: 'Greek, Cyprus',
        twoLettersCode: 'el',
        threeLettersCode: 'ell',
        locale: 'el-CY',
        androidCode: 'el-rCY',
        osxCode: 'el-CY.lproj',
        osxLocale: 'el_CY',
    },
    {
        name: 'Greenlandic',
        twoLettersCode: 'kl',
        threeLettersCode: 'kal',
        locale: 'kl-GL',
        androidCode: 'kl-rGL',
        osxCode: 'kl.lproj',
        osxLocale: 'kl',
    },
    {
        name: 'Guarani',
        twoLettersCode: 'gn',
        threeLettersCode: 'grn',
        locale: 'gn-PY',
        androidCode: 'gn-rPY',
        osxCode: 'gn.lproj',
        osxLocale: 'gn',
    },
    {
        name: 'Gujarati',
        twoLettersCode: 'gu',
        threeLettersCode: 'guj',
        locale: 'gu-IN',
        androidCode: 'gu-rIN',
        osxCode: 'gu.lproj',
        osxLocale: 'gu',
    },
    {
        name: 'Haitian Creole',
        twoLettersCode: 'ht',
        threeLettersCode: 'hat',
        locale: 'ht-HT',
        androidCode: 'ht-rHT',
        osxCode: 'ht.lproj',
        osxLocale: 'ht',
    },
    {
        name: 'Hausa',
        twoLettersCode: 'ha',
        threeLettersCode: 'hau',
        locale: 'ha-HG',
        androidCode: 'ha-rHG',
        osxCode: 'ha.lproj',
        osxLocale: 'ha',
    },
    {
        name: 'Hawaiian',
        twoLettersCode: 'haw',
        threeLettersCode: 'haw',
        locale: 'haw-US',
        androidCode: 'haw-rUS',
        osxCode: 'haw.lproj',
        osxLocale: 'haw',
    },
    {
        name: 'Hebrew',
        twoLettersCode: 'he',
        threeLettersCode: 'heb',
        locale: 'he-IL',
        androidCode: 'iw-rIL',
        osxCode: 'he.lproj',
        osxLocale: 'he',
    },
    {
        name: 'Herero',
        twoLettersCode: 'hz',
        threeLettersCode: 'her',
        locale: 'hz-NA',
        androidCode: 'hz-rNA',
        osxCode: 'hz.lproj',
        osxLocale: 'hz',
    },
    {
        name: 'Hiligaynon',
        twoLettersCode: 'hil',
        threeLettersCode: 'hil',
        locale: 'hil-PH',
        androidCode: 'hil-rPH',
        osxCode: 'hil.lproj',
        osxLocale: 'hil',
    },
    {
        name: 'Hindi',
        twoLettersCode: 'hi',
        threeLettersCode: 'hin',
        locale: 'hi-IN',
        androidCode: 'hi-rIN',
        osxCode: 'hi.lproj',
        osxLocale: 'hi',
    },
    {
        name: 'Hiri Motu',
        twoLettersCode: 'ho',
        threeLettersCode: 'hmo',
        locale: 'ho-PG',
        androidCode: 'ho-rPG',
        osxCode: 'ho.lproj',
        osxLocale: 'ho',
    },
    {
        name: 'Hmong',
        twoLettersCode: 'hmn',
        threeLettersCode: 'hmn',
        locale: 'hmn-CN',
        androidCode: 'hmn-rCN',
        osxCode: 'hmn.lproj',
        osxLocale: 'hmn',
    },
    {
        name: 'Hungarian',
        twoLettersCode: 'hu',
        threeLettersCode: 'hun',
        locale: 'hu-HU',
        androidCode: 'hu-rHU',
        osxCode: 'hu.lproj',
        osxLocale: 'hu',
    },
    {
        name: 'Icelandic',
        twoLettersCode: 'is',
        threeLettersCode: 'isl',
        locale: 'is-IS',
        androidCode: 'is-rIS',
        osxCode: 'is.lproj',
        osxLocale: 'is',
    },
    {
        name: 'Ido',
        twoLettersCode: 'io',
        threeLettersCode: 'ido',
        locale: 'io-EN',
        androidCode: 'io-rEN',
        osxCode: 'ido.lproj',
        osxLocale: 'ido',
    },
    {
        name: 'Igbo',
        twoLettersCode: 'ig',
        threeLettersCode: 'ibo',
        locale: 'ig-NG',
        androidCode: 'ig-rNG',
        osxCode: 'ig.lproj',
        osxLocale: 'ig',
    },
    {
        name: 'Ilokano',
        twoLettersCode: 'ilo',
        threeLettersCode: 'ilo',
        locale: 'ilo-PH',
        androidCode: 'ilo-rPH',
        osxCode: 'ilo.lproj',
        osxLocale: 'ilo',
    },
    {
        name: 'Indonesian',
        twoLettersCode: 'id',
        threeLettersCode: 'ind',
        locale: 'id-ID',
        androidCode: 'in-rID',
        osxCode: 'id.lproj',
        osxLocale: 'id',
    },
    {
        name: 'Inuktitut',
        twoLettersCode: 'iu',
        threeLettersCode: 'iku',
        locale: 'iu-NU',
        androidCode: 'iu-rNU',
        osxCode: 'iu.lproj',
        osxLocale: 'iu',
    },
    {
        name: 'Irish',
        twoLettersCode: 'ga',
        threeLettersCode: 'gle',
        locale: 'ga-IE',
        androidCode: 'ga-rIE',
        osxCode: 'ga.lproj',
        osxLocale: 'ga',
    },
    {
        name: 'Italian',
        twoLettersCode: 'it',
        threeLettersCode: 'ita',
        locale: 'it-IT',
        androidCode: 'it-rIT',
        osxCode: 'it.lproj',
        osxLocale: 'it',
    },
    {
        name: 'Italian, Switzerland',
        twoLettersCode: 'it',
        threeLettersCode: 'ita',
        locale: 'it-CH',
        androidCode: 'it-rCH',
        osxCode: 'it-CH.lproj',
        osxLocale: 'it_CH',
    },
    {
        name: 'Japanese',
        twoLettersCode: 'ja',
        threeLettersCode: 'jpn',
        locale: 'ja-JP',
        androidCode: 'ja-rJP',
        osxCode: 'ja.lproj',
        osxLocale: 'ja',
    },
    {
        name: 'Javanese',
        twoLettersCode: 'jv',
        threeLettersCode: 'jav',
        locale: 'jv-ID',
        androidCode: 'jv-rID',
        osxCode: 'jv.lproj',
        osxLocale: 'jv',
    },
    {
        name: "K'iche'",
        twoLettersCode: 'quc',
        threeLettersCode: 'quc',
        locale: 'quc-GT',
        androidCode: 'quc-rGT',
        osxCode: 'quc.lproj',
        osxLocale: 'quc',
    },
    {
        name: 'Kabyle',
        twoLettersCode: 'kab',
        threeLettersCode: 'kab',
        locale: 'kab-KAB',
        androidCode: 'kab-rKAB',
        osxCode: 'kab.lproj',
        osxLocale: 'kab',
    },
    {
        name: 'Kannada',
        twoLettersCode: 'kn',
        threeLettersCode: 'kan',
        locale: 'kn-IN',
        androidCode: 'kn-rIN',
        osxCode: 'kn.lproj',
        osxLocale: 'kn',
    },
    {
        name: 'Kapampangan',
        twoLettersCode: 'pam',
        threeLettersCode: 'pam',
        locale: 'pam-PH',
        androidCode: 'pam-rPH',
        osxCode: 'pam.lproj',
        osxLocale: 'pam',
    },
    {
        name: 'Kashmiri',
        twoLettersCode: 'ks',
        threeLettersCode: 'kas',
        locale: 'ks-IN',
        androidCode: 'ks-rIN',
        osxCode: 'ks.lproj',
        osxLocale: 'ks',
    },
    {
        name: 'Kashmiri, Pakistan',
        twoLettersCode: 'ks',
        threeLettersCode: 'kas',
        locale: 'ks-PK',
        androidCode: 'ks-rPK',
        osxCode: 'ks-PK.lproj',
        osxLocale: 'ks_PK',
    },
    {
        name: 'Kashubian',
        twoLettersCode: 'csb',
        threeLettersCode: 'csb',
        locale: 'csb-PL',
        androidCode: 'csb-rPL',
        osxCode: 'csb.lproj',
        osxLocale: 'csb',
    },
    {
        name: 'Kazakh',
        twoLettersCode: 'kk',
        threeLettersCode: 'kaz',
        locale: 'kk-KZ',
        androidCode: 'kk-rKZ',
        osxCode: 'kk.lproj',
        osxLocale: 'kk',
    },
    {
        name: 'Khmer',
        twoLettersCode: 'km',
        threeLettersCode: 'khm',
        locale: 'km-KH',
        androidCode: 'km-rKH',
        osxCode: 'km.lproj',
        osxLocale: 'km',
    },
    {
        name: 'Kinyarwanda',
        twoLettersCode: 'rw',
        threeLettersCode: 'kin',
        locale: 'rw-RW',
        androidCode: 'rw-rRW',
        osxCode: 'rw.lproj',
        osxLocale: 'rw',
    },
    {
        name: 'Komi',
        twoLettersCode: 'kv',
        threeLettersCode: 'kom',
        locale: 'kv-KO',
        androidCode: 'kv-rKO',
        osxCode: 'kv.lproj',
        osxLocale: 'kv',
    },
    {
        name: 'Kongo',
        twoLettersCode: 'kg',
        threeLettersCode: 'kon',
        locale: 'kg-CG',
        androidCode: 'kg-rCG',
        osxCode: 'kg.lproj',
        osxLocale: 'kg',
    },
    {
        name: 'Konkani',
        twoLettersCode: 'kok',
        threeLettersCode: 'kok',
        locale: 'kok-IN',
        androidCode: 'kok-rIN',
        osxCode: 'kok.lproj',
        osxLocale: 'kok',
    },
    {
        name: 'Korean',
        twoLettersCode: 'ko',
        threeLettersCode: 'kor',
        locale: 'ko-KR',
        androidCode: 'ko-rKR',
        osxCode: 'ko.lproj',
        osxLocale: 'ko',
    },
    {
        name: 'Kurdish',
        twoLettersCode: 'ku',
        threeLettersCode: 'kur',
        locale: 'ku-TR',
        androidCode: 'ku-rTR',
        osxCode: 'ku.lproj',
        osxLocale: 'ku',
    },
    {
        name: 'Kurmanji (Kurdish)',
        twoLettersCode: 'ku',
        threeLettersCode: 'kmr',
        locale: 'kmr-TR',
        androidCode: 'kmr-rTR',
        osxCode: 'kmr.lproj',
        osxLocale: 'kmr',
    },
    {
        name: 'Kwanyama',
        twoLettersCode: 'kj',
        threeLettersCode: 'kua',
        locale: 'kj-AO',
        androidCode: 'kj-rAO',
        osxCode: 'kj.lproj',
        osxLocale: 'kj',
    },
    {
        name: 'Kyrgyz',
        twoLettersCode: 'ky',
        threeLettersCode: 'kir',
        locale: 'ky-KG',
        androidCode: 'ky-rKG',
        osxCode: 'ky.lproj',
        osxLocale: 'ky',
    },
    {
        name: 'Lao',
        twoLettersCode: 'lo',
        threeLettersCode: 'lao',
        locale: 'lo-LA',
        androidCode: 'lo-rLA',
        osxCode: 'lo.lproj',
        osxLocale: 'lo',
    },
    {
        name: 'Latin',
        twoLettersCode: 'la',
        threeLettersCode: 'lat',
        locale: 'la-LA',
        androidCode: 'la-rLA',
        osxCode: 'la.lproj',
        osxLocale: 'la',
    },
    {
        name: 'Latvian',
        twoLettersCode: 'lv',
        threeLettersCode: 'lav',
        locale: 'lv-LV',
        androidCode: 'lv-rLV',
        osxCode: 'lv.lproj',
        osxLocale: 'lv',
    },
    {
        name: 'Ligurian',
        twoLettersCode: 'lij',
        threeLettersCode: 'lij',
        locale: 'lij-IT',
        androidCode: 'lij-rIT',
        osxCode: 'lij.lproj',
        osxLocale: 'lij',
    },
    {
        name: 'Limburgish',
        twoLettersCode: 'li',
        threeLettersCode: 'lim',
        locale: 'li-LI',
        androidCode: 'li-rLI',
        osxCode: 'li.lproj',
        osxLocale: 'li',
    },
    {
        name: 'Lingala',
        twoLettersCode: 'ln',
        threeLettersCode: 'lin',
        locale: 'ln-CD',
        androidCode: 'ln-rCD',
        osxCode: 'ln.lproj',
        osxLocale: 'ln',
    },
    {
        name: 'Lithuanian',
        twoLettersCode: 'lt',
        threeLettersCode: 'lit',
        locale: 'lt-LT',
        androidCode: 'lt-rLT',
        osxCode: 'lt.lproj',
        osxLocale: 'lt',
    },
    {
        name: 'Low German',
        twoLettersCode: 'nds',
        threeLettersCode: 'nds',
        locale: 'nds-DE',
        androidCode: 'nds-rDE',
        osxCode: 'nds.lproj',
        osxLocale: 'nds',
    },
    {
        name: 'Lower Sorbian',
        twoLettersCode: 'dsb',
        threeLettersCode: 'dsb',
        locale: 'dsb-DE',
        androidCode: 'dsb-rDE',
        osxCode: 'dsb.lproj',
        osxLocale: 'dsb',
    },
    {
        name: 'Luganda',
        twoLettersCode: 'lg',
        threeLettersCode: 'lug',
        locale: 'lg-UG',
        androidCode: 'lg-rUG',
        osxCode: 'lg.lproj',
        osxLocale: 'lg',
    },
    {
        name: 'Luhya',
        twoLettersCode: 'luy',
        threeLettersCode: 'luy',
        locale: 'luy-KE',
        androidCode: 'luy-rKE',
        osxCode: 'luy.lproj',
        osxLocale: 'luy',
    },
    {
        name: 'Luxembourgish',
        twoLettersCode: 'lb',
        threeLettersCode: 'ltz',
        locale: 'lb-LU',
        androidCode: 'lb-rLU',
        osxCode: 'lb.lproj',
        osxLocale: 'lb',
    },
    {
        name: 'Macedonian',
        twoLettersCode: 'mk',
        threeLettersCode: 'mkd',
        locale: 'mk-MK',
        androidCode: 'mk-rMK',
        osxCode: 'mk.lproj',
        osxLocale: 'mk',
    },
    {
        name: 'Maithili',
        twoLettersCode: 'mai',
        threeLettersCode: 'mai',
        locale: 'mai-IN',
        androidCode: 'mai-rIN',
        osxCode: 'mai.lproj',
        osxLocale: 'mai',
    },
    {
        name: 'Malagasy',
        twoLettersCode: 'mg',
        threeLettersCode: 'mlg',
        locale: 'mg-MG',
        androidCode: 'mg-rMG',
        osxCode: 'mg.lproj',
        osxLocale: 'mg',
    },
    {
        name: 'Malay',
        twoLettersCode: 'ms',
        threeLettersCode: 'msa',
        locale: 'ms-MY',
        androidCode: 'ms-rMY',
        osxCode: 'ms.lproj',
        osxLocale: 'ms',
    },
    {
        name: 'Malay, Brunei',
        twoLettersCode: 'ms',
        threeLettersCode: 'msa',
        locale: 'ms-BN',
        androidCode: 'ms-rBN',
        osxCode: 'ms-BN.lproj',
        osxLocale: 'ms_BN',
    },
    {
        name: 'Malayalam',
        twoLettersCode: 'ml',
        threeLettersCode: 'mal',
        locale: 'ml-IN',
        androidCode: 'ml-rIN',
        osxCode: 'ml.lproj',
        osxLocale: 'ml',
    },
    {
        name: 'Maltese',
        twoLettersCode: 'mt',
        threeLettersCode: 'mlt',
        locale: 'mt-MT',
        androidCode: 'mt-rMT',
        osxCode: 'mt.lproj',
        osxLocale: 'mt',
    },
    {
        name: 'Maori',
        twoLettersCode: 'mi',
        threeLettersCode: 'mri',
        locale: 'mi-NZ',
        androidCode: 'mi-rNZ',
        osxCode: 'mi.lproj',
        osxLocale: 'mi',
    },
    {
        name: 'Mapudungun',
        twoLettersCode: 'arn',
        threeLettersCode: 'arn',
        locale: 'arn-CL',
        androidCode: 'arn-rCL',
        osxCode: 'arn.lproj',
        osxLocale: 'arn',
    },
    {
        name: 'Marathi',
        twoLettersCode: 'mr',
        threeLettersCode: 'mar',
        locale: 'mr-IN',
        androidCode: 'mr-rIN',
        osxCode: 'mr.lproj',
        osxLocale: 'mr',
    },
    {
        name: 'Marshallese',
        twoLettersCode: 'mh',
        threeLettersCode: 'mah',
        locale: 'mh-MH',
        androidCode: 'mh-rMH',
        osxCode: 'mh.lproj',
        osxLocale: 'mh',
    },
    {
        name: 'Mongolian',
        twoLettersCode: 'mn',
        threeLettersCode: 'mon',
        locale: 'mn-MN',
        androidCode: 'mn-rMN',
        osxCode: 'mn.lproj',
        osxLocale: 'mn',
    },
    {
        name: 'Mossi',
        twoLettersCode: 'mos',
        threeLettersCode: 'mos',
        locale: 'mos-MOS',
        androidCode: 'mos-rMOS',
        osxCode: 'mos.lproj',
        osxLocale: 'mos',
    },
    {
        name: 'Nauru',
        twoLettersCode: 'na',
        threeLettersCode: 'nau',
        locale: 'na-NR',
        androidCode: 'na-rNR',
        osxCode: 'na.lproj',
        osxLocale: 'na',
    },
    {
        name: 'Ndonga',
        twoLettersCode: 'ng',
        threeLettersCode: 'ndo',
        locale: 'ng-NA',
        androidCode: 'ng-rNA',
        osxCode: 'ng.lproj',
        osxLocale: 'ng',
    },
    {
        name: 'Nepali',
        twoLettersCode: 'ne',
        threeLettersCode: 'nep',
        locale: 'ne-NP',
        androidCode: 'ne-rNP',
        osxCode: 'ne.lproj',
        osxLocale: 'ne',
    },
    {
        name: 'Nepali, India',
        twoLettersCode: 'ne',
        threeLettersCode: 'nep',
        locale: 'ne-IN',
        androidCode: 'ne-rIN',
        osxCode: 'ne-IN.lproj',
        osxLocale: 'ne_IN',
    },
    {
        name: 'Nigerian Pidgin',
        twoLettersCode: 'pcm',
        threeLettersCode: 'pcm',
        locale: 'pcm-NG',
        androidCode: 'pcm-rNG',
        osxCode: 'pcm.lproj',
        osxLocale: 'pcm',
    },
    {
        name: 'Northern Sami',
        twoLettersCode: 'se',
        threeLettersCode: 'sme',
        locale: 'se-NO',
        androidCode: 'se-rNO',
        osxCode: 'se.lproj',
        osxLocale: 'se',
    },
    {
        name: 'Northern Sotho',
        twoLettersCode: 'nso',
        threeLettersCode: 'nso',
        locale: 'ns-ZA',
        androidCode: 'ns-rZA',
        osxCode: 'nso.lproj',
        osxLocale: 'nso',
    },
    {
        name: 'Norwegian',
        twoLettersCode: 'no',
        threeLettersCode: 'nor',
        locale: 'no-NO',
        androidCode: 'no-rNO',
        osxCode: 'no.lproj',
        osxLocale: 'no',
    },
    {
        name: 'Norwegian Bokmal',
        twoLettersCode: 'nb',
        threeLettersCode: 'nob',
        locale: 'nb-NO',
        androidCode: 'nb-rNO',
        osxCode: 'nb.lproj',
        osxLocale: 'nb',
    },
    {
        name: 'Norwegian Nynorsk',
        twoLettersCode: 'nn',
        threeLettersCode: 'nno',
        locale: 'nn-NO',
        androidCode: 'nn-rNO',
        osxCode: 'nn-NO.lproj',
        osxLocale: 'nn_NO',
    },
    {
        name: 'Occitan',
        twoLettersCode: 'oc',
        threeLettersCode: 'oci',
        locale: 'oc-FR',
        androidCode: 'oc-rFR',
        osxCode: 'oc.lproj',
        osxLocale: 'oc',
    },
    {
        name: 'Odia',
        twoLettersCode: 'or',
        threeLettersCode: 'ori',
        locale: 'or-IN',
        androidCode: 'or-rIN',
        osxCode: 'or.lproj',
        osxLocale: 'or',
    },
    {
        name: 'Ojibwe',
        twoLettersCode: 'oj',
        threeLettersCode: 'oji',
        locale: 'oj-CA',
        androidCode: 'oj-rCA',
        osxCode: 'oj.lproj',
        osxLocale: 'oj',
    },
    {
        name: 'Oromo',
        twoLettersCode: 'om',
        threeLettersCode: 'orm',
        locale: 'om-ET',
        androidCode: 'om-rET',
        osxCode: 'om.lproj',
        osxLocale: 'om',
    },
    {
        name: 'Ossetian',
        twoLettersCode: 'os',
        threeLettersCode: 'oss',
        locale: 'os-SE',
        androidCode: 'os-rSE',
        osxCode: 'os.lproj',
        osxLocale: 'os',
    },
    {
        name: 'Pali',
        twoLettersCode: 'pi',
        threeLettersCode: 'pli',
        locale: 'pi-IN',
        androidCode: 'pi-rIN',
        osxCode: 'pi.lproj',
        osxLocale: 'pi',
    },
    {
        name: 'Papiamento',
        twoLettersCode: 'pap',
        threeLettersCode: 'pap',
        locale: 'pap-PAP',
        androidCode: 'pap-rPAP',
        osxCode: 'pap.lproj',
        osxLocale: 'pap',
    },
    {
        name: 'Pashto',
        twoLettersCode: 'ps',
        threeLettersCode: 'pus',
        locale: 'ps-AF',
        androidCode: 'ps-rAF',
        osxCode: 'ps.lproj',
        osxLocale: 'ps',
    },
    {
        name: 'Persian',
        twoLettersCode: 'fa',
        threeLettersCode: 'fas',
        locale: 'fa-IR',
        androidCode: 'fa-rIR',
        osxCode: 'fa.lproj',
        osxLocale: 'fa',
    },
    {
        name: 'Polish',
        twoLettersCode: 'pl',
        threeLettersCode: 'pol',
        locale: 'pl-PL',
        androidCode: 'pl-rPL',
        osxCode: 'pl.lproj',
        osxLocale: 'pl',
    },
    {
        name: 'Portuguese',
        twoLettersCode: 'pt',
        threeLettersCode: 'por',
        locale: 'pt-PT',
        androidCode: 'pt-rPT',
        osxCode: 'pt.lproj',
        osxLocale: 'pt',
    },
    {
        name: 'Portuguese, Brazilian',
        twoLettersCode: 'pt',
        threeLettersCode: 'por',
        locale: 'pt-BR',
        androidCode: 'pt-rBR',
        osxCode: 'pt-BR.lproj',
        osxLocale: 'pt_BR',
    },
    {
        name: 'Punjabi',
        twoLettersCode: 'pa',
        threeLettersCode: 'pan',
        locale: 'pa-IN',
        androidCode: 'pa-rIN',
        osxCode: 'pa.lproj',
        osxLocale: 'pa',
    },
    {
        name: 'Punjabi, Pakistan',
        twoLettersCode: 'pa',
        threeLettersCode: 'pan',
        locale: 'pa-PK',
        androidCode: 'pa-rPK',
        osxCode: 'pa-PK.lproj',
        osxLocale: 'pa_PK',
    },
    {
        name: 'Quechua',
        twoLettersCode: 'qu',
        threeLettersCode: 'que',
        locale: 'qu-PE',
        androidCode: 'qu-rPE',
        osxCode: 'qu.lproj',
        osxLocale: 'qu',
    },
    {
        name: 'Romanian',
        twoLettersCode: 'ro',
        threeLettersCode: 'ron',
        locale: 'ro-RO',
        androidCode: 'ro-rRO',
        osxCode: 'ro.lproj',
        osxLocale: 'ro',
    },
    {
        name: 'Romansh',
        twoLettersCode: 'rm',
        threeLettersCode: 'roh',
        locale: 'rm-CH',
        androidCode: 'rm-rCH',
        osxCode: 'rm.lproj',
        osxLocale: 'rm',
    },
    {
        name: 'Rundi',
        twoLettersCode: 'rn',
        threeLettersCode: 'run',
        locale: 'rn-BI',
        androidCode: 'rn-rBI',
        osxCode: 'rn.lproj',
        osxLocale: 'rn',
    },
    {
        name: 'Russian',
        twoLettersCode: 'ru',
        threeLettersCode: 'rus',
        locale: 'ru-RU',
        androidCode: 'ru-rRU',
        osxCode: 'ru.lproj',
        osxLocale: 'ru',
    },
    {
        name: 'Russian, Belarus',
        twoLettersCode: 'ru',
        threeLettersCode: 'rus',
        locale: 'ru-BY',
        androidCode: 'ru-rBY',
        osxCode: 'ru-BY.lproj',
        osxLocale: 'ru_BY',
    },
    {
        name: 'Russian, Moldova',
        twoLettersCode: 'ru',
        threeLettersCode: 'rus',
        locale: 'ru-MD',
        androidCode: 'ru-rMD',
        osxCode: 'ru-MD.lproj',
        osxLocale: 'ru_MD',
    },
    {
        name: 'Sakha',
        twoLettersCode: 'sah',
        threeLettersCode: 'sah',
        locale: 'sah-SAH',
        androidCode: 'sah-rSAH',
        osxCode: 'sah.lproj',
        osxLocale: 'sah',
    },
    {
        name: 'Sango',
        twoLettersCode: 'sg',
        threeLettersCode: 'sag',
        locale: 'sg-CF',
        androidCode: 'sg-rCF',
        osxCode: 'sg.lproj',
        osxLocale: 'sg',
    },
    {
        name: 'Sanskrit',
        twoLettersCode: 'sa',
        threeLettersCode: 'san',
        locale: 'sa-IN',
        androidCode: 'sa-rIN',
        osxCode: 'sa.lproj',
        osxLocale: 'sa',
    },
    {
        name: 'Santali',
        twoLettersCode: 'sat',
        threeLettersCode: 'sat',
        locale: 'sat-IN',
        androidCode: 'sat-rIN',
        osxCode: 'sat.lproj',
        osxLocale: 'sat',
    },
    {
        name: 'Sardinian',
        twoLettersCode: 'sc',
        threeLettersCode: 'srd',
        locale: 'sc-IT',
        androidCode: 'sc-rIT',
        osxCode: 'sc.lproj',
        osxLocale: 'sc',
    },
    {
        name: 'Scots',
        twoLettersCode: 'sco',
        threeLettersCode: 'sco',
        locale: 'sco-GB',
        androidCode: 'sco-rGB',
        osxCode: 'sco.lproj',
        osxLocale: 'sco',
    },
    {
        name: 'Scottish Gaelic',
        twoLettersCode: 'gd',
        threeLettersCode: 'gla',
        locale: 'gd-GB',
        androidCode: 'gd-rGB',
        osxCode: 'gd.lproj',
        osxLocale: 'gd',
    },
    {
        name: 'Serbian',
        twoLettersCode: 'sr',
        threeLettersCode: 'srp',
        locale: 'srp',
        androidCode: 'srp',
        osxCode: 'sr.lproj',
        osxLocale: 'sr',
    },
    {
        name: 'Serbian (Cyrillic)',
        twoLettersCode: 'sr',
        threeLettersCode: 'srp',
        locale: 'sr-Cyrl',
        androidCode: 'sr-rCyrl',
        osxCode: 'sr-Cyrl.lproj',
        osxLocale: 'sr_Cyrl',
    },
    {
        name: 'Serbian (Latin)',
        twoLettersCode: 'sr',
        threeLettersCode: 'srp',
        locale: 'sr-Latn',
        androidCode: 'sr-rLatn',
        osxCode: 'sr-Latn.lproj',
        osxLocale: 'sr_Latn',
    },
    {
        name: 'Serbo-Croatian',
        twoLettersCode: 'sh',
        threeLettersCode: 'hbs',
        locale: 'sh-HR',
        androidCode: 'sh-rHR',
        osxCode: 'sh.lproj',
        osxLocale: 'sh',
    },
    {
        name: 'Seychellois Creole',
        twoLettersCode: 'crs',
        threeLettersCode: 'crs',
        locale: 'crs-SC',
        androidCode: 'crs-rSC',
        osxCode: 'crs.lproj',
        osxLocale: 'crs',
    },
    {
        name: 'Shona',
        twoLettersCode: 'sn',
        threeLettersCode: 'sna',
        locale: 'sn-ZW',
        androidCode: 'sn-rZW',
        osxCode: 'sn.lproj',
        osxLocale: 'sn',
    },
    {
        name: 'Sichuan Yi',
        twoLettersCode: 'ii',
        threeLettersCode: 'iii',
        locale: 'ii-CN',
        androidCode: 'ii-rCN',
        osxCode: 'ii.lproj',
        osxLocale: 'ii',
    },
    {
        name: 'Sindhi',
        twoLettersCode: 'sd',
        threeLettersCode: 'snd',
        locale: 'sd-PK',
        androidCode: 'sd-rPK',
        osxCode: 'sd.lproj',
        osxLocale: 'sd',
    },
    {
        name: 'Sinhala',
        twoLettersCode: 'si',
        threeLettersCode: 'sin',
        locale: 'si-LK',
        androidCode: 'si-rLK',
        osxCode: 'si.lproj',
        osxLocale: 'si',
    },
    {
        name: 'Slovak',
        twoLettersCode: 'sk',
        threeLettersCode: 'slk',
        locale: 'sk-SK',
        androidCode: 'sk-rSK',
        osxCode: 'sk.lproj',
        osxLocale: 'sk',
    },
    {
        name: 'Slovenian',
        twoLettersCode: 'sl',
        threeLettersCode: 'slv',
        locale: 'sl-SI',
        androidCode: 'sl-rSI',
        osxCode: 'sl.lproj',
        osxLocale: 'sl',
    },
    {
        name: 'Somali',
        twoLettersCode: 'so',
        threeLettersCode: 'som',
        locale: 'so-SO',
        androidCode: 'so-rSO',
        osxCode: 'so.lproj',
        osxLocale: 'so',
    },
    {
        name: 'Songhay',
        twoLettersCode: 'son',
        threeLettersCode: 'son',
        locale: 'son-ZA',
        androidCode: 'son-rZA',
        osxCode: 'son.lproj',
        osxLocale: 'son',
    },
    {
        name: 'Sorani (Kurdish)',
        twoLettersCode: 'ku',
        threeLettersCode: 'ckb',
        locale: 'ckb-IR',
        androidCode: 'ckb-rIR',
        osxCode: 'ckb.lproj',
        osxLocale: 'ckb',
    },
    {
        name: 'Southern Ndebele',
        twoLettersCode: 'nr',
        threeLettersCode: 'nbl',
        locale: 'nr-ZA',
        androidCode: 'nr-rZA',
        osxCode: 'nr.lproj',
        osxLocale: 'nr',
    },
    {
        name: 'Southern Sami',
        twoLettersCode: 'sma',
        threeLettersCode: 'sma',
        locale: 'sma-NO',
        androidCode: 'sma-rNO',
        osxCode: 'sma.lproj',
        osxLocale: 'sma',
    },
    {
        name: 'Southern Sotho',
        twoLettersCode: 'st',
        threeLettersCode: 'sot',
        locale: 'st-ZA',
        androidCode: 'st-rZA',
        osxCode: 'st.lproj',
        osxLocale: 'st',
    },
    {
        name: 'Spanish',
        twoLettersCode: 'es',
        threeLettersCode: 'spa',
        locale: 'es-ES',
        androidCode: 'es-rES',
        osxCode: 'es.lproj',
        osxLocale: 'es',
    },
    {
        name: 'Spanish (Modern)',
        twoLettersCode: 'es',
        threeLettersCode: 'spa',
        locale: 'es-EM',
        androidCode: 'es-rEM',
        osxCode: 'es-EM.lproj',
        osxLocale: 'es_EM',
    },
    {
        name: 'Spanish, Argentina',
        twoLettersCode: 'es',
        threeLettersCode: 'spa',
        locale: 'es-AR',
        androidCode: 'es-rAR',
        osxCode: 'es-AR.lproj',
        osxLocale: 'es_AR',
    },
    {
        name: 'Spanish, Bolivia',
        twoLettersCode: 'es',
        threeLettersCode: 'spa',
        locale: 'es-BO',
        androidCode: 'es-rBO',
        osxCode: 'es-BO.lproj',
        osxLocale: 'es_BO',
    },
    {
        name: 'Spanish, Chile',
        twoLettersCode: 'es',
        threeLettersCode: 'spa',
        locale: 'es-CL',
        androidCode: 'es-rCL',
        osxCode: 'es-CL.lproj',
        osxLocale: 'es_CL',
    },
    {
        name: 'Spanish, Colombia',
        twoLettersCode: 'es',
        threeLettersCode: 'spa',
        locale: 'es-CO',
        androidCode: 'es-rCO',
        osxCode: 'es-CO.lproj',
        osxLocale: 'es_CO',
    },
    {
        name: 'Spanish, Costa Rica',
        twoLettersCode: 'es',
        threeLettersCode: 'spa',
        locale: 'es-CR',
        androidCode: 'es-rCR',
        osxCode: 'es-CR.lproj',
        osxLocale: 'es_CR',
    },
    {
        name: 'Spanish, Dominican Republic',
        twoLettersCode: 'es',
        threeLettersCode: 'spa',
        locale: 'es-DO',
        androidCode: 'es-rDO',
        osxCode: 'es-DO.lproj',
        osxLocale: 'es_DO',
    },
    {
        name: 'Spanish, Ecuador',
        twoLettersCode: 'es',
        threeLettersCode: 'spa',
        locale: 'es-EC',
        androidCode: 'es-rEC',
        osxCode: 'es-EC.lproj',
        osxLocale: 'es_EC',
    },
    {
        name: 'Spanish, El Salvador',
        twoLettersCode: 'es',
        threeLettersCode: 'spa',
        locale: 'es-SV',
        androidCode: 'es-rSV',
        osxCode: 'es-SV.lproj',
        osxLocale: 'es_SV',
    },
    {
        name: 'Spanish, Guatemala',
        twoLettersCode: 'es',
        threeLettersCode: 'spa',
        locale: 'es-GT',
        androidCode: 'es-rGT',
        osxCode: 'es-GT.lproj',
        osxLocale: 'es_GT',
    },
    {
        name: 'Spanish, Honduras',
        twoLettersCode: 'es',
        threeLettersCode: 'spa',
        locale: 'es-HN',
        androidCode: 'es-rHN',
        osxCode: 'es-HN.lproj',
        osxLocale: 'es_HN',
    },
    {
        name: 'Spanish, Mexico',
        twoLettersCode: 'es',
        threeLettersCode: 'spa',
        locale: 'es-MX',
        androidCode: 'es-rMX',
        osxCode: 'es-MX.lproj',
        osxLocale: 'es_MX',
    },
    {
        name: 'Spanish, Nicaragua',
        twoLettersCode: 'es',
        threeLettersCode: 'spa',
        locale: 'es-NI',
        androidCode: 'es-rNI',
        osxCode: 'es-NI.lproj',
        osxLocale: 'es_NI',
    },
    {
        name: 'Spanish, Panama',
        twoLettersCode: 'es',
        threeLettersCode: 'spa',
        locale: 'es-PA',
        androidCode: 'es-rPA',
        osxCode: 'es-PA.lproj',
        osxLocale: 'es_PA',
    },
    {
        name: 'Spanish, Paraguay',
        twoLettersCode: 'es',
        threeLettersCode: 'spa',
        locale: 'es-PY',
        androidCode: 'es-rPY',
        osxCode: 'es-PY.lproj',
        osxLocale: 'es_PY',
    },
    {
        name: 'Spanish, Peru',
        twoLettersCode: 'es',
        threeLettersCode: 'spa',
        locale: 'es-PE',
        androidCode: 'es-rPE',
        osxCode: 'es-PE.lproj',
        osxLocale: 'es_PE',
    },
    {
        name: 'Spanish, Puerto Rico',
        twoLettersCode: 'es',
        threeLettersCode: 'spa',
        locale: 'es-PR',
        androidCode: 'es-rPR',
        osxCode: 'es-PR.lproj',
        osxLocale: 'es_PR',
    },
    {
        name: 'Spanish, United States',
        twoLettersCode: 'es',
        threeLettersCode: 'spa',
        locale: 'es-US',
        androidCode: 'es-rUS',
        osxCode: 'es-US.lproj',
        osxLocale: 'es_US',
    },
    {
        name: 'Spanish, Uruguay',
        twoLettersCode: 'es',
        threeLettersCode: 'spa',
        locale: 'es-UY',
        androidCode: 'es-rUY',
        osxCode: 'es-UY.lproj',
        osxLocale: 'es_UY',
    },
    {
        name: 'Spanish, Venezuela',
        twoLettersCode: 'es',
        threeLettersCode: 'spa',
        locale: 'es-VE',
        androidCode: 'es-rVE',
        osxCode: 'es-VE.lproj',
        osxLocale: 'es_VE',
    },
    {
        name: 'Sundanese',
        twoLettersCode: 'su',
        threeLettersCode: 'sun',
        locale: 'su-ID',
        androidCode: 'su-rID',
        osxCode: 'su.lproj',
        osxLocale: 'su',
    },
    {
        name: 'Swahili',
        twoLettersCode: 'sw',
        threeLettersCode: 'swa',
        locale: 'sw-KE',
        androidCode: 'sw-rKE',
        osxCode: 'sw.lproj',
        osxLocale: 'sw',
    },
    {
        name: 'Swahili, Kenya',
        twoLettersCode: 'sw',
        threeLettersCode: 'swa',
        locale: 'sw-KE',
        androidCode: 'sw-rKE',
        osxCode: 'sw-KE.lproj',
        osxLocale: 'sw_KE',
    },
    {
        name: 'Swahili, Tanzania',
        twoLettersCode: 'sw',
        threeLettersCode: 'swa',
        locale: 'sw-TZ',
        androidCode: 'sw-rTZ',
        osxCode: 'sw-TZ.lproj',
        osxLocale: 'sw_TZ',
    },
    {
        name: 'Swati',
        twoLettersCode: 'ss',
        threeLettersCode: 'ssw',
        locale: 'ss-ZA',
        androidCode: 'ss-rZA',
        osxCode: 'ss.lproj',
        osxLocale: 'ss',
    },
    {
        name: 'Swedish',
        twoLettersCode: 'sv',
        threeLettersCode: 'swe',
        locale: 'sv-SE',
        androidCode: 'sv-rSE',
        osxCode: 'sv.lproj',
        osxLocale: 'sv',
    },
    {
        name: 'Swedish, Finland',
        twoLettersCode: 'sv',
        threeLettersCode: 'swe',
        locale: 'sv-FI',
        androidCode: 'sv-rFI',
        osxCode: 'sv-FI.lproj',
        osxLocale: 'sv_FI',
    },
    {
        name: 'Syriac',
        twoLettersCode: 'syc',
        threeLettersCode: 'syc',
        locale: 'syc-SY',
        androidCode: 'syc-rSY',
        osxCode: 'syc.lproj',
        osxLocale: 'syc',
    },
    {
        name: 'Tagalog',
        twoLettersCode: 'tl',
        threeLettersCode: 'tgl',
        locale: 'tl-PH',
        androidCode: 'tl-rPH',
        osxCode: 'tl.lproj',
        osxLocale: 'tl',
    },
    {
        name: 'Tahitian',
        twoLettersCode: 'ty',
        threeLettersCode: 'tah',
        locale: 'ty-PF',
        androidCode: 'ty-rPF',
        osxCode: 'ty.lproj',
        osxLocale: 'ty',
    },
    {
        name: 'Tajik',
        twoLettersCode: 'tg',
        threeLettersCode: 'tgk',
        locale: 'tg-TJ',
        androidCode: 'tg-rTJ',
        osxCode: 'tg.lproj',
        osxLocale: 'tg',
    },
    {
        name: 'Tamil',
        twoLettersCode: 'ta',
        threeLettersCode: 'tam',
        locale: 'ta-IN',
        androidCode: 'ta-rIN',
        osxCode: 'ta.lproj',
        osxLocale: 'ta',
    },
    {
        name: 'Tatar',
        twoLettersCode: 'tt',
        threeLettersCode: 'tat',
        locale: 'tt-RU',
        androidCode: 'tt-rRU',
        osxCode: 'tt.lproj',
        osxLocale: 'tt',
    },
    {
        name: 'Telugu',
        twoLettersCode: 'te',
        threeLettersCode: 'tel',
        locale: 'te-IN',
        androidCode: 'te-rIN',
        osxCode: 'te.lproj',
        osxLocale: 'te',
    },
    {
        name: 'Tem (Kotokoli)',
        twoLettersCode: 'kdh',
        threeLettersCode: 'kdh',
        locale: 'kdh-KDH',
        androidCode: 'kdh-rKDH',
        osxCode: 'kdh.lproj',
        osxLocale: 'kdh',
    },
    {
        name: 'Thai',
        twoLettersCode: 'th',
        threeLettersCode: 'tha',
        locale: 'th-TH',
        androidCode: 'th-rTH',
        osxCode: 'th.lproj',
        osxLocale: 'th',
    },
    {
        name: 'Tibetan',
        twoLettersCode: 'bo',
        threeLettersCode: 'tib',
        locale: 'bo-BT',
        androidCode: 'bo-rBT',
        osxCode: 'bo.lproj',
        osxLocale: 'bo',
    },
    {
        name: 'Tigrinya',
        twoLettersCode: 'ti',
        threeLettersCode: 'tir',
        locale: 'ti-ER',
        androidCode: 'ti-rER',
        osxCode: 'ti.lproj',
        osxLocale: 'ti',
    },
    {
        name: 'Tsonga',
        twoLettersCode: 'ts',
        threeLettersCode: 'tso',
        locale: 'ts-ZA',
        androidCode: 'ts-rZA',
        osxCode: 'ts.lproj',
        osxLocale: 'ts',
    },
    {
        name: 'Tswana',
        twoLettersCode: 'tn',
        threeLettersCode: 'tsn',
        locale: 'tn-ZA',
        androidCode: 'tn-rZA',
        osxCode: 'tn.lproj',
        osxLocale: 'tn',
    },
    {
        name: 'Turkish',
        twoLettersCode: 'tr',
        threeLettersCode: 'tur',
        locale: 'tr-TR',
        androidCode: 'tr-rTR',
        osxCode: 'tr.lproj',
        osxLocale: 'tr',
    },
    {
        name: 'Turkish, Cyprus',
        twoLettersCode: 'tr',
        threeLettersCode: 'tur',
        locale: 'tr-CY',
        androidCode: 'tr-rCY',
        osxCode: 'tr-CY.lproj',
        osxLocale: 'tr_CY',
    },
    {
        name: 'Turkmen',
        twoLettersCode: 'tk',
        threeLettersCode: 'tuk',
        locale: 'tk-TM',
        androidCode: 'tk-rTM',
        osxCode: 'tk.lproj',
        osxLocale: 'tk',
    },
    {
        name: 'Ukrainian',
        twoLettersCode: 'uk',
        threeLettersCode: 'ukr',
        locale: 'uk-UA',
        androidCode: 'uk-rUA',
        osxCode: 'uk.lproj',
        osxLocale: 'uk',
    },
    {
        name: 'Upper Sorbian',
        twoLettersCode: 'hsb',
        threeLettersCode: 'hsb',
        locale: 'hsb-DE',
        androidCode: 'hsb-rDE',
        osxCode: 'hsb.lproj',
        osxLocale: 'hsb',
    },
    {
        name: 'Urdu (India)',
        twoLettersCode: 'ur',
        threeLettersCode: 'urd',
        locale: 'ur-IN',
        androidCode: 'ur-rIN',
        osxCode: 'ur-IN.lproj',
        osxLocale: 'ur_IN',
    },
    {
        name: 'Urdu (Pakistan)',
        twoLettersCode: 'ur',
        threeLettersCode: 'urd',
        locale: 'ur-PK',
        androidCode: 'ur-rPK',
        osxCode: 'ur.lproj',
        osxLocale: 'ur',
    },
    {
        name: 'Uyghur',
        twoLettersCode: 'ug',
        threeLettersCode: 'uig',
        locale: 'ug-CN',
        androidCode: 'ug-rCN',
        osxCode: 'ug.lproj',
        osxLocale: 'ug',
    },
    {
        name: 'Uzbek',
        twoLettersCode: 'uz',
        threeLettersCode: 'uzb',
        locale: 'uz-UZ',
        androidCode: 'uz-rUZ',
        osxCode: 'uz.lproj',
        osxLocale: 'uz',
    },
    {
        name: 'Valencian',
        twoLettersCode: 'val',
        threeLettersCode: 'val',
        locale: 'val-ES',
        androidCode: 'val-rES',
        osxCode: 'val.lproj',
        osxLocale: 'val',
    },
    {
        name: 'Venda',
        twoLettersCode: 've',
        threeLettersCode: 'ven',
        locale: 've-ZA',
        androidCode: 've-rZA',
        osxCode: 've.lproj',
        osxLocale: 've',
    },
    {
        name: 'Venetian',
        twoLettersCode: 'vec',
        threeLettersCode: 'vec',
        locale: 'vec-IT',
        androidCode: 'vec-rIT',
        osxCode: 'vec.lproj',
        osxLocale: 'vec',
    },
    {
        name: 'Vietnamese',
        twoLettersCode: 'vi',
        threeLettersCode: 'vie',
        locale: 'vi-VN',
        androidCode: 'vi-rVN',
        osxCode: 'vi.lproj',
        osxLocale: 'vi',
    },
    {
        name: 'Walloon',
        twoLettersCode: 'wa',
        threeLettersCode: 'wln',
        locale: 'wa-BE',
        androidCode: 'wa-rBE',
        osxCode: 'wa.lproj',
        osxLocale: 'wa',
    },
    {
        name: 'Welsh',
        twoLettersCode: 'cy',
        threeLettersCode: 'cym',
        locale: 'cy-GB',
        androidCode: 'cy-rGB',
        osxCode: 'cy.lproj',
        osxLocale: 'cy',
    },
    {
        name: 'Wolof',
        twoLettersCode: 'wo',
        threeLettersCode: 'wol',
        locale: 'wo-SN',
        androidCode: 'wo-rSN',
        osxCode: 'wo.lproj',
        osxLocale: 'wo',
    },
    {
        name: 'Xhosa',
        twoLettersCode: 'xh',
        threeLettersCode: 'xho',
        locale: 'xh-ZA',
        androidCode: 'xh-rZA',
        osxCode: 'xh.lproj',
        osxLocale: 'xh',
    },
    {
        name: 'Yiddish',
        twoLettersCode: 'yi',
        threeLettersCode: 'yid',
        locale: 'yi-DE',
        androidCode: 'ji-rDE',
        osxCode: 'yi.lproj',
        osxLocale: 'yi',
    },
    {
        name: 'Yoruba',
        twoLettersCode: 'yo',
        threeLettersCode: 'yor',
        locale: 'yo-NG',
        androidCode: 'yo-rNG',
        osxCode: 'yo.lproj',
        osxLocale: 'yo',
    },
    {
        name: 'Zeelandic',
        twoLettersCode: 'zea',
        threeLettersCode: 'zea',
        locale: 'zea-ZEA',
        androidCode: 'zea-rZEA',
        osxCode: 'zea.lproj',
        osxLocale: 'zea',
    },
    {
        name: 'Zulu',
        twoLettersCode: 'zu',
        threeLettersCode: 'zul',
        locale: 'zu-ZA',
        androidCode: 'zu-rZA',
        osxCode: 'zu.lproj',
        osxLocale: 'zu',
    },
];
function includesLanguagePlaceholders(str) {
    return Object.keys(languagePlaceholders).some(placeholder => str.includes(placeholder));
}
exports.includesLanguagePlaceholders = includesLanguagePlaceholders;
function replaceLanguagePlaceholders(str, languageCode, languageMapping, customLanguage) {
    let language;
    if (customLanguage) {
        language = {
            name: languageCode,
            twoLettersCode: customLanguage.two_letters_code,
            threeLettersCode: customLanguage.three_letters_code,
            locale: customLanguage.locale,
            localeWithUnderscore: customLanguage.locale_with_underscore,
            androidCode: customLanguage.android_code,
            osxCode: customLanguage.osx_code,
            osxLocale: customLanguage.osx_code,
        };
    }
    else {
        language = languages.find(l => l.twoLettersCode === languageCode || l.locale === languageCode);
    }
    if (!language) {
        throw new Error(`Unsupported language code : ${languageCode}`);
    }
    let result = str;
    for (const placeholder of Object.keys(languagePlaceholders)) {
        if (result.includes(placeholder)) {
            const cleanPlaceholder = placeholder.slice(1, -1);
            const replaceValue = languageMapping && languageMapping[cleanPlaceholder]
                ? languageMapping[cleanPlaceholder]
                : languagePlaceholders[placeholder](language);
            result = result.replace(placeholder, replaceValue);
        }
    }
    return result;
}
exports.replaceLanguagePlaceholders = replaceLanguagePlaceholders;


/***/ }),

/***/ 7406:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.mergeDeep = exports.isJsonFile = void 0;
function isJsonFile(file) {
    const extension = (file || '').split('.').pop();
    return (extension === null || extension === void 0 ? void 0 : extension.toLocaleLowerCase()) === 'json';
}
exports.isJsonFile = isJsonFile;
function isObject(value) {
    return value && typeof value === 'object' && !Array.isArray(value);
}
function mergeDeep(targetObj, sourceObj) {
    const target = targetObj || {};
    const source = sourceObj || {};
    Object.keys(source).forEach(key => {
        if (isObject(source[key])) {
            if (!(key in target)) {
                target[key] = source[key];
            }
            else {
                target[key] = mergeDeep(target[key], source[key]);
            }
        }
        else {
            target[key] = source[key];
        }
    });
    return target;
}
exports.mergeDeep = mergeDeep;


/***/ }),

/***/ 8276:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;

__webpack_unused_export__ = ({ value: true });
function splitToWords(text) {
    // separators: everything that is not a small letter or a number
    const separators = /([^a-z0-9])/g;
    return text.replace(separators, (_match, sep) => {
        const charCode = sep.charCodeAt(0);
        if (charCode >= 65 && charCode <= 90) {
            return ' ' + sep;
        }
        return ' ';
    }).split(' ').filter(val => val.length > 0);
}
function upperCaseEachWord(words, alsoFirst = false) {
    return words.map((word, index) => {
        if (alsoFirst || index > 0) {
            // only the first letter should be upper case
            return word.charAt(0).toUpperCase() + word.slice(1);
        }
        return word;
    });
}
function convertConvention(text, toConvention) {
    if (typeof text !== 'string')
        throw new Error('convertConvention: text must be a string');
    const words = splitToWords(text).map(w => w.toLowerCase());
    if (toConvention === 'camelCase') {
        return upperCaseEachWord(words, false).join('');
    }
    else if (toConvention === 'kebab-case') {
        return words.join('-');
    }
    else if (toConvention === 'snake_case') {
        return words.join('_');
    }
    else if (toConvention === 'PascalCase') {
        return upperCaseEachWord(words, true).join('');
    }
    else if (toConvention === 'Space Case') {
        return upperCaseEachWord(words, true).join(' ');
    }
    throw new Error('convertConvention: toConvention must be one of camelCase, kebab-case, snake_case, PascalCase, Space Case');
}
exports.Z = convertConvention;


/***/ }),

/***/ 9669:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(1609);

/***/ }),

/***/ 7970:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(4867);
var settle = __webpack_require__(6026);
var buildFullPath = __webpack_require__(4097);
var buildURL = __webpack_require__(5327);
var http = __webpack_require__(8605);
var https = __webpack_require__(7211);
var httpFollow = __webpack_require__(938).http;
var httpsFollow = __webpack_require__(938).https;
var url = __webpack_require__(8835);
var zlib = __webpack_require__(8761);
var pkg = __webpack_require__(8593);
var createError = __webpack_require__(5061);
var enhanceError = __webpack_require__(481);

var isHttps = /https:?/;

/**
 *
 * @param {http.ClientRequestArgs} options
 * @param {AxiosProxyConfig} proxy
 * @param {string} location
 */
function setProxy(options, proxy, location) {
  options.hostname = proxy.host;
  options.host = proxy.host;
  options.port = proxy.port;
  options.path = location;

  // Basic proxy authorization
  if (proxy.auth) {
    var base64 = Buffer.from(proxy.auth.username + ':' + proxy.auth.password, 'utf8').toString('base64');
    options.headers['Proxy-Authorization'] = 'Basic ' + base64;
  }

  // If a proxy is used, any redirects must also pass through the proxy
  options.beforeRedirect = function beforeRedirect(redirection) {
    redirection.headers.host = redirection.host;
    setProxy(redirection, proxy, redirection.href);
  };
}

/*eslint consistent-return:0*/
module.exports = function httpAdapter(config) {
  return new Promise(function dispatchHttpRequest(resolvePromise, rejectPromise) {
    var resolve = function resolve(value) {
      resolvePromise(value);
    };
    var reject = function reject(value) {
      rejectPromise(value);
    };
    var data = config.data;
    var headers = config.headers;

    // Set User-Agent (required by some servers)
    // See https://github.com/axios/axios/issues/69
    if ('User-Agent' in headers || 'user-agent' in headers) {
      // User-Agent is specified; handle case where no UA header is desired
      if (!headers['User-Agent'] && !headers['user-agent']) {
        delete headers['User-Agent'];
        delete headers['user-agent'];
      }
      // Otherwise, use specified value
    } else {
      // Only set header if it hasn't been set in config
      headers['User-Agent'] = 'axios/' + pkg.version;
    }

    if (data && !utils.isStream(data)) {
      if (Buffer.isBuffer(data)) {
        // Nothing to do...
      } else if (utils.isArrayBuffer(data)) {
        data = Buffer.from(new Uint8Array(data));
      } else if (utils.isString(data)) {
        data = Buffer.from(data, 'utf-8');
      } else {
        return reject(createError(
          'Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream',
          config
        ));
      }

      // Add Content-Length header if data exists
      headers['Content-Length'] = data.length;
    }

    // HTTP basic authentication
    var auth = undefined;
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      auth = username + ':' + password;
    }

    // Parse url
    var fullPath = buildFullPath(config.baseURL, config.url);
    var parsed = url.parse(fullPath);
    var protocol = parsed.protocol || 'http:';

    if (!auth && parsed.auth) {
      var urlAuth = parsed.auth.split(':');
      var urlUsername = urlAuth[0] || '';
      var urlPassword = urlAuth[1] || '';
      auth = urlUsername + ':' + urlPassword;
    }

    if (auth) {
      delete headers.Authorization;
    }

    var isHttpsRequest = isHttps.test(protocol);
    var agent = isHttpsRequest ? config.httpsAgent : config.httpAgent;

    var options = {
      path: buildURL(parsed.path, config.params, config.paramsSerializer).replace(/^\?/, ''),
      method: config.method.toUpperCase(),
      headers: headers,
      agent: agent,
      agents: { http: config.httpAgent, https: config.httpsAgent },
      auth: auth
    };

    if (config.socketPath) {
      options.socketPath = config.socketPath;
    } else {
      options.hostname = parsed.hostname;
      options.port = parsed.port;
    }

    var proxy = config.proxy;
    if (!proxy && proxy !== false) {
      var proxyEnv = protocol.slice(0, -1) + '_proxy';
      var proxyUrl = process.env[proxyEnv] || process.env[proxyEnv.toUpperCase()];
      if (proxyUrl) {
        var parsedProxyUrl = url.parse(proxyUrl);
        var noProxyEnv = process.env.no_proxy || process.env.NO_PROXY;
        var shouldProxy = true;

        if (noProxyEnv) {
          var noProxy = noProxyEnv.split(',').map(function trim(s) {
            return s.trim();
          });

          shouldProxy = !noProxy.some(function proxyMatch(proxyElement) {
            if (!proxyElement) {
              return false;
            }
            if (proxyElement === '*') {
              return true;
            }
            if (proxyElement[0] === '.' &&
                parsed.hostname.substr(parsed.hostname.length - proxyElement.length) === proxyElement) {
              return true;
            }

            return parsed.hostname === proxyElement;
          });
        }

        if (shouldProxy) {
          proxy = {
            host: parsedProxyUrl.hostname,
            port: parsedProxyUrl.port,
            protocol: parsedProxyUrl.protocol
          };

          if (parsedProxyUrl.auth) {
            var proxyUrlAuth = parsedProxyUrl.auth.split(':');
            proxy.auth = {
              username: proxyUrlAuth[0],
              password: proxyUrlAuth[1]
            };
          }
        }
      }
    }

    if (proxy) {
      options.headers.host = parsed.hostname + (parsed.port ? ':' + parsed.port : '');
      setProxy(options, proxy, protocol + '//' + parsed.hostname + (parsed.port ? ':' + parsed.port : '') + options.path);
    }

    var transport;
    var isHttpsProxy = isHttpsRequest && (proxy ? isHttps.test(proxy.protocol) : true);
    if (config.transport) {
      transport = config.transport;
    } else if (config.maxRedirects === 0) {
      transport = isHttpsProxy ? https : http;
    } else {
      if (config.maxRedirects) {
        options.maxRedirects = config.maxRedirects;
      }
      transport = isHttpsProxy ? httpsFollow : httpFollow;
    }

    if (config.maxBodyLength > -1) {
      options.maxBodyLength = config.maxBodyLength;
    }

    // Create the request
    var req = transport.request(options, function handleResponse(res) {
      if (req.aborted) return;

      // uncompress the response body transparently if required
      var stream = res;

      // return the last request in case of redirects
      var lastRequest = res.req || req;


      // if no content, is HEAD request or decompress disabled we should not decompress
      if (res.statusCode !== 204 && lastRequest.method !== 'HEAD' && config.decompress !== false) {
        switch (res.headers['content-encoding']) {
        /*eslint default-case:0*/
        case 'gzip':
        case 'compress':
        case 'deflate':
        // add the unzipper to the body stream processing pipeline
          stream = stream.pipe(zlib.createUnzip());

          // remove the content-encoding in order to not confuse downstream operations
          delete res.headers['content-encoding'];
          break;
        }
      }

      var response = {
        status: res.statusCode,
        statusText: res.statusMessage,
        headers: res.headers,
        config: config,
        request: lastRequest
      };

      if (config.responseType === 'stream') {
        response.data = stream;
        settle(resolve, reject, response);
      } else {
        var responseBuffer = [];
        var totalResponseBytes = 0;
        stream.on('data', function handleStreamData(chunk) {
          responseBuffer.push(chunk);
          totalResponseBytes += chunk.length;

          // make sure the content length is not over the maxContentLength if specified
          if (config.maxContentLength > -1 && totalResponseBytes > config.maxContentLength) {
            stream.destroy();
            reject(createError('maxContentLength size of ' + config.maxContentLength + ' exceeded',
              config, null, lastRequest));
          }
        });

        stream.on('error', function handleStreamError(err) {
          if (req.aborted) return;
          reject(enhanceError(err, config, null, lastRequest));
        });

        stream.on('end', function handleStreamEnd() {
          var responseData = Buffer.concat(responseBuffer);
          if (config.responseType !== 'arraybuffer') {
            responseData = responseData.toString(config.responseEncoding);
            if (!config.responseEncoding || config.responseEncoding === 'utf8') {
              responseData = utils.stripBOM(responseData);
            }
          }

          response.data = responseData;
          settle(resolve, reject, response);
        });
      }
    });

    // Handle errors
    req.on('error', function handleRequestError(err) {
      if (req.aborted && err.code !== 'ERR_FR_TOO_MANY_REDIRECTS') return;
      reject(enhanceError(err, config, null, req));
    });

    // Handle request timeout
    if (config.timeout) {
      // This is forcing a int timeout to avoid problems if the `req` interface doesn't handle other types.
      var timeout = parseInt(config.timeout, 10);

      if (isNaN(timeout)) {
        reject(createError(
          'error trying to parse `config.timeout` to int',
          config,
          'ERR_PARSE_TIMEOUT',
          req
        ));

        return;
      }

      // Sometime, the response will be very slow, and does not respond, the connect event will be block by event loop system.
      // And timer callback will be fired, and abort() will be invoked before connection, then get "socket hang up" and code ECONNRESET.
      // At this time, if we have a large number of request, nodejs will hang up some socket on background. and the number will up and up.
      // And then these socket which be hang up will devoring CPU little by little.
      // ClientRequest.setTimeout will be fired on the specify milliseconds, and can make sure that abort() will be fired after connect.
      req.setTimeout(timeout, function handleRequestTimeout() {
        req.abort();
        reject(createError(
          'timeout of ' + timeout + 'ms exceeded',
          config,
          config.transitional && config.transitional.clarifyTimeoutError ? 'ETIMEDOUT' : 'ECONNABORTED',
          req
        ));
      });
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (req.aborted) return;

        req.abort();
        reject(cancel);
      });
    }

    // Send the request
    if (utils.isStream(data)) {
      data.on('error', function handleStreamError(err) {
        reject(enhanceError(err, config, null, req));
      }).pipe(req);
    } else {
      req.end(data);
    }
  });
};


/***/ }),

/***/ 5448:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(4867);
var settle = __webpack_require__(6026);
var cookies = __webpack_require__(4372);
var buildURL = __webpack_require__(5327);
var buildFullPath = __webpack_require__(4097);
var parseHeaders = __webpack_require__(4109);
var isURLSameOrigin = __webpack_require__(7985);
var createError = __webpack_require__(5061);

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;
    var responseType = config.responseType;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
        request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(
        timeoutErrorMessage,
        config,
        config.transitional && config.transitional.clarifyTimeoutError ? 'ETIMEDOUT' : 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ 1609:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(4867);
var bind = __webpack_require__(1849);
var Axios = __webpack_require__(321);
var mergeConfig = __webpack_require__(7185);
var defaults = __webpack_require__(5655);

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(5263);
axios.CancelToken = __webpack_require__(4972);
axios.isCancel = __webpack_require__(6502);

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(8713);

// Expose isAxiosError
axios.isAxiosError = __webpack_require__(6268);

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),

/***/ 5263:
/***/ ((module) => {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ 4972:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Cancel = __webpack_require__(5263);

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ 6502:
/***/ ((module) => {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ 321:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(4867);
var buildURL = __webpack_require__(5327);
var InterceptorManager = __webpack_require__(782);
var dispatchRequest = __webpack_require__(3572);
var mergeConfig = __webpack_require__(7185);
var validator = __webpack_require__(4875);

var validators = validator.validators;
/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  var transitional = config.transitional;

  if (transitional !== undefined) {
    validator.assertOptions(transitional, {
      silentJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
      forcedJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
      clarifyTimeoutError: validators.transitional(validators.boolean, '1.0.0')
    }, false);
  }

  // filter out skipped interceptors
  var requestInterceptorChain = [];
  var synchronousRequestInterceptors = true;
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
      return;
    }

    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  var responseInterceptorChain = [];
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
  });

  var promise;

  if (!synchronousRequestInterceptors) {
    var chain = [dispatchRequest, undefined];

    Array.prototype.unshift.apply(chain, requestInterceptorChain);
    chain = chain.concat(responseInterceptorChain);

    promise = Promise.resolve(config);
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }


  var newConfig = config;
  while (requestInterceptorChain.length) {
    var onFulfilled = requestInterceptorChain.shift();
    var onRejected = requestInterceptorChain.shift();
    try {
      newConfig = onFulfilled(newConfig);
    } catch (error) {
      onRejected(error);
      break;
    }
  }

  try {
    promise = dispatchRequest(newConfig);
  } catch (error) {
    return Promise.reject(error);
  }

  while (responseInterceptorChain.length) {
    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ 782:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(4867);

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected,
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ 4097:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isAbsoluteURL = __webpack_require__(1793);
var combineURLs = __webpack_require__(7303);

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};


/***/ }),

/***/ 5061:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var enhanceError = __webpack_require__(481);

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ 3572:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(4867);
var transformData = __webpack_require__(8527);
var isCancel = __webpack_require__(6502);
var defaults = __webpack_require__(5655);

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData.call(
    config,
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ 481:
/***/ ((module) => {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};


/***/ }),

/***/ 7185:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(4867);

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  var defaultToConfig2Keys = [
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
    'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
  ];
  var directMergeKeys = ['validateStatus'];

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  utils.forEach(directMergeKeys, function merge(prop) {
    if (prop in config2) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys)
    .concat(directMergeKeys);

  var otherKeys = Object
    .keys(config1)
    .concat(Object.keys(config2))
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, mergeDeepProperties);

  return config;
};


/***/ }),

/***/ 6026:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var createError = __webpack_require__(5061);

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ 8527:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(4867);
var defaults = __webpack_require__(5655);

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  var context = this || defaults;
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn.call(context, data, headers);
  });

  return data;
};


/***/ }),

/***/ 5655:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(4867);
var normalizeHeaderName = __webpack_require__(6016);
var enhanceError = __webpack_require__(481);

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(5448);
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__(7970);
  }
  return adapter;
}

var defaults = {

  transitional: {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  },

  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');

    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data) || (headers && headers['Content-Type'] === 'application/json')) {
      setContentTypeIfUnset(headers, 'application/json');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    var transitional = this.transitional;
    var silentJSONParsing = transitional && transitional.silentJSONParsing;
    var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

    if (strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length)) {
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw enhanceError(e, this, 'E_JSON_PARSE');
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;


/***/ }),

/***/ 1849:
/***/ ((module) => {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ 5327:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(4867);

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ 7303:
/***/ ((module) => {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ 4372:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(4867);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ 1793:
/***/ ((module) => {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ 6268:
/***/ ((module) => {

"use strict";


/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return (typeof payload === 'object') && (payload.isAxiosError === true);
};


/***/ }),

/***/ 7985:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(4867);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ 6016:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(4867);

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ 4109:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(4867);

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ 8713:
/***/ ((module) => {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ 4875:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var pkg = __webpack_require__(8593);

var validators = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
  validators[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

var deprecatedWarnings = {};
var currentVerArr = pkg.version.split('.');

/**
 * Compare package versions
 * @param {string} version
 * @param {string?} thanVersion
 * @returns {boolean}
 */
function isOlderVersion(version, thanVersion) {
  var pkgVersionArr = thanVersion ? thanVersion.split('.') : currentVerArr;
  var destVer = version.split('.');
  for (var i = 0; i < 3; i++) {
    if (pkgVersionArr[i] > destVer[i]) {
      return true;
    } else if (pkgVersionArr[i] < destVer[i]) {
      return false;
    }
  }
  return false;
}

/**
 * Transitional option validator
 * @param {function|boolean?} validator
 * @param {string?} version
 * @param {string} message
 * @returns {function}
 */
validators.transitional = function transitional(validator, version, message) {
  var isDeprecated = version && isOlderVersion(version);

  function formatMessage(opt, desc) {
    return '[Axios v' + pkg.version + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return function(value, opt, opts) {
    if (validator === false) {
      throw new Error(formatMessage(opt, ' has been removed in ' + version));
    }

    if (isDeprecated && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new TypeError('options must be an object');
  }
  var keys = Object.keys(options);
  var i = keys.length;
  while (i-- > 0) {
    var opt = keys[i];
    var validator = schema[opt];
    if (validator) {
      var value = options[opt];
      var result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new TypeError('option ' + opt + ' must be ' + result);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw Error('Unknown option ' + opt);
    }
  }
}

module.exports = {
  isOlderVersion: isOlderVersion,
  assertOptions: assertOptions,
  validators: validators
};


/***/ }),

/***/ 4867:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var bind = __webpack_require__(1849);

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};


/***/ }),

/***/ 1227:
/***/ ((module, exports, __webpack_require__) => {

/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */

exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
exports.destroy = (() => {
	let warned = false;

	return () => {
		if (!warned) {
			warned = true;
			console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
		}
	};
})();

/**
 * Colors.
 */

exports.colors = [
	'#0000CC',
	'#0000FF',
	'#0033CC',
	'#0033FF',
	'#0066CC',
	'#0066FF',
	'#0099CC',
	'#0099FF',
	'#00CC00',
	'#00CC33',
	'#00CC66',
	'#00CC99',
	'#00CCCC',
	'#00CCFF',
	'#3300CC',
	'#3300FF',
	'#3333CC',
	'#3333FF',
	'#3366CC',
	'#3366FF',
	'#3399CC',
	'#3399FF',
	'#33CC00',
	'#33CC33',
	'#33CC66',
	'#33CC99',
	'#33CCCC',
	'#33CCFF',
	'#6600CC',
	'#6600FF',
	'#6633CC',
	'#6633FF',
	'#66CC00',
	'#66CC33',
	'#9900CC',
	'#9900FF',
	'#9933CC',
	'#9933FF',
	'#99CC00',
	'#99CC33',
	'#CC0000',
	'#CC0033',
	'#CC0066',
	'#CC0099',
	'#CC00CC',
	'#CC00FF',
	'#CC3300',
	'#CC3333',
	'#CC3366',
	'#CC3399',
	'#CC33CC',
	'#CC33FF',
	'#CC6600',
	'#CC6633',
	'#CC9900',
	'#CC9933',
	'#CCCC00',
	'#CCCC33',
	'#FF0000',
	'#FF0033',
	'#FF0066',
	'#FF0099',
	'#FF00CC',
	'#FF00FF',
	'#FF3300',
	'#FF3333',
	'#FF3366',
	'#FF3399',
	'#FF33CC',
	'#FF33FF',
	'#FF6600',
	'#FF6633',
	'#FF9900',
	'#FF9933',
	'#FFCC00',
	'#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

// eslint-disable-next-line complexity
function useColors() {
	// NB: In an Electron preload script, document will be defined but not fully
	// initialized. Since we know we're in Chrome, we'll just detect this case
	// explicitly
	if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
		return true;
	}

	// Internet Explorer and Edge do not support colors.
	if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
		return false;
	}

	// Is webkit? http://stackoverflow.com/a/16459606/376773
	// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
		// Is firebug? http://stackoverflow.com/a/398120/376773
		(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
		// Is firefox >= v31?
		// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
		// Double check webkit in userAgent just in case we are in a worker
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	args[0] = (this.useColors ? '%c' : '') +
		this.namespace +
		(this.useColors ? ' %c' : ' ') +
		args[0] +
		(this.useColors ? '%c ' : ' ') +
		'+' + module.exports.humanize(this.diff);

	if (!this.useColors) {
		return;
	}

	const c = 'color: ' + this.color;
	args.splice(1, 0, c, 'color: inherit');

	// The final "%c" is somewhat tricky, because there could be other
	// arguments passed either before or after the %c, so we need to
	// figure out the correct index to insert the CSS into
	let index = 0;
	let lastC = 0;
	args[0].replace(/%[a-zA-Z%]/g, match => {
		if (match === '%%') {
			return;
		}
		index++;
		if (match === '%c') {
			// We only are interested in the *last* %c
			// (the user may have provided their own)
			lastC = index;
		}
	});

	args.splice(lastC, 0, c);
}

/**
 * Invokes `console.debug()` when available.
 * No-op when `console.debug` is not a "function".
 * If `console.debug` is not available, falls back
 * to `console.log`.
 *
 * @api public
 */
exports.log = console.debug || console.log || (() => {});

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	try {
		if (namespaces) {
			exports.storage.setItem('debug', namespaces);
		} else {
			exports.storage.removeItem('debug');
		}
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */
function load() {
	let r;
	try {
		r = exports.storage.getItem('debug');
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}

	// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	if (!r && typeof process !== 'undefined' && 'env' in process) {
		r = process.env.DEBUG;
	}

	return r;
}

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
	try {
		// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
		// The Browser also has localStorage in the global context.
		return localStorage;
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

module.exports = __webpack_require__(2447)(exports);

const {formatters} = module.exports;

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
	try {
		return JSON.stringify(v);
	} catch (error) {
		return '[UnexpectedJSONParseError]: ' + error.message;
	}
};


/***/ }),

/***/ 2447:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = __webpack_require__(7824);
	createDebug.destroy = destroy;

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* The currently active debug mode names, and names to skip.
	*/

	createDebug.names = [];
	createDebug.skips = [];

	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};

	/**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/
	function selectColor(namespace) {
		let hash = 0;

		for (let i = 0; i < namespace.length; i++) {
			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/
	function createDebug(namespace) {
		let prevTime;
		let enableOverride = null;
		let namespacesCache;
		let enabledCache;

		function debug(...args) {
			// Disabled?
			if (!debug.enabled) {
				return;
			}

			const self = debug;

			// Set `diff` timestamp
			const curr = Number(new Date());
			const ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return '%';
				}
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					const val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.useColors = createDebug.useColors();
		debug.color = createDebug.selectColor(namespace);
		debug.extend = extend;
		debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

		Object.defineProperty(debug, 'enabled', {
			enumerable: true,
			configurable: false,
			get: () => {
				if (enableOverride !== null) {
					return enableOverride;
				}
				if (namespacesCache !== createDebug.namespaces) {
					namespacesCache = createDebug.namespaces;
					enabledCache = createDebug.enabled(namespace);
				}

				return enabledCache;
			},
			set: v => {
				enableOverride = v;
			}
		});

		// Env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		return debug;
	}

	function extend(namespace, delimiter) {
		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}

	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);
		createDebug.namespaces = namespaces;

		createDebug.names = [];
		createDebug.skips = [];

		let i;
		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
		const len = split.length;

		for (i = 0; i < len; i++) {
			if (!split[i]) {
				// ignore empty strings
				continue;
			}

			namespaces = split[i].replace(/\*/g, '.*?');

			if (namespaces[0] === '-') {
				createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
			} else {
				createDebug.names.push(new RegExp('^' + namespaces + '$'));
			}
		}
	}

	/**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/
	function disable() {
		const namespaces = [
			...createDebug.names.map(toNamespace),
			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
		].join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/
	function enabled(name) {
		if (name[name.length - 1] === '*') {
			return true;
		}

		let i;
		let len;

		for (i = 0, len = createDebug.skips.length; i < len; i++) {
			if (createDebug.skips[i].test(name)) {
				return false;
			}
		}

		for (i = 0, len = createDebug.names.length; i < len; i++) {
			if (createDebug.names[i].test(name)) {
				return true;
			}
		}

		return false;
	}

	/**
	* Convert regexp to namespace
	*
	* @param {RegExp} regxep
	* @return {String} namespace
	* @api private
	*/
	function toNamespace(regexp) {
		return regexp.toString()
			.substring(2, regexp.toString().length - 2)
			.replace(/\.\*\?$/, '*');
	}

	/**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	/**
	* XXX DO NOT USE. This is a temporary stub function.
	* XXX It WILL be removed in the next major release.
	*/
	function destroy() {
		console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

module.exports = setup;


/***/ }),

/***/ 5158:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Detect Electron renderer / nwjs process, which is node, but we should
 * treat as a browser.
 */

if (typeof process === 'undefined' || process.type === 'renderer' || process.browser === true || process.__nwjs) {
	module.exports = __webpack_require__(1227);
} else {
	module.exports = __webpack_require__(39);
}


/***/ }),

/***/ 39:
/***/ ((module, exports, __webpack_require__) => {

/**
 * Module dependencies.
 */

const tty = __webpack_require__(3867);
const util = __webpack_require__(1669);

/**
 * This is the Node.js implementation of `debug()`.
 */

exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.destroy = util.deprecate(
	() => {},
	'Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.'
);

/**
 * Colors.
 */

exports.colors = [6, 2, 3, 4, 5, 1];

try {
	// Optional dependency (as in, doesn't need to be installed, NOT like optionalDependencies in package.json)
	// eslint-disable-next-line import/no-extraneous-dependencies
	const supportsColor = __webpack_require__(2130);

	if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
		exports.colors = [
			20,
			21,
			26,
			27,
			32,
			33,
			38,
			39,
			40,
			41,
			42,
			43,
			44,
			45,
			56,
			57,
			62,
			63,
			68,
			69,
			74,
			75,
			76,
			77,
			78,
			79,
			80,
			81,
			92,
			93,
			98,
			99,
			112,
			113,
			128,
			129,
			134,
			135,
			148,
			149,
			160,
			161,
			162,
			163,
			164,
			165,
			166,
			167,
			168,
			169,
			170,
			171,
			172,
			173,
			178,
			179,
			184,
			185,
			196,
			197,
			198,
			199,
			200,
			201,
			202,
			203,
			204,
			205,
			206,
			207,
			208,
			209,
			214,
			215,
			220,
			221
		];
	}
} catch (error) {
	// Swallow - we only care if `supports-color` is available; it doesn't have to be.
}

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */

exports.inspectOpts = Object.keys(process.env).filter(key => {
	return /^debug_/i.test(key);
}).reduce((obj, key) => {
	// Camel-case
	const prop = key
		.substring(6)
		.toLowerCase()
		.replace(/_([a-z])/g, (_, k) => {
			return k.toUpperCase();
		});

	// Coerce string value into JS value
	let val = process.env[key];
	if (/^(yes|on|true|enabled)$/i.test(val)) {
		val = true;
	} else if (/^(no|off|false|disabled)$/i.test(val)) {
		val = false;
	} else if (val === 'null') {
		val = null;
	} else {
		val = Number(val);
	}

	obj[prop] = val;
	return obj;
}, {});

/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
	return 'colors' in exports.inspectOpts ?
		Boolean(exports.inspectOpts.colors) :
		tty.isatty(process.stderr.fd);
}

/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	const {namespace: name, useColors} = this;

	if (useColors) {
		const c = this.color;
		const colorCode = '\u001B[3' + (c < 8 ? c : '8;5;' + c);
		const prefix = `  ${colorCode};1m${name} \u001B[0m`;

		args[0] = prefix + args[0].split('\n').join('\n' + prefix);
		args.push(colorCode + 'm+' + module.exports.humanize(this.diff) + '\u001B[0m');
	} else {
		args[0] = getDate() + name + ' ' + args[0];
	}
}

function getDate() {
	if (exports.inspectOpts.hideDate) {
		return '';
	}
	return new Date().toISOString() + ' ';
}

/**
 * Invokes `util.format()` with the specified arguments and writes to stderr.
 */

function log(...args) {
	return process.stderr.write(util.format(...args) + '\n');
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	if (namespaces) {
		process.env.DEBUG = namespaces;
	} else {
		// If you set a process.env field to null or undefined, it gets cast to the
		// string 'null' or 'undefined'. Just delete instead.
		delete process.env.DEBUG;
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
	return process.env.DEBUG;
}

/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */

function init(debug) {
	debug.inspectOpts = {};

	const keys = Object.keys(exports.inspectOpts);
	for (let i = 0; i < keys.length; i++) {
		debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
	}
}

module.exports = __webpack_require__(2447)(exports);

const {formatters} = module.exports;

/**
 * Map %o to `util.inspect()`, all on a single line.
 */

formatters.o = function (v) {
	this.inspectOpts.colors = this.useColors;
	return util.inspect(v, this.inspectOpts)
		.split('\n')
		.map(str => str.trim())
		.join(' ');
};

/**
 * Map %O to `util.inspect()`, allowing multiple lines if needed.
 */

formatters.O = function (v) {
	this.inspectOpts.colors = this.useColors;
	return util.inspect(v, this.inspectOpts);
};


/***/ }),

/***/ 2261:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var debug;

module.exports = function () {
  if (!debug) {
    try {
      /* eslint global-require: off */
      debug = __webpack_require__(5158)("follow-redirects");
    }
    catch (error) { /* */ }
    if (typeof debug !== "function") {
      debug = function () { /* */ };
    }
  }
  debug.apply(null, arguments);
};


/***/ }),

/***/ 938:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var url = __webpack_require__(8835);
var URL = url.URL;
var http = __webpack_require__(8605);
var https = __webpack_require__(7211);
var Writable = __webpack_require__(2413).Writable;
var assert = __webpack_require__(2357);
var debug = __webpack_require__(2261);

// Create handlers that pass events from native requests
var events = ["abort", "aborted", "connect", "error", "socket", "timeout"];
var eventHandlers = Object.create(null);
events.forEach(function (event) {
  eventHandlers[event] = function (arg1, arg2, arg3) {
    this._redirectable.emit(event, arg1, arg2, arg3);
  };
});

// Error types with codes
var RedirectionError = createErrorType(
  "ERR_FR_REDIRECTION_FAILURE",
  "Redirected request failed"
);
var TooManyRedirectsError = createErrorType(
  "ERR_FR_TOO_MANY_REDIRECTS",
  "Maximum number of redirects exceeded"
);
var MaxBodyLengthExceededError = createErrorType(
  "ERR_FR_MAX_BODY_LENGTH_EXCEEDED",
  "Request body larger than maxBodyLength limit"
);
var WriteAfterEndError = createErrorType(
  "ERR_STREAM_WRITE_AFTER_END",
  "write after end"
);

// An HTTP(S) request that can be redirected
function RedirectableRequest(options, responseCallback) {
  // Initialize the request
  Writable.call(this);
  this._sanitizeOptions(options);
  this._options = options;
  this._ended = false;
  this._ending = false;
  this._redirectCount = 0;
  this._redirects = [];
  this._requestBodyLength = 0;
  this._requestBodyBuffers = [];

  // Attach a callback if passed
  if (responseCallback) {
    this.on("response", responseCallback);
  }

  // React to responses of native requests
  var self = this;
  this._onNativeResponse = function (response) {
    self._processResponse(response);
  };

  // Perform the first request
  this._performRequest();
}
RedirectableRequest.prototype = Object.create(Writable.prototype);

RedirectableRequest.prototype.abort = function () {
  abortRequest(this._currentRequest);
  this.emit("abort");
};

// Writes buffered data to the current native request
RedirectableRequest.prototype.write = function (data, encoding, callback) {
  // Writing is not allowed if end has been called
  if (this._ending) {
    throw new WriteAfterEndError();
  }

  // Validate input and shift parameters if necessary
  if (!(typeof data === "string" || typeof data === "object" && ("length" in data))) {
    throw new TypeError("data should be a string, Buffer or Uint8Array");
  }
  if (typeof encoding === "function") {
    callback = encoding;
    encoding = null;
  }

  // Ignore empty buffers, since writing them doesn't invoke the callback
  // https://github.com/nodejs/node/issues/22066
  if (data.length === 0) {
    if (callback) {
      callback();
    }
    return;
  }
  // Only write when we don't exceed the maximum body length
  if (this._requestBodyLength + data.length <= this._options.maxBodyLength) {
    this._requestBodyLength += data.length;
    this._requestBodyBuffers.push({ data: data, encoding: encoding });
    this._currentRequest.write(data, encoding, callback);
  }
  // Error when we exceed the maximum body length
  else {
    this.emit("error", new MaxBodyLengthExceededError());
    this.abort();
  }
};

// Ends the current native request
RedirectableRequest.prototype.end = function (data, encoding, callback) {
  // Shift parameters if necessary
  if (typeof data === "function") {
    callback = data;
    data = encoding = null;
  }
  else if (typeof encoding === "function") {
    callback = encoding;
    encoding = null;
  }

  // Write data if needed and end
  if (!data) {
    this._ended = this._ending = true;
    this._currentRequest.end(null, null, callback);
  }
  else {
    var self = this;
    var currentRequest = this._currentRequest;
    this.write(data, encoding, function () {
      self._ended = true;
      currentRequest.end(null, null, callback);
    });
    this._ending = true;
  }
};

// Sets a header value on the current native request
RedirectableRequest.prototype.setHeader = function (name, value) {
  this._options.headers[name] = value;
  this._currentRequest.setHeader(name, value);
};

// Clears a header value on the current native request
RedirectableRequest.prototype.removeHeader = function (name) {
  delete this._options.headers[name];
  this._currentRequest.removeHeader(name);
};

// Global timeout for all underlying requests
RedirectableRequest.prototype.setTimeout = function (msecs, callback) {
  var self = this;

  // Destroys the socket on timeout
  function destroyOnTimeout(socket) {
    socket.setTimeout(msecs);
    socket.removeListener("timeout", socket.destroy);
    socket.addListener("timeout", socket.destroy);
  }

  // Sets up a timer to trigger a timeout event
  function startTimer(socket) {
    if (self._timeout) {
      clearTimeout(self._timeout);
    }
    self._timeout = setTimeout(function () {
      self.emit("timeout");
      clearTimer();
    }, msecs);
    destroyOnTimeout(socket);
  }

  // Stops a timeout from triggering
  function clearTimer() {
    // Clear the timeout
    if (self._timeout) {
      clearTimeout(self._timeout);
      self._timeout = null;
    }

    // Clean up all attached listeners
    self.removeListener("abort", clearTimer);
    self.removeListener("error", clearTimer);
    self.removeListener("response", clearTimer);
    if (callback) {
      self.removeListener("timeout", callback);
    }
    if (!self.socket) {
      self._currentRequest.removeListener("socket", startTimer);
    }
  }

  // Attach callback if passed
  if (callback) {
    this.on("timeout", callback);
  }

  // Start the timer if or when the socket is opened
  if (this.socket) {
    startTimer(this.socket);
  }
  else {
    this._currentRequest.once("socket", startTimer);
  }

  // Clean up on events
  this.on("socket", destroyOnTimeout);
  this.on("abort", clearTimer);
  this.on("error", clearTimer);
  this.on("response", clearTimer);

  return this;
};

// Proxy all other public ClientRequest methods
[
  "flushHeaders", "getHeader",
  "setNoDelay", "setSocketKeepAlive",
].forEach(function (method) {
  RedirectableRequest.prototype[method] = function (a, b) {
    return this._currentRequest[method](a, b);
  };
});

// Proxy all public ClientRequest properties
["aborted", "connection", "socket"].forEach(function (property) {
  Object.defineProperty(RedirectableRequest.prototype, property, {
    get: function () { return this._currentRequest[property]; },
  });
});

RedirectableRequest.prototype._sanitizeOptions = function (options) {
  // Ensure headers are always present
  if (!options.headers) {
    options.headers = {};
  }

  // Since http.request treats host as an alias of hostname,
  // but the url module interprets host as hostname plus port,
  // eliminate the host property to avoid confusion.
  if (options.host) {
    // Use hostname if set, because it has precedence
    if (!options.hostname) {
      options.hostname = options.host;
    }
    delete options.host;
  }

  // Complete the URL object when necessary
  if (!options.pathname && options.path) {
    var searchPos = options.path.indexOf("?");
    if (searchPos < 0) {
      options.pathname = options.path;
    }
    else {
      options.pathname = options.path.substring(0, searchPos);
      options.search = options.path.substring(searchPos);
    }
  }
};


// Executes the next native request (initial or redirect)
RedirectableRequest.prototype._performRequest = function () {
  // Load the native protocol
  var protocol = this._options.protocol;
  var nativeProtocol = this._options.nativeProtocols[protocol];
  if (!nativeProtocol) {
    this.emit("error", new TypeError("Unsupported protocol " + protocol));
    return;
  }

  // If specified, use the agent corresponding to the protocol
  // (HTTP and HTTPS use different types of agents)
  if (this._options.agents) {
    var scheme = protocol.slice(0, -1);
    this._options.agent = this._options.agents[scheme];
  }

  // Create the native request and set up its event handlers
  var request = this._currentRequest =
        nativeProtocol.request(this._options, this._onNativeResponse);
  request._redirectable = this;
  for (var event of events) {
    request.on(event, eventHandlers[event]);
  }

  // RFC7230§5.3.1: When making a request directly to an origin server, […]
  // a client MUST send only the absolute path […] as the request-target.
  this._currentUrl = /^\//.test(this._options.path) ?
    url.format(this._options) :
    // When making a request to a proxy, […]
    // a client MUST send the target URI in absolute-form […].
    this._currentUrl = this._options.path;

  // End a redirected request
  // (The first request must be ended explicitly with RedirectableRequest#end)
  if (this._isRedirect) {
    // Write the request entity and end
    var i = 0;
    var self = this;
    var buffers = this._requestBodyBuffers;
    (function writeNext(error) {
      // Only write if this request has not been redirected yet
      /* istanbul ignore else */
      if (request === self._currentRequest) {
        // Report any write errors
        /* istanbul ignore if */
        if (error) {
          self.emit("error", error);
        }
        // Write the next buffer if there are still left
        else if (i < buffers.length) {
          var buffer = buffers[i++];
          /* istanbul ignore else */
          if (!request.finished) {
            request.write(buffer.data, buffer.encoding, writeNext);
          }
        }
        // End the request if `end` has been called on us
        else if (self._ended) {
          request.end();
        }
      }
    }());
  }
};

// Processes a response from the current native request
RedirectableRequest.prototype._processResponse = function (response) {
  // Store the redirected response
  var statusCode = response.statusCode;
  if (this._options.trackRedirects) {
    this._redirects.push({
      url: this._currentUrl,
      headers: response.headers,
      statusCode: statusCode,
    });
  }

  // RFC7231§6.4: The 3xx (Redirection) class of status code indicates
  // that further action needs to be taken by the user agent in order to
  // fulfill the request. If a Location header field is provided,
  // the user agent MAY automatically redirect its request to the URI
  // referenced by the Location field value,
  // even if the specific status code is not understood.

  // If the response is not a redirect; return it as-is
  var location = response.headers.location;
  if (!location || this._options.followRedirects === false ||
      statusCode < 300 || statusCode >= 400) {
    response.responseUrl = this._currentUrl;
    response.redirects = this._redirects;
    this.emit("response", response);

    // Clean up
    this._requestBodyBuffers = [];
    return;
  }

  // The response is a redirect, so abort the current request
  abortRequest(this._currentRequest);
  // Discard the remainder of the response to avoid waiting for data
  response.destroy();

  // RFC7231§6.4: A client SHOULD detect and intervene
  // in cyclical redirections (i.e., "infinite" redirection loops).
  if (++this._redirectCount > this._options.maxRedirects) {
    this.emit("error", new TooManyRedirectsError());
    return;
  }

  // Store the request headers if applicable
  var requestHeaders;
  var beforeRedirect = this._options.beforeRedirect;
  if (beforeRedirect) {
    requestHeaders = Object.assign({
      // The Host header was set by nativeProtocol.request
      Host: response.req.getHeader("host"),
    }, this._options.headers);
  }

  // RFC7231§6.4: Automatic redirection needs to done with
  // care for methods not known to be safe, […]
  // RFC7231§6.4.2–3: For historical reasons, a user agent MAY change
  // the request method from POST to GET for the subsequent request.
  var method = this._options.method;
  if ((statusCode === 301 || statusCode === 302) && this._options.method === "POST" ||
      // RFC7231§6.4.4: The 303 (See Other) status code indicates that
      // the server is redirecting the user agent to a different resource […]
      // A user agent can perform a retrieval request targeting that URI
      // (a GET or HEAD request if using HTTP) […]
      (statusCode === 303) && !/^(?:GET|HEAD)$/.test(this._options.method)) {
    this._options.method = "GET";
    // Drop a possible entity and headers related to it
    this._requestBodyBuffers = [];
    removeMatchingHeaders(/^content-/i, this._options.headers);
  }

  // Drop the Host header, as the redirect might lead to a different host
  var currentHostHeader = removeMatchingHeaders(/^host$/i, this._options.headers);

  // If the redirect is relative, carry over the host of the last request
  var currentUrlParts = url.parse(this._currentUrl);
  var currentHost = currentHostHeader || currentUrlParts.host;
  var currentUrl = /^\w+:/.test(location) ? this._currentUrl :
    url.format(Object.assign(currentUrlParts, { host: currentHost }));

  // Determine the URL of the redirection
  var redirectUrl;
  try {
    redirectUrl = url.resolve(currentUrl, location);
  }
  catch (cause) {
    this.emit("error", new RedirectionError(cause));
    return;
  }

  // Create the redirected request
  debug("redirecting to", redirectUrl);
  this._isRedirect = true;
  var redirectUrlParts = url.parse(redirectUrl);
  Object.assign(this._options, redirectUrlParts);

  // Drop confidential headers when redirecting to a less secure protocol
  // or to a different domain that is not a superdomain
  if (redirectUrlParts.protocol !== currentUrlParts.protocol &&
     redirectUrlParts.protocol !== "https:" ||
     redirectUrlParts.host !== currentHost &&
     !isSubdomain(redirectUrlParts.host, currentHost)) {
    removeMatchingHeaders(/^(?:authorization|cookie)$/i, this._options.headers);
  }

  // Evaluate the beforeRedirect callback
  if (typeof beforeRedirect === "function") {
    var responseDetails = {
      headers: response.headers,
      statusCode: statusCode,
    };
    var requestDetails = {
      url: currentUrl,
      method: method,
      headers: requestHeaders,
    };
    try {
      beforeRedirect(this._options, responseDetails, requestDetails);
    }
    catch (err) {
      this.emit("error", err);
      return;
    }
    this._sanitizeOptions(this._options);
  }

  // Perform the redirected request
  try {
    this._performRequest();
  }
  catch (cause) {
    this.emit("error", new RedirectionError(cause));
  }
};

// Wraps the key/value object of protocols with redirect functionality
function wrap(protocols) {
  // Default settings
  var exports = {
    maxRedirects: 21,
    maxBodyLength: 10 * 1024 * 1024,
  };

  // Wrap each protocol
  var nativeProtocols = {};
  Object.keys(protocols).forEach(function (scheme) {
    var protocol = scheme + ":";
    var nativeProtocol = nativeProtocols[protocol] = protocols[scheme];
    var wrappedProtocol = exports[scheme] = Object.create(nativeProtocol);

    // Executes a request, following redirects
    function request(input, options, callback) {
      // Parse parameters
      if (typeof input === "string") {
        var urlStr = input;
        try {
          input = urlToOptions(new URL(urlStr));
        }
        catch (err) {
          /* istanbul ignore next */
          input = url.parse(urlStr);
        }
      }
      else if (URL && (input instanceof URL)) {
        input = urlToOptions(input);
      }
      else {
        callback = options;
        options = input;
        input = { protocol: protocol };
      }
      if (typeof options === "function") {
        callback = options;
        options = null;
      }

      // Set defaults
      options = Object.assign({
        maxRedirects: exports.maxRedirects,
        maxBodyLength: exports.maxBodyLength,
      }, input, options);
      options.nativeProtocols = nativeProtocols;

      assert.equal(options.protocol, protocol, "protocol mismatch");
      debug("options", options);
      return new RedirectableRequest(options, callback);
    }

    // Executes a GET request, following redirects
    function get(input, options, callback) {
      var wrappedRequest = wrappedProtocol.request(input, options, callback);
      wrappedRequest.end();
      return wrappedRequest;
    }

    // Expose the properties on the wrapped protocol
    Object.defineProperties(wrappedProtocol, {
      request: { value: request, configurable: true, enumerable: true, writable: true },
      get: { value: get, configurable: true, enumerable: true, writable: true },
    });
  });
  return exports;
}

/* istanbul ignore next */
function noop() { /* empty */ }

// from https://github.com/nodejs/node/blob/master/lib/internal/url.js
function urlToOptions(urlObject) {
  var options = {
    protocol: urlObject.protocol,
    hostname: urlObject.hostname.startsWith("[") ?
      /* istanbul ignore next */
      urlObject.hostname.slice(1, -1) :
      urlObject.hostname,
    hash: urlObject.hash,
    search: urlObject.search,
    pathname: urlObject.pathname,
    path: urlObject.pathname + urlObject.search,
    href: urlObject.href,
  };
  if (urlObject.port !== "") {
    options.port = Number(urlObject.port);
  }
  return options;
}

function removeMatchingHeaders(regex, headers) {
  var lastValue;
  for (var header in headers) {
    if (regex.test(header)) {
      lastValue = headers[header];
      delete headers[header];
    }
  }
  return (lastValue === null || typeof lastValue === "undefined") ?
    undefined : String(lastValue).trim();
}

function createErrorType(code, defaultMessage) {
  function CustomError(cause) {
    Error.captureStackTrace(this, this.constructor);
    if (!cause) {
      this.message = defaultMessage;
    }
    else {
      this.message = defaultMessage + ": " + cause.message;
      this.cause = cause;
    }
  }
  CustomError.prototype = new Error();
  CustomError.prototype.constructor = CustomError;
  CustomError.prototype.name = "Error [" + code + "]";
  CustomError.prototype.code = code;
  return CustomError;
}

function abortRequest(request) {
  for (var event of events) {
    request.removeListener(event, eventHandlers[event]);
  }
  request.on("error", noop);
  request.abort();
}

function isSubdomain(subdomain, domain) {
  const dot = subdomain.length - domain.length - 1;
  return dot > 0 && subdomain[dot] === "." && subdomain.endsWith(domain);
}

// Exports
module.exports = wrap({ http: http, https: https });
module.exports.wrap = wrap;


/***/ }),

/***/ 6560:
/***/ ((module) => {

"use strict";


module.exports = (flag, argv = process.argv) => {
	const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
	const position = argv.indexOf(prefix + flag);
	const terminatorPosition = argv.indexOf('--');
	return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
};


/***/ }),

/***/ 7824:
/***/ ((module) => {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}


/***/ }),

/***/ 1895:
/***/ ((module) => {

module.exports = function pointInPolygonFlat (point, vs, start, end) {
    var x = point[0], y = point[1];
    var inside = false;
    if (start === undefined) start = 0;
    if (end === undefined) end = vs.length;
    var len = (end-start)/2;
    for (var i = 0, j = len - 1; i < len; j = i++) {
        var xi = vs[start+i*2+0], yi = vs[start+i*2+1];
        var xj = vs[start+j*2+0], yj = vs[start+j*2+1];
        var intersect = ((yi > y) !== (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
};


/***/ }),

/***/ 6960:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var pointInPolygonFlat = __webpack_require__(1895)
var pointInPolygonNested = __webpack_require__(8139)

module.exports = function pointInPolygon (point, vs, start, end) {
    if (vs.length > 0 && Array.isArray(vs[0])) {
        return pointInPolygonNested(point, vs, start, end);
    } else {
        return pointInPolygonFlat(point, vs, start, end);
    }
}
module.exports.nested = pointInPolygonNested
module.exports.flat = pointInPolygonFlat


/***/ }),

/***/ 8139:
/***/ ((module) => {

// ray-casting algorithm based on
// https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html

module.exports = function pointInPolygonNested (point, vs, start, end) {
    var x = point[0], y = point[1];
    var inside = false;
    if (start === undefined) start = 0;
    if (end === undefined) end = vs.length;
    var len = end - start;
    for (var i = 0, j = len - 1; i < len; j = i++) {
        var xi = vs[i+start][0], yi = vs[i+start][1];
        var xj = vs[j+start][0], yj = vs[j+start][1];
        var intersect = ((yi > y) !== (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
};


/***/ }),

/***/ 2130:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const os = __webpack_require__(2087);
const tty = __webpack_require__(3867);
const hasFlag = __webpack_require__(6560);

const {env} = process;

let flagForceColor;
if (hasFlag('no-color') ||
	hasFlag('no-colors') ||
	hasFlag('color=false') ||
	hasFlag('color=never')) {
	flagForceColor = 0;
} else if (hasFlag('color') ||
	hasFlag('colors') ||
	hasFlag('color=true') ||
	hasFlag('color=always')) {
	flagForceColor = 1;
}

function envForceColor() {
	if ('FORCE_COLOR' in env) {
		if (env.FORCE_COLOR === 'true') {
			return 1;
		}

		if (env.FORCE_COLOR === 'false') {
			return 0;
		}

		return env.FORCE_COLOR.length === 0 ? 1 : Math.min(Number.parseInt(env.FORCE_COLOR, 10), 3);
	}
}

function translateLevel(level) {
	if (level === 0) {
		return false;
	}

	return {
		level,
		hasBasic: true,
		has256: level >= 2,
		has16m: level >= 3
	};
}

function supportsColor(haveStream, {streamIsTTY, sniffFlags = true} = {}) {
	const noFlagForceColor = envForceColor();
	if (noFlagForceColor !== undefined) {
		flagForceColor = noFlagForceColor;
	}

	const forceColor = sniffFlags ? flagForceColor : noFlagForceColor;

	if (forceColor === 0) {
		return 0;
	}

	if (sniffFlags) {
		if (hasFlag('color=16m') ||
			hasFlag('color=full') ||
			hasFlag('color=truecolor')) {
			return 3;
		}

		if (hasFlag('color=256')) {
			return 2;
		}
	}

	if (haveStream && !streamIsTTY && forceColor === undefined) {
		return 0;
	}

	const min = forceColor || 0;

	if (env.TERM === 'dumb') {
		return min;
	}

	if (process.platform === 'win32') {
		// Windows 10 build 10586 is the first Windows release that supports 256 colors.
		// Windows 10 build 14931 is the first release that supports 16m/TrueColor.
		const osRelease = os.release().split('.');
		if (
			Number(osRelease[0]) >= 10 &&
			Number(osRelease[2]) >= 10586
		) {
			return Number(osRelease[2]) >= 14931 ? 3 : 2;
		}

		return 1;
	}

	if ('CI' in env) {
		if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI', 'GITHUB_ACTIONS', 'BUILDKITE', 'DRONE'].some(sign => sign in env) || env.CI_NAME === 'codeship') {
			return 1;
		}

		return min;
	}

	if ('TEAMCITY_VERSION' in env) {
		return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
	}

	if (env.COLORTERM === 'truecolor') {
		return 3;
	}

	if ('TERM_PROGRAM' in env) {
		const version = Number.parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

		switch (env.TERM_PROGRAM) {
			case 'iTerm.app':
				return version >= 3 ? 3 : 2;
			case 'Apple_Terminal':
				return 2;
			// No default
		}
	}

	if (/-256(color)?$/i.test(env.TERM)) {
		return 2;
	}

	if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
		return 1;
	}

	if ('COLORTERM' in env) {
		return 1;
	}

	return min;
}

function getSupportLevel(stream, options = {}) {
	const level = supportsColor(stream, {
		streamIsTTY: stream && stream.isTTY,
		...options
	});

	return translateLevel(level);
}

module.exports = {
	supportsColor: getSupportLevel,
	stdout: getSupportLevel({isTTY: tty.isatty(1)}),
	stderr: getSupportLevel({isTTY: tty.isatty(2)})
};


/***/ }),

/***/ 1603:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";

// EXTERNAL MODULE: ./node_modules/@crowdin/ota-client/out/index.js
var out = __webpack_require__(8703);
var out_default = /*#__PURE__*/__webpack_require__.n(out);
;// CONCATENATED MODULE: ./src/utils/fetch.ts
function gm_fetch(props) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest(Object.assign(Object.assign({}, props), { onload(response) {
                if (response.status >= 200 && response.status < 300) {
                    resolve(response);
                }
                else {
                    reject(response);
                }
            },
            onerror(response) {
                reject(response);
                fetch;
            } }));
    });
}

;// CONCATENATED MODULE: ./src/localization/fallback.json
const fallback_namespaceObject = JSON.parse('{"edit":{"big_junction":{"transform_geometry_to_roundabout":"Clone roundabout geometry","clone":{"copy":"Save junction box properties","paste":"Import junction box properties","override_copied_data_confirm":"There are other properties that have been saved.\\nDo you want to overwrite them?","save_confirmation":"There are junction box properties that have not been loaded yet.","errors":{"segments_with_turn_instructions":"The junction box has turn instructions set.","junction_box_is_locked":"Your level isn\'t high enough for editing this junction box.","junction_box_already_cloned":"This junction box was saved. It can be safely removed from the map.","missing_path_segments":"The segments inside this junction box are different from those inside the junction box you saved. Make sure you didn\'t add new segments or deleted old ones.","extra_entrances_or_exits":"There are some new entrances or exits that are not in the junction box you saved.","junction_box_has_no_changes":"There are no changes to the junction box from the latest saved state.","no_junction_box_available":"There aren\'t saved properties that can be loaded."}}},"roundabout":{"normalize_turns_at":"Normalize exits at node %{nodeName}","normalize_tooltips":{"not_connected_to_junction_box":"This node isn\'t connected to a junction box.","too_many_exits":"There are too many exits for the chosen entrance."}}},"save":{"changes_log":{"actions":{"BigJunctionGeometryTransformedToRoundabout":"Roundabout geometry has been cloned to a junction box","PasteBigJunctionProperties":"Imported junction box properties","NormalizeRoundaboutTurns":"Updated %{count} roundabout exits"}}},"user":{"prefs":{"title":"[Script] Roundabout JB","auto_round_jb":"Auto clone roundabout geometry","nomalize_badge_style":{"label":"Badges","icons":"Graphics","chars":"Characters","count_exits":{"label":"Count exits badge","numbers":"Numbers","question_mark":"Icon","numbers_tooltip":"9+ exits will always show question marks"}}}}}');
;// CONCATENATED MODULE: ./src/localization/index.ts
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



class Translations {
    constructor(locale) {
        this._translations = { "": fallback_namespaceObject };
        this.defaultLocale = "en";
        this.fallbackLocale = "";
        this.separatorChar = ".";
        this._locale = locale;
        this.otaClient = new (out_default())('a891bc24af0f9f9a9d02088031c', {
            httpClient: {
                get(url) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield gm_fetch({
                            method: 'GET',
                            url,
                            responseType: 'json'
                        });
                    });
                },
            }
        });
    }
    get locale() {
        return this._locale;
    }
    get translations() {
        return this._translations;
    }
    localeExists(locale) {
        return !!this.translations[locale];
    }
    getLocaleOrDefault(locale) {
        return this.localeExists(locale) ? locale : this.defaultLocale;
    }
    translateByLocale(locale, keys, args) {
        // get the translations for the current locale, and using recursion dive into the nested keys
        let localeTranslations = this.translations[locale];
        for (let i = 0; i < keys.length; i++) {
            localeTranslations = localeTranslations[keys[i]];
            // if the translation doesn't exist, return the key as the translation
            if (!localeTranslations) {
                return null;
            }
        }
        if (typeof localeTranslations !== "string" || localeTranslations.length === 0)
            return null;
        // replace the placeholders in the translation with the arguments
        if (!args)
            return localeTranslations;
        for (const key in args) {
            if (args.hasOwnProperty(key)) {
                localeTranslations = localeTranslations.replace(`%{${key}}`, args[key]);
            }
        }
        return localeTranslations;
    }
    translate(key, args) {
        // separate the key by the separator char
        const keys = key.split(this.separatorChar);
        return this.translateByLocale(this.locale, keys, args) || this.translateByLocale(this.defaultLocale, keys, args) || this.translateByLocale(this.fallbackLocale, keys, args) || keys[keys.length - 1];
    }
    downloadTranslations() {
        return __awaiter(this, void 0, void 0, function* () {
            // we can download only the current locale and the default locale
            const languages = [this.locale, this.defaultLocale];
            // for each language in the list, download the translations
            const translations = {};
            yield Promise.all(languages.map((language) => __awaiter(this, void 0, void 0, function* () {
                const translation = yield this.otaClient.getFileTranslations('/roundabout-jb.json', language);
                translations[language] = translation;
            })));
            this._translations = Object.assign(Object.assign({}, this.translations), translations);
            this._locale = this.getLocaleOrDefault(this.locale);
            // log that we downloaded the translations
            console.log(`[Roundabout JB] Downloaded translations for the script`);
        });
    }
}
/* harmony default export */ const localization = (Translations);

;// CONCATENATED MODULE: ./src/prefs.tsx


const getPrefsSidebarTab = (() => {
  let cached = null;
  return () => {
    return cached ??= unsafeWindow.$("#sidepanel-prefs.tab-pane .settings")[0];
  };
})();

let uniqueNameIncrementer = 0;

function uniqueControlName(key) {
  return `${modules_script_key}-${key}-${++uniqueNameIncrementer}`;
}

const scriptPrefsStorage = (() => {
  const object = JSON.parse(unsafeWindow.localStorage.getItem("r0den.scripts.roundabout-jb.prefs")) || {};

  function nestedGet(obj, keys) {
    for (const key of keys) {
      obj = obj[key];

      if (!obj) {
        return null;
      }
    }

    return obj;
  }

  function get(key, defaultValue = null) {
    return nestedGet(object, key.split(".")) ?? defaultValue;
  }

  function set(key, value) {
    const keys = key.split(".");
    const obj = nestedGet(object, keys.slice(0, -1));
    obj[keys[keys.length - 1]] = value;
    unsafeWindow.localStorage.setItem("r0den.scripts.roundabout-jb.prefs", JSON.stringify(object));
  }

  return {
    get,
    set,
    initialize: (key, defaultValue) => {
      if (get(key) === null) {
        set(key, defaultValue);
      }
    }
  };
})();
/* harmony default export */ const prefs = (() => addEventListener("wmeload", () => {
  const FormGroup = ({
    children
  }) => {
    return jsxCreateElement("div", {
      className: "form-group"
    }, children);
  };

  const CheckboxOption = ({
    label,
    key,
    onchange,
    defaultValue
  }) => {
    if (defaultValue !== undefined) scriptPrefsStorage.initialize(key, defaultValue);
    const id = uniqueControlName(key);

    const changeHandler = selected => {
      scriptPrefsStorage.set(key, selected);
      onchange && onchange(selected);
    };

    return jsxCreateElement("div", {
      className: "controls-container"
    }, jsxCreateElement("input", {
      type: "checkbox",
      id: id,
      name: key,
      value: "on",
      checked: !!scriptPrefsStorage.get(key),
      onChange: e => changeHandler(e.target.checked)
    }), jsxCreateElement("label", {
      htmlFor: id
    }, label));
  };

  const Radio = ({
    label,
    key,
    values,
    onchange,
    defaultValue,
    labelProvider,
    tooltipProvider
  }) => {
    // initialize the storage if it doesn't exist and the defaultValue is set
    if (defaultValue !== undefined) scriptPrefsStorage.initialize(key, defaultValue);
    const id = uniqueControlName(key);

    const changeHandler = selected => {
      scriptPrefsStorage.set(key, selected);
      onchange && onchange(selected);
    };

    const options = {};

    if (Array.isArray(values)) {
      // if the labelProvider is not set, use the values as labels
      if (labelProvider === undefined) {
        labelProvider = optionKey => optionKey;
      }

      values.forEach(value => {
        options[value] = {
          label: labelProvider(value)
        };
      });
    } else if (typeof labelProvider === "function") {
      Object.entries(values).forEach(([value]) => {
        options[value] = {
          label: labelProvider(value)
        };
      });
    } // convert every option to an object with a label and a tooltip


    for (const key in options) {
      if (options[key].hasOwnProperty("label")) {
        options[key].tooltip = tooltipProvider?.(key);
        continue;
      }

      options[key] = {
        label: options[key],
        tooltip: tooltipProvider?.(key) ?? null
      };
    }

    return jsxCreateElement(FormGroup, null, jsxCreateElement("div", {
      className: "controls"
    }, jsxCreateElement("label", {
      className: "control-label"
    }, label), jsxCreateElement("div", {
      className: "btn-group waze-radio-container"
    }, Object.entries(options).map(([value, {
      label,
      tooltip
    }]) => jsxCreateElement("fragment", null, jsxCreateElement("input", {
      type: "radio",
      id: `${id}-${value}`,
      name: key,
      value: value,
      checked: scriptPrefsStorage.get(key) === value,
      onChange: e => changeHandler(e.target.value)
    }), jsxCreateElement("label", {
      htmlFor: `${id}-${value}`
    }, label, tooltip && jsxCreateElement("fragment", null, " ", jsxCreateElement("i", {
      className: "waze-tooltip",
      wmeTooltip: {
        label: tooltip,
        placement: "bottom"
      }
    }))))))));
  };

  appendJsxTo(getPrefsSidebarTab(), jsxCreateElement("fragment", null, jsxCreateElement("h6", null, I18n.translate("user.prefs.title")), jsxCreateElement("form", {
    className: "attributes-form side-panel-section"
  }, jsxCreateElement(FormGroup, null, jsxCreateElement(CheckboxOption, {
    key: "auto_round_jb",
    defaultValue: true,
    label: I18n.translate("user.prefs.auto_round_jb")
  })), jsxCreateElement(Radio, {
    defaultValue: "icons",
    label: I18n.translate("user.prefs.nomalize_badge_style.label"),
    labelProvider: key => I18n.translate(`user.prefs.nomalize_badge_style.${key}`),
    values: ["icons", "chars"],
    key: "normalize_badge_style"
  }), jsxCreateElement(Radio, {
    key: "normalize_badge_style_count",
    defaultValue: "numbers",
    label: I18n.translate("user.prefs.nomalize_badge_style.count_exits.label"),
    labelProvider: key => I18n.translate(`user.prefs.nomalize_badge_style.count_exits.${key}`),
    values: ["question_mark", "numbers"],
    tooltipProvider: key => key === "numbers" ? I18n.translate("user.prefs.nomalize_badge_style.count_exits.numbers_tooltip") : null
  }))));
}));
;// CONCATENATED MODULE: ./src/utils/JSXHooks.ts
function useRef(initialValue) {
    return {
        current: initialValue
    };
}
function useMultiRef(initialValues) {
    const obj = {};
    for (const key in initialValues) {
        obj[key] = initialValues[key];
    }
    return obj;
}
// returns: [ stateCallback, setState, resetStateCallbacks, getState ]
function useState(initialState) {
    const state = useRef(initialState);
    const stateCallbacks = useRef([]);
    const setState = (newState) => {
        state.current = newState;
        stateCallbacks.current.forEach(callback => callback(newState));
    };
    const addCallback = (callback) => {
        stateCallbacks.current.push(callback);
        // first time call the callback
        callback(state.current);
    };
    const resetStateCallbacks = () => {
        stateCallbacks.current = [];
    };
    const getState = () => state.current;
    return [addCallback, setState, resetStateCallbacks, getState];
}

;// CONCATENATED MODULE: ./src/utils/Segments.ts
function ExtractRoundaboutPerimeterPolygon(junctionID, transformer) {
    if (unsafeWindow.W.model.junctions.objects.hasOwnProperty(junctionID) == false)
        return null;
    var segIDs = unsafeWindow.W.model.junctions.getObjectById(junctionID).attributes.segIDs;
    if (segIDs.length == 0)
        return null;
    var i = 0;
    while (i < segIDs.length && unsafeWindow.W.model.segments.objects.hasOwnProperty(segIDs[i]) == false)
        i++;
    if (i == segIDs.length)
        return null;
    var seg = unsafeWindow.W.model.segments.getObjectById(segIDs[i]);
    var firstSegID = segIDs[i];
    var polyPoints = new Array();
    var finished = false;
    while (!finished) {
        var followNode = null;
        var vertices = seg.geometry.getVertices();
        if (seg.attributes.fwdDirection) {
            for (var j = 0; j < vertices.length - 1; j++)
                polyPoints.push(vertices[j].clone());
            followNode = unsafeWindow.W.model.nodes.getObjectById(seg.attributes.toNodeID);
        }
        else {
            for (var j = vertices.length - 1; j > 0; j--)
                polyPoints.push(vertices[j].clone());
            followNode = unsafeWindow.W.model.nodes.getObjectById(seg.attributes.fromNodeID);
        }
        var nextSeg = null;
        for (var j = 0; j < followNode.attributes.segIDs.length; j++) {
            nextSeg = unsafeWindow.W.model.segments.getObjectById(followNode.attributes.segIDs[j]);
            if (nextSeg.attributes.id == seg.attributes.id)
                continue;
            if (nextSeg.attributes.junctionID == null || nextSeg.attributes.junctionID != junctionID)
                continue;
            if (nextSeg.attributes.id == firstSegID) {
                finished = true;
                break;
            }
            break;
        }
        if (!finished && nextSeg.attributes.id == seg.attributes.id) {
            return null;
        }
        seg = nextSeg;
    }
    let ring = new unsafeWindow.OpenLayers.Geometry.LinearRing(polyPoints);
    if (transformer) {
        let tmpRing = transformer(ring);
        if (tmpRing)
            ring = tmpRing;
    }
    var polygon = new unsafeWindow.OpenLayers.Geometry.Polygon(ring);
    polygon.calculateBounds();
    return polygon;
}
function getListOfUniqueNodesBySegments(segIDs) {
    var nodeIDs = new Array();
    for (var i = 0; i < segIDs.length; i++) {
        var seg = unsafeWindow.W.model.segments.getObjectById(segIDs[i]);
        var fromNodeID = seg.attributes.fromNodeID;
        var toNodeID = seg.attributes.toNodeID;
        if (nodeIDs.indexOf(fromNodeID) == -1)
            nodeIDs.push(fromNodeID);
        if (nodeIDs.indexOf(toNodeID) == -1)
            nodeIDs.push(toNodeID);
    }
    return nodeIDs;
}
function canEditTurnGuidance(segment) {
    const country = segment.getAddress().getCountry().attributes;
    const currentUserRank = unsafeWindow.W.loginManager.user.getRank();
    const editGuidanceRank = country.allowEditingTurnGuidanceRank;
    return currentUserRank >= editGuidanceRank;
}
function getSegmentFromVertex(vertex) {
    const segmentId = vertex.getSegmentID();
    const segment = unsafeWindow.W.model.segments.getObjectById(segmentId);
    return segment;
}

// EXTERNAL MODULE: ./node_modules/point-in-polygon/index.js
var point_in_polygon = __webpack_require__(6960);
var point_in_polygon_default = /*#__PURE__*/__webpack_require__.n(point_in_polygon);
;// CONCATENATED MODULE: ./src/utils/JunctionBox.ts


let getVertexClass = (function () {
    let _vertexClass = null;
    return function () {
        if (_vertexClass === null) {
            _vertexClass = unsafeWindow.require("Waze/Model/Graph/Vertex");
        }
        return _vertexClass;
    };
})();
function getSelectedJunctionBox() {
    let selectedFeatures = unsafeWindow.W.selectionManager.getSelectedFeatures();
    // check if there is a selected feature (for a junction box you can select only one)
    if (selectedFeatures.length === 0)
        return null;
    let selectedFeature = selectedFeatures[0].model;
    if (selectedFeature.type !== "bigJunction")
        return null;
    return selectedFeature;
}
function isJunctionBoxLocked(jb) {
    let jbRank = jb.attributes.rank;
    let userRank = unsafeWindow.W.loginManager.user.rank;
    return jbRank > userRank;
}
function getJunctionBoxSegments(jb) {
    const isSegmentNodeInsideJunctionBox = (segment, direction) => {
        // if the {direction}Crossroads array contains the jb id, then the segment node is inside the junction box
        const crossroadsKey = `${direction}Crossroads`;
        const crossroads = segment.attributes[crossroadsKey];
        if (crossroads.includes(jb.getID()))
            return true;
        // if the {direction}Crossroads array does not contain the jb id,
        // then check if the {direction}Node is inside the junction box polygon
        const nodeKey = `${direction}NodeID`;
        const nodeID = segment.attributes[nodeKey];
        const node = unsafeWindow.W.model.nodes.getObjectById(nodeID);
        const polygon = jb.attributes.geometry.components[0].components.map((c) => [c.x, c.y]); // todo replace the c type with OpenLayers
        const point = [node.attributes.geometry.x, node.attributes.geometry.y];
        return point_in_polygon_default()(point, polygon);
    };
    const uniqueNodes = getListOfUniqueNodesBySegments(jb.attributes.segIDs);
    const segmentIds = uniqueNodes.flatMap(id => unsafeWindow.W.model.nodes.getObjectById(id).attributes.segIDs);
    const uniqueSegmentIds = segmentIds.filter((value, index, self) => self.indexOf(value) === index);
    const uniqueSegments = uniqueSegmentIds.map(id => unsafeWindow.W.model.segments.getObjectById(id));
    const jbSegments = uniqueSegments.reduce((data, segment) => {
        const fwdAllowed = segment.attributes.fwdDirection;
        const revAllowed = segment.attributes.revDirection;
        const fwdInside = isSegmentNodeInsideJunctionBox(segment, 'to');
        const revInside = isSegmentNodeInsideJunctionBox(segment, 'from');
        // if both fwdInside and revInside are true, then the segment is inside the junction box
        if (fwdInside && revInside) {
            data.inside.push(segment);
            return data;
        }
        // the segment in an entry if fwd allowed and fwd inside, or if rev allowed and rev inside
        if ((fwdAllowed && fwdInside) || (revAllowed && revInside)) {
            data.entries.push(segment);
            const node = fwdAllowed && fwdInside ? "forward" : "reverse";
            data.entriesNodes[segment.getID()] = node;
            return data;
        }
        // the segment is an exit if fwdAllowed and revInside are true, or revAllowed and fwdInside are true
        if ((fwdAllowed && revInside) || (revAllowed && fwdInside)) {
            data.exits.push(segment);
            const node = fwdAllowed && revInside ? "forward" : "reverse";
            data.exitsNodes[segment.getID()] = node;
            return data;
        }
    }, {
        entries: [],
        exits: [],
        inside: [],
        entriesNodes: {},
        exitsNodes: {}
    });
    // exclude the jb entries that don't pass throguh the junction box
    jbSegments.entries = jbSegments.entries.filter((segment) => {
        const direction = jbSegments.entriesNodes[segment.getID()];
        const vertexGenerator = direction === "forward" ? getVertexClass().forwardOf : getVertexClass().reverseOf;
        const vertex = vertexGenerator(segment.getID());
        const allowedTurns = unsafeWindow.W.model.turnGraph.getTurnsFrom(vertex);
        // valid entry is set to true if any of the allowed turns pass through the junction box (it means the toVertex.segmentID is inside the junction box)
        const validEntry = allowedTurns.some((turn) => jbSegments.inside.some((segment) => segment.getID() === turn.toVertex.segmentID));
        // if the entry is not valid, then remove the entry node from the junction box
        if (!validEntry) {
            delete jbSegments.entriesNodes[segment.getID()];
        }
        return validEntry;
    });
    return jbSegments;
}
function isJunctionBoxWrappingRoundabout(jb) {
    return !jb.attributes.segIDs.some((sid) => !unsafeWindow.W.model.segments.getObjectById(sid).isInRoundabout());
}
function getJunctionBoxTurnsFrom(jb, segment, direction) {
    const vertexGenerator = direction === "forward" ? getVertexClass().forwardOf : getVertexClass().reverseOf;
    const vertex = vertexGenerator(segment.getID());
    return jb.getTurnsFrom(vertex);
}
function getAllTurnsInJunctionBox(jb, jbSegments) {
    // default entry segments to (junction box segments).entrances
    jbSegments = jbSegments || getJunctionBoxSegments(jb);
    // get all the turns in the junction box
    // for each entry segment get the vertex (entriesNodes[segment.getID()] + "Of")(segment.getID()) and use the jb.getTurnsFrom(vertex) to get all turns
    // return an flattened array of all the turns
    return jbSegments.entries.flatMap((segment) => {
        const direction = jbSegments.entriesNodes[segment.getID()];
        return getJunctionBoxTurnsFrom(jb, segment, direction);
    });
}

;// CONCATENATED MODULE: ./src/utils/selection.ts
function getWazeObjectFromSelection(selection) {
    if (selection._wmeObject)
        return selection._wmeObject;
    return null;
}

;// CONCATENATED MODULE: ./src/roundabout/convertGeometry.tsx





let cachedConverters = {};
let tmpFunc = null;
const [onTransformToRoundaboutButtonDisabledChange, setTransformToRoundaboutButtonDisabled, resetTransformRoundaboutButtonDisabledState] = useState(false);

function beforeActionCallback({
  action
}) {
  // ignore if type is not bigJunction
  if (!action.hasOwnProperty("bigJunction")) return;

  tmpFunc = function transform() {
    let jID = unsafeWindow.W.model.segments.getObjectById(action.bigJunction.attributes.segIDs[0]).attributes.junctionID;
    if (jID == null) return;
    let polygon = ExtractRoundaboutPerimeterPolygon(jID, ring => ring.resize(1.2, ring.getCentroid()));
    if (polygon == null) return;
    let newAction = new BigJunctionGeometryTransformedToRoundabout(action.bigJunction.attributes.geometry, polygon, action, () => {
      cachedConverters[action.bigJunction.getID()] = true;
      setTransformToRoundaboutButtonDisabled(true);
    }, () => {
      cachedConverters[action.bigJunction.getID()] = transform;
      setTransformToRoundaboutButtonDisabled(false);
    });
    unsafeWindow.W.model.actionManager.add(newAction);
    return true;
  };
}

function afterActionCallback({
  action
}) {
  if (!tmpFunc || !action.hasOwnProperty("bigJunction")) return; // check if the jb id is less than 0 (means it is a new jb) and all segments are in a roundabout

  if (action.bigJunction.getID() < 0 && isJunctionBoxWrappingRoundabout(action.bigJunction)) {
    if (cachedConverters[action.bigJunction.getID()] !== true) {
      cachedConverters[action.bigJunction.getID()] = tmpFunc;
      const autoRound = !!scriptPrefsStorage.get("auto_round_jb");
      if (autoRound) tmpFunc();
    }

    tmpFunc = null;
  }
}

function selectedFeaturesChangedCallback(event) {
  const selected = event.detail.selected;
  resetTransformRoundaboutButtonDisabledState(); // if no selected features, then we don't need to do anything

  if (selected.length == 0) return; // check if the selected model type is bigJunction

  if (getWazeObjectFromSelection(selected[0]).type != "bigJunction") return; // check in the attributes if the junction id is less than 0, which means the JB is not yet created and can be manipulated
  // if the JB cannot be manipulated, we can't do anything and we return

  if (getWazeObjectFromSelection(selected[0]).attributes.junctionID >= 0) return;
  let converter = cachedConverters[getWazeObjectFromSelection(selected[0]).attributes.id];
  if (typeof converter === "undefined") return; // get the junction actions DOM element

  const buttonRef = useRef(null);

  const buttonClickHandler = () => {
    cachedConverters[getWazeObjectFromSelection(selected[0]).attributes.id](); // converter may be cached with a function or true

    setTransformToRoundaboutButtonDisabled(true);
  };

  setTimeout(() => {
    appendJsxTo(document.getElementById("big-junction-edit-general").getElementsByClassName("junction-actions")[0], jsxCreateElement("button", {
      ref: buttonRef,
      className: "action-button select-short-segments waze-btn waze-btn-smaller waze-btn-white",
      disabled: converter === true,
      onClick: buttonClickHandler
    }, I18n.translate("edit.big_junction.transform_geometry_to_roundabout")));
    onTransformToRoundaboutButtonDisabledChange(newState => {
      buttonRef.current.disabled = newState;
    });
  }, 10);
}

/* harmony default export */ const convertGeometry = (() => addEventListener("wmeload", () => {
  unsafeWindow.W.model.actionManager.events.on("beforeaction", beforeActionCallback);
  unsafeWindow.W.model.actionManager.events.on("afteraction", afterActionCallback);
  unsafeWindow.W.selectionManager.events.on("selectionchanged", selectedFeaturesChangedCallback);
}));
;// CONCATENATED MODULE: ./src/jb-cloner/index.tsx





var CanJunctionBoxBeCloned;

(function (CanJunctionBoxBeCloned) {
  CanJunctionBoxBeCloned[CanJunctionBoxBeCloned["Yes"] = 0] = "Yes";
  CanJunctionBoxBeCloned[CanJunctionBoxBeCloned["JunctionBoxIsLocked"] = 1] = "JunctionBoxIsLocked";
  CanJunctionBoxBeCloned[CanJunctionBoxBeCloned["SomeTurnsHaveInstructions"] = 2] = "SomeTurnsHaveInstructions";
  CanJunctionBoxBeCloned[CanJunctionBoxBeCloned["JunctionBoxAlreadyCloned"] = 3] = "JunctionBoxAlreadyCloned";
})(CanJunctionBoxBeCloned || (CanJunctionBoxBeCloned = {}));

var CanJunctionBoxBePasted;

(function (CanJunctionBoxBePasted) {
  CanJunctionBoxBePasted[CanJunctionBoxBePasted["Yes"] = 0] = "Yes";
  CanJunctionBoxBePasted[CanJunctionBoxBePasted["JunctionBoxIsLocked"] = 1] = "JunctionBoxIsLocked";
  CanJunctionBoxBePasted[CanJunctionBoxBePasted["ExtraEntrancesOrExits"] = 2] = "ExtraEntrancesOrExits";
  CanJunctionBoxBePasted[CanJunctionBoxBePasted["MissingPathSegments"] = 3] = "MissingPathSegments";
  CanJunctionBoxBePasted[CanJunctionBoxBePasted["NoChangesBetweenStates"] = 4] = "NoChangesBetweenStates";
  CanJunctionBoxBePasted[CanJunctionBoxBePasted["NoJunctionBoxPropertiesAvailable"] = 5] = "NoJunctionBoxPropertiesAvailable";
})(CanJunctionBoxBePasted || (CanJunctionBoxBePasted = {}));

let copiedJunctionBox = null;
const [onCopyButtonStateUpdate, setCopyButtonState, resetCopyState, copyButtonState] = useState(CanJunctionBoxBeCloned.Yes);
const [onPasteButtonStateUpdate, setPasteButtonState, resetPasteState, pasteButtonState] = useState(CanJunctionBoxBePasted.Yes);

function checkCanJunctionBoxBeCloned(junctionBox, turns) {
  // TODO change junction box to the desired type once it is defined
  // check if the junction box is locked
  if (junctionBox.attributes.rank > unsafeWindow.W.loginManager.user.rank) return CanJunctionBoxBeCloned.JunctionBoxIsLocked; // check if some of the junction box turns have guidance and if so can the user edit them
  // const invalidSeg = turns.find(turn => turn.turnData.turnGuidance !== null && !canEditTurnGuidance(getSegmentFromVertex(turn.toVertex)));
  // if (invalidSeg) console.warn('This segment has turn guidance you can\'t edit', invalidSeg);

  if (turns.some(turn => turn.turnData.turnGuidance !== null && !canEditTurnGuidance(getSegmentFromVertex(turn.toVertex)))) return CanJunctionBoxBeCloned.SomeTurnsHaveInstructions; // by default we can clone the junction box

  return CanJunctionBoxBeCloned.Yes;
}

function checkCanJunctionBoxBePasted(junctionBox, segments) {
  // TODO change junction box to the desired type once it is defined
  if (copiedJunctionBox == null) return CanJunctionBoxBePasted.NoJunctionBoxPropertiesAvailable; // check if the junction box is locked

  if (junctionBox.attributes.rank > unsafeWindow.W.loginManager.user.rank) return CanJunctionBoxBePasted.JunctionBoxIsLocked; // if the junction box segIDs attribute array doesn't match (I mean some of the segments in the old jb doesn't exist in the new one)
  // the copied junction box inside segments array, then we have a missing path segment error

  if (junctionBox.attributes.segIDs.length !== copiedJunctionBox.meta.inside.length || copiedJunctionBox.meta.inside.filter(seg => !junctionBox.attributes.segIDs.includes(seg.getID())).length > 0) return CanJunctionBoxBePasted.MissingPathSegments; // check for extra entrances or exits (if there is any new id in entrances or exits thats mean that there is an extra entrance or exit)

  if (segments.entries.length !== copiedJunctionBox.meta.entries.length && segments.entries.filter(entrance => !copiedJunctionBox.meta.entries.includes(entrance)).length > 0) return CanJunctionBoxBePasted.ExtraEntrancesOrExits;
  if (segments.exits.length !== copiedJunctionBox.meta.exits.length && segments.exits.filter(exit => !copiedJunctionBox.meta.exits.includes(exit)).length > 0) return CanJunctionBoxBePasted.ExtraEntrancesOrExits; // TODO check if the junction box has any changes between the old and new junction box (if there is any change, then we have a no changes between states error)
  // by default we can paste the junction box

  return CanJunctionBoxBePasted.Yes;
}

function getJunctionBoxData(jb) {
  // TODO change junction box to the desired type once it is defined
  // get the segments of the selected junction box
  const segments = getJunctionBoxSegments(jb);
  const turns = getAllTurnsInJunctionBox(jb, segments); // check if the junction box can be cloned

  const canCloneResult = checkCanJunctionBoxBeCloned(jb, turns);
  const canPasteResult = checkCanJunctionBoxBePasted(jb, segments); // set the states

  setCopyButtonState(canCloneResult);
  setPasteButtonState(canPasteResult);
  return {
    canCloneResult,
    canPasteResult,
    turns,
    segments
  };
}

function jb_cloner_selectedFeaturesChangedCallback(event) {
  const selected = event.detail.selected;
  resetCopyState();
  resetPasteState(); // if no selected features, then we don't need to do anything

  if (selected.length == 0) return; // check if the selected model type is bigJunction

  if (getWazeObjectFromSelection(selected[0]).type != "bigJunction") return;
  let {
    turns,
    segments
  } = getJunctionBoxData(getWazeObjectFromSelection(selected[0]));
  renderDOMButtons(copyButtonState(), pasteButtonState(), () => {
    // users become more tricky, so exit the function if the junction box can't be cloned
    if (copyButtonState() !== CanJunctionBoxBeCloned.Yes) return; // if we'll override the junction box, then we need to make sure that the user wants to do that

    if (copiedJunctionBox !== null) {
      if (!confirm(I18n.translate("edit.big_junction.clone.override_copied_data_confirm"))) return;
    } // clone the junction box


    const jbAddress = getWazeObjectFromSelection(selected[0]).getAddress().attributes;
    copiedJunctionBox = {
      name: getWazeObjectFromSelection(selected[0]).attributes.name,
      address: {
        city: {
          name: jbAddress.city.getName(),
          id: jbAddress.city.getID(),
          isEmpty: jbAddress.city.isEmpty()
        },
        country: jbAddress.country.getID()
      },
      turns: turns,
      meta: {
        entries: segments.entries,
        exits: segments.exits,
        inside: segments.inside,
        jb: getWazeObjectFromSelection(selected[0]),
        pasted: false
      }
    }; // update the copy paste buttons

    setPasteButtonState(checkCanJunctionBoxBePasted(getWazeObjectFromSelection(selected[0]), segments));
  }, () => {
    // users become more tricky, so exit the function if the junction box can't be pasted
    if (pasteButtonState() !== CanJunctionBoxBePasted.Yes) return; // map the copied junction box turns to SetTurn actions

    const SetTurnAction = unsafeWindow.require("Waze/Model/Graph/Actions/SetTurn");

    const setTurnActions = copiedJunctionBox.turns.map(turn => new SetTurnAction(unsafeWindow.W.model.turnGraph, turn)); // paste the junction box

    const pasteJunctionBoxAction = new PasteBigJunctionPropertiesAction(getWazeObjectFromSelection(selected[0]), setTurnActions, copiedJunctionBox.address, copiedJunctionBox.name, copiedJunctionBox.meta.pasted, value => (copiedJunctionBox.meta.pasted = value, undefined));
    unsafeWindow.W.model.actionManager.add(pasteJunctionBoxAction);
  });
}

const WzButton = 'wz-button';

function renderDOMButtons(canCloneResult, canPasteResult, onCloneClick, onPasteClick) {
  const {
    getCloneButtonTooltip,
    getPasteButtonTooltip
  } = (() => {
    function parseToKeyAndArgs(data) {
      if (typeof data === "string") return [data, undefined];else return [data[0], data[1]];
    }

    function translate(data) {
      const [tooltipKey, tooltipArgs] = parseToKeyAndArgs(data);
      return I18n.translate(tooltipKey, tooltipArgs);
    }

    const getClone = function (value) {
      if (void 0 === value) value = canCloneResult;
      const canCloneTooltips = {
        [CanJunctionBoxBeCloned.SomeTurnsHaveInstructions]: "edit.big_junction.clone.errors.segments_with_turn_instructions",
        [CanJunctionBoxBeCloned.JunctionBoxIsLocked]: "edit.big_junction.clone.errors.junction_box_is_locked",
        [CanJunctionBoxBeCloned.JunctionBoxAlreadyCloned]: "edit.big_junction.clone.errors.junction_box_already_cloned"
      };
      if (value === CanJunctionBoxBeCloned.Yes) return "";
      return translate(canCloneTooltips[value]);
    };

    const getPaste = function (value) {
      if (void 0 === value) value = canPasteResult;
      const canPasteTooltips = {
        [CanJunctionBoxBePasted.MissingPathSegments]: "edit.big_junction.clone.errors.missing_path_segments",
        [CanJunctionBoxBePasted.ExtraEntrancesOrExits]: "edit.big_junction.clone.errors.extra_entrances_or_exits",
        [CanJunctionBoxBePasted.NoChangesBetweenStates]: "edit.big_junction.clone.errors.junction_box_has_no_changes",
        [CanJunctionBoxBePasted.NoJunctionBoxPropertiesAvailable]: "edit.big_junction.clone.errors.no_junction_box_available",
        [CanJunctionBoxBePasted.JunctionBoxIsLocked]: "edit.big_junction.clone.errors.junction_box_is_locked"
      };
      if (value === CanJunctionBoxBePasted.Yes) return "";
      return translate(canPasteTooltips[value]);
    };

    return {
      getCloneButtonTooltip: getClone,
      getPasteButtonTooltip: getPaste
    };
  })();

  const cloneWrapperRef = useMultiRef({
    current: null,
    button: null
  });
  const pasteWrapperRef = useMultiRef({
    current: null,
    button: null
  });
  const buttonContainerPrototype = {
    setTooltipText: function (text) {
      this.setAttribute("data-original-title", text);
      return this;
    }
  };
  setTimeout(() => {
    appendJsxTo(document.getElementById("big-junction-edit-general").getElementsByClassName("junction-actions")[0], jsxCreateElement("fragment", null, jsxCreateElement("div", {
      wmeTooltip: true,
      prototype: buttonContainerPrototype,
      ref: cloneWrapperRef
    }, jsxCreateElement(WzButton, {
      size: "sm",
      color: "secondary",
      ref: cloneWrapperRef,
      refKey: "button",
      className: "action-button waze-btn waze-btn-smaller waze-btn-white disabled-events " + modules_script_key,
      disabled: canCloneResult !== CanJunctionBoxBeCloned.Yes,
      onClick: onCloneClick
    }, I18n.translate("edit.big_junction.clone.copy"))), jsxCreateElement("div", {
      wmeTooltip: true,
      prototype: buttonContainerPrototype,
      ref: pasteWrapperRef
    }, jsxCreateElement(WzButton, {
      size: "sm",
      color: "secondary",
      ref: pasteWrapperRef,
      refKey: "button",
      className: "action-button waze-btn waze-btn-smaller waze-btn-white disabled-events " + modules_script_key,
      disabled: canPasteResult !== CanJunctionBoxBePasted.Yes,
      onClick: onPasteClick
    }, I18n.translate("edit.big_junction.clone.paste")))));
    onCopyButtonStateUpdate(newCanClone => {
      cloneWrapperRef.button.disabled = newCanClone !== CanJunctionBoxBeCloned.Yes;
      cloneWrapperRef.current.setTooltipText(getCloneButtonTooltip(newCanClone));
    });
    onPasteButtonStateUpdate(newCanPaste => {
      pasteWrapperRef.button.disabled = newCanPaste !== CanJunctionBoxBePasted.Yes;
      pasteWrapperRef.current.setTooltipText(getPasteButtonTooltip(newCanPaste));
    });
    setCopyButtonState(canCloneResult);
    setPasteButtonState(canPasteResult);
  }, 10);
}

/* harmony default export */ const jb_cloner = (() => addEventListener("wmeload", () => {
  unsafeWindow.W.selectionManager.events.on("selectionchanged", jb_cloner_selectedFeaturesChangedCallback);

  const safeUpdateCopyPasteButtons = () => {
    if (!copiedJunctionBox) return;
    const {
      canCloneResult,
      canPasteResult
    } = getJunctionBoxData(copiedJunctionBox.meta.jb);
    setCopyButtonState(canCloneResult);
    setPasteButtonState(canPasteResult);
  };

  unsafeWindow.W.model.actionManager.events.on("afteraction", safeUpdateCopyPasteButtons);
  unsafeWindow.W.model.actionManager.events.on("afterundoaction", safeUpdateCopyPasteButtons);
  proxy(unsafeWindow.W.controller.descartesClient, "postFeatures", function (t, r, ignoreWarnings) {
    if (!ignoreWarnings && copiedJunctionBox && !copiedJunctionBox.meta.pasted && copiedJunctionBox.meta.jb.state === "DELETED") {
      return new Promise((_, reject) => {
        const errors = unsafeWindow.W.saveController._createDefaultSaveError();

        errors.errors[0].attributes.details = I18n.translate("edit.big_junction.clone.save_confirmation");
        errors.errors[0].attributes.code = 600;
        errors.errors[0].attributes.ignorable = true;
        reject(errors);
        return;
      });
    }
  }); // proxy(HTMLButtonElement.prototype, "addEventListener", function(eventName: string, callback: Function) {
  //     if (unsafeWindow.$(this).parents('').length > 0) {
  //     }
  // }); // todo add hook to call the real save without ignore warnings
}));
;// CONCATENATED MODULE: ./src/betterUI.ts


let previouslyInitialized = false;
function getCSSName(className) {
    return `${modules_script_key}-${className}`;
}
function initialize() {
    if (previouslyInitialized)
        return;
    // create style tag to change some junction box edit panel styles
    let styleTag = document.createElement("style");
    // set 4px margin-top to selector "#big-junction-edit-general .form-group.side-panel-section .controls.junction-actions > *:not(:first-child)"
    styleTag.innerHTML = `
        #big-junction-edit-general .form-group.side-panel-section .controls.junction-actions > *:not(:first-child) {
            margin-top: 4px;
        }

        wz-button.${modules_script_key} {
            outline: none;
        }

        wz-button.${modules_script_key}.disabled-events[disabled]:not([disabled=false]) {
            pointer-events: none !important;
        }
    `;
    // append style tag to the document
    document.head.appendChild(styleTag);
    window.injectCSS = function (cssOrClassName, cssProperties) {
        let css = cssOrClassName;
        if (cssProperties) {
            // cssProperty key can be in camelCase
            cssProperties = Object.entries(cssProperties).reduce((acc, [key, value]) => {
                const kebabCaseKey = key.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
                acc += `${kebabCaseKey}: ${value};`;
                return acc;
            }, "");
            // generate class name with script key
            cssOrClassName = `.${getCSSName(cssOrClassName)}`;
            css = `${cssOrClassName} { ${cssProperties} }`;
        }
        styleTag.innerHTML += css;
    };
    window.prefetch = function (url) {
        const link = document.createElement("link");
        link.rel = "prefetch";
        link.href = url;
        document.head.appendChild(link);
    };
    previouslyInitialized = true;
}
function fixJunctionBoxesEditPanelActionControlsClasses() {
    initialize();
    let selection = unsafeWindow.W.selectionManager._selectedFeatures;
    // if there is no selection or the model type is not junction box (AKA bigJunction) - return
    if (selection.length === 0 || getWazeObjectFromSelection(selection[0]).type !== "bigJunction")
        return;
    // new big junctions have a problem with the classes (more-actions instead of side-panel-section)
    // so we need to fix the class manually (new junctions are negative id)
    if (getWazeObjectFromSelection(selection[0]).attributes.id < 0) {
        // get the actions container
        let actionsContainer = document.querySelector(".controls.junction-actions").parentElement;
        // hook remove and add class methods, to ignore the "more-actions" class
        proxy(actionsContainer.classList, "remove", function (className) {
            if (className === "side-panel-section") {
                return;
            }
            return arguments;
        });
        proxy(actionsContainer.classList, "add", function (className) {
            if (className === "more-actions") {
                return;
            }
            return arguments;
        });
    }
}

;// CONCATENATED MODULE: ./src/utils/MathGeometry.ts
function calculateAngleOfLine(line) {
    const x = line.x2 - line.x1;
    const y = line.y2 - line.y1;
    return Math.atan2(y, x) * 180 / Math.PI;
}
function calculateAngleBetween2Lines(line1, line2) {
    const angle1 = calculateAngleOfLine(line1);
    const angle2 = calculateAngleOfLine(line2);
    let angle = (angle2 - angle1);
    if (angle < 0)
        angle += (Math.floor(Math.abs(angle) / 360) + 1) * 360;
    return angle;
}

// EXTERNAL MODULE: ./src/normalizeRoundaboutTurns/badges.png
var badges = __webpack_require__(8687);
;// CONCATENATED MODULE: ./src/normalizeRoundaboutTurns/badges_conf.ts

const badgeSize = { width: 16, height: 16 };
const badgesTypesBounds = {
    icons: {
        top: 0,
        left: 0,
        width: badgeSize.width * 4,
        height: badgeSize.height // 1 row
    },
    chars: {
        top: badgeSize.height,
        left: 0,
        width: badgeSize.width * 4,
        height: badgeSize.height // 1 row
    },
    count_exits: {
        top: badgeSize.height * 2,
        left: 0,
        width: badgeSize.width * 5,
        height: badgeSize.height * 2 // 2 rows
    }
};
const turnBadgesOrder = ["continue", "right", "left", "uTurn"];
// combine an object with all the badges (turn badges) inside objects describing the badge's type (icon or chars)
// the object should be the bounds for the badge
// for exits counter define a new object property
// the order for the exits is the following: 1 2 3 4 ? 5 6 7 8 9
function splitAreaToBadgesBounds(area, badges) {
    // each badge in the array will be the key in the object
    const bounds = {};
    const iconsPerRow = Math.floor(area.width / badgeSize.width);
    badges.forEach((badge, index) => {
        const row = Math.floor(index / iconsPerRow);
        const column = index % iconsPerRow;
        bounds[badge] = {
            top: area.top + row * badgeSize.height,
            left: area.left + column * badgeSize.width,
            width: badgeSize.width,
            height: badgeSize.height
        };
    });
    return bounds;
}
// export
const badges_conf_badges = {
    icons: splitAreaToBadgesBounds(badgesTypesBounds.icons, turnBadgesOrder),
    chars: splitAreaToBadgesBounds(badgesTypesBounds.chars, turnBadgesOrder),
    count_exits: splitAreaToBadgesBounds(badgesTypesBounds.count_exits, ["1", "2", "3", "4", "?", "5", "6", "7", "8", "9"])
};


;// CONCATENATED MODULE: ./src/normalizeRoundaboutTurns/index.ts







var CanEntryBeNormalizedResult;
(function (CanEntryBeNormalizedResult) {
    CanEntryBeNormalizedResult[CanEntryBeNormalizedResult["Yes"] = 0] = "Yes";
    CanEntryBeNormalizedResult[CanEntryBeNormalizedResult["NotConnectedToAJunctionBox"] = 1] = "NotConnectedToAJunctionBox";
    CanEntryBeNormalizedResult[CanEntryBeNormalizedResult["TooManyExits"] = 2] = "TooManyExits";
})(CanEntryBeNormalizedResult || (CanEntryBeNormalizedResult = {}));
var RoundaboutTurnInstructions;
(function (RoundaboutTurnInstructions) {
    RoundaboutTurnInstructions[RoundaboutTurnInstructions["LetWazeCountExits"] = 0] = "LetWazeCountExits";
    RoundaboutTurnInstructions[RoundaboutTurnInstructions["Right"] = 1] = "Right";
    RoundaboutTurnInstructions[RoundaboutTurnInstructions["Continue"] = 2] = "Continue";
    RoundaboutTurnInstructions[RoundaboutTurnInstructions["Left"] = 3] = "Left";
    RoundaboutTurnInstructions[RoundaboutTurnInstructions["UTurn"] = 4] = "UTurn";
})(RoundaboutTurnInstructions || (RoundaboutTurnInstructions = {}));
const canEntryBeNormalizedResultTranslations = {
    [CanEntryBeNormalizedResult.NotConnectedToAJunctionBox]: "edit.roundabout.normalize_tooltips.not_connected_to_junction_box",
    [CanEntryBeNormalizedResult.TooManyExits]: "edit.roundabout.normalize_tooltips.too_many_exits"
};
const GetRoundaboutTurnInstructionsBadgeClasses = {
    [RoundaboutTurnInstructions.LetWazeCountExits]: (exit) => getCSSName(exit <= 9 && scriptPrefsStorage.get('normalize_badge_style_count') === "numbers" ? `normalize-rb rb-badge rbcount-badge-${exit}` : "normalize-rb rb-badge rbcount-badge-question"),
    [RoundaboutTurnInstructions.Right]: () => getCSSName("normalize-rb rb-badge rbr-badge " + (scriptPrefsStorage.get('normalize_badge_style') === 'icons' ? "icon-badge" : "char-badge")),
    [RoundaboutTurnInstructions.Continue]: () => getCSSName("normalize-rb rb-badge rbs-badge " + (scriptPrefsStorage.get('normalize_badge_style') === 'icons' ? "icon-badge" : "char-badge")),
    [RoundaboutTurnInstructions.Left]: () => getCSSName("normalize-rb rb-badge rbl-badge " + (scriptPrefsStorage.get('normalize_badge_style') === 'icons' ? "icon-badge" : "char-badge")),
    [RoundaboutTurnInstructions.UTurn]: () => getCSSName("normalize-rb rb-badge rbu-badge " + (scriptPrefsStorage.get('normalize_badge_style') === 'icons' ? "icon-badge" : "char-badge"))
};
const RoundaboutTurnInstructionsOpcodes = {
    [RoundaboutTurnInstructions.LetWazeCountExits]: "ROUNDABOUT_ENTER",
    [RoundaboutTurnInstructions.Right]: "TURN_RIGHT",
    [RoundaboutTurnInstructions.Continue]: "CONTINUE",
    [RoundaboutTurnInstructions.Left]: "TURN_LEFT",
    [RoundaboutTurnInstructions.UTurn]: "UTURN"
};
function getAllTurnsArrowContainers() {
    const containers = {};
    const arrows = unsafeWindow.W.map.olMap.layers.flatMap((l) => l.markers)
        .filter((m) => { var _a; return m && ((_a = m.icon.className) === null || _a === void 0 ? void 0 : _a.startsWith("turn-arrow")); })
        .map((m) => ({ container: m.icon.div.querySelector(".arrow"), turnArrow: m.getTurnArrow() }));
    for (let arrow of arrows) {
        const id = arrow.container.getAttribute("data-id");
        containers[id] = arrow;
    }
    return containers;
}
function injectRoundaboutTurnInstructionsBadge(turn, arrowContainers, exitNumber) {
    const badge = document.createElement("div");
    badge.className = GetRoundaboutTurnInstructionsBadgeClasses[turn[`${script_key}`].instruction](exitNumber);
    const id = turn.getID();
    const { container: arrowContainer, turnArrow } = arrowContainers[id];
    if (!arrowContainer)
        return;
    // move the arrow container childs in a new column flex container
    const arrowContainerChilds = arrowContainer.childNodes;
    const arrowContainerChildsWrapper = document.createElement("div");
    arrowContainerChildsWrapper.style.display = "flex";
    // arrowContainerChildsWrapper.style.flexDirection = "column";
    arrowContainerChildsWrapper.style.width = "fit-content";
    arrowContainerChildsWrapper.style.gap = "3px";
    for (let i = 0; i < arrowContainerChilds.length; i++) {
        // for each child remove the rotation, if it has it, but keep the transform
        arrowContainerChilds[i].style.transform = arrowContainerChilds[i].style.transform.replace(/rotate\(.*?\)/, "");
        arrowContainerChildsWrapper.appendChild(arrowContainerChilds[i]);
    }
    // add the badge to the arrow container
    arrowContainerChildsWrapper.appendChild(badge);
    const perfectSizeContainer = document.createElement("div");
    perfectSizeContainer.style.width = perfectSizeContainer.style.height = "16px";
    perfectSizeContainer.style.transform = `rotate(-${(450 - turnArrow.getAngle()) % 360}deg)`;
    perfectSizeContainer.appendChild(arrowContainerChildsWrapper);
    arrowContainer.appendChild(perfectSizeContainer);
}
function convertAnglesToInstructions(turns) {
    // right, continue and left will be the instruction if there is only one turn
    // but if there are many, then count the exits
    // for uTurn find the one with the closet to zero angle
    const rightTurnData = turns.right.length === 1 ? turns.right[0] : null;
    const continueTurnData = turns.continue.length === 1 ? turns.continue[0] : null;
    const leftTurnData = turns.left.length === 1 ? turns.left[0] : null;
    const uTurnData = turns.uTurn.sort((a, b) => Math.abs(a.angle) - Math.abs(b.angle))[0];
    // add to each turn it's instruction
    // for the turns above the instruction will be the instruction, for others it will be the number of exits
    turns.right.forEach(turn => turn[`${modules_script_key}`].instruction = rightTurnData === turn ? RoundaboutTurnInstructions.Right : RoundaboutTurnInstructions.LetWazeCountExits);
    turns.continue.forEach(turn => turn[`${modules_script_key}`].instruction = continueTurnData === turn ? RoundaboutTurnInstructions.Continue : RoundaboutTurnInstructions.LetWazeCountExits);
    turns.left.forEach(turn => turn[`${modules_script_key}`].instruction = leftTurnData === turn ? RoundaboutTurnInstructions.Left : RoundaboutTurnInstructions.LetWazeCountExits);
    turns.uTurn.forEach(turn => turn[`${modules_script_key}`].instruction = uTurnData === turn ? RoundaboutTurnInstructions.UTurn : RoundaboutTurnInstructions.LetWazeCountExits);
    return turns;
}
function getRoundaboutAngles(turns) {
    for (let turn of turns) {
        // get the from and to segments
        const fromSegment = unsafeWindow.W.model.segments.getObjectById(turn.fromVertex.getSegmentID());
        const toSegment = unsafeWindow.W.model.segments.getObjectById(turn.toVertex.getSegmentID());
        // for the from segment get the 2 last geometry joints, for the to segment get the 2 first
        // if the direction is reversed, then we also need to reverse the geometry
        // segment geometry joints: segment.geometry.components[0] is the first, segment.geometry.components[segment.geometry.components.length - 1] is the last
        const fromSegmentGeometryJoint1 = turn.fromVertex.isForward() ? fromSegment.geometry.components[fromSegment.geometry.components.length - 1] : fromSegment.geometry.components[0];
        const fromSegmentGeometryJoint2 = turn.fromVertex.isForward() ? fromSegment.geometry.components[fromSegment.geometry.components.length - 2] : fromSegment.geometry.components[1];
        const toSegmentGeometryJoint1 = turn.toVertex.isForward() ? toSegment.geometry.components[0] : toSegment.geometry.components[toSegment.geometry.components.length - 1];
        const toSegmentGeometryJoint2 = turn.toVertex.isForward() ? toSegment.geometry.components[1] : toSegment.geometry.components[toSegment.geometry.components.length - 2];
        // get the angle between the 2 geometry joints
        const fromLine = {
            x1: fromSegmentGeometryJoint1.x,
            y1: fromSegmentGeometryJoint1.y,
            x2: fromSegmentGeometryJoint2.x,
            y2: fromSegmentGeometryJoint2.y
        };
        const toLine = {
            x1: toSegmentGeometryJoint1.x,
            y1: toSegmentGeometryJoint1.y,
            x2: toSegmentGeometryJoint2.x,
            y2: toSegmentGeometryJoint2.y
        };
        turn[`${modules_script_key}`] = {
            angle: Math.abs(calculateAngleBetween2Lines(fromLine, toLine))
        };
    }
    return turns;
}
function getCanBeNormalizedResult(jb, turns) {
    if (jb === null)
        return CanEntryBeNormalizedResult.NotConnectedToAJunctionBox;
    // auto-normalize can work only if there are no more than 4 exits (only turns with segment path)
    if (turns.length > 4)
        return CanEntryBeNormalizedResult.TooManyExits;
    // by default it is possible to normalize
    return CanEntryBeNormalizedResult.Yes;
}
function isSegmentConnectedToRoundaboutThroughNode(segment, node) {
    if (!node || !segment)
        return false;
    const segmentIds = node.getSegmentIds();
    // if there is only one segment connected to the node (our segment) then it cannot be connected to a roundabout
    if (segmentIds.length <= 1)
        return false;
    for (let segmentId of segmentIds) {
        if (segmentId === segment.getID())
            continue;
        const nodeSegment = unsafeWindow.W.model.segments.getObjectById(segmentId);
        // if the node segment is not in a roundabout, then the whole node is not a segment <====> roundabout connection
        if (!nodeSegment.isInRoundabout())
            return false;
    }
    // if no one of the segments returned false yet, then probably the node is connected to a roundabout, and so too is the segment
    return true;
}
function getTurnsNormalizer(segments) {
    if (segments.length !== 1) {
        return {
            canNormalize: false
        };
    }
    const [segment] = segments;
    // each segment have 2 nodes, check for everyone if it is connected to a roundabout and the direction to is allowed
    const isANodeConnectedToRoundabout = segment.attributes.revDirection && isSegmentConnectedToRoundaboutThroughNode(segment, segment.getFromNode());
    const isBNodeConnectedToRoundabout = segment.attributes.fwdDirection && isSegmentConnectedToRoundaboutThroughNode(segment, segment.getToNode());
    // segment is connected to jb if the crossroads attribute of the segment contain some values
    // for each node of the segment, check if it is connected to a jb, and if so check if the jb is a roundabout jb (which means all of the segIDs of the jb are in roundabout)
    // fromCrossroads and toCrossroads are arrays of jb ids, so use the W.model.bigJunction.getObjectById to get the jb object
    // but a node can't be in a roundabout jb if it is not in a roundabout already
    const ANodeJBId = segment.attributes.fromCrossroads.find((crossroadId) => unsafeWindow.W.model.bigJunctions.getObjectById(crossroadId).attributes.segIDs.
        every((segId) => { var _a; return (_a = unsafeWindow.W.model.segments.getObjectById(segId)) === null || _a === void 0 ? void 0 : _a.isInRoundabout(); }));
    const BNodeJBId = segment.attributes.toCrossroads.find((crossroadId) => unsafeWindow.W.model.bigJunctions.getObjectById(crossroadId).attributes.segIDs.
        every((segId) => { var _a; return (_a = unsafeWindow.W.model.segments.getObjectById(segId)) === null || _a === void 0 ? void 0 : _a.isInRoundabout(); }));
    const ANodeJB = ANodeJBId !== undefined ? unsafeWindow.W.model.bigJunctions.getObjectById(ANodeJBId) : null;
    const BNodeJB = BNodeJBId !== undefined ? unsafeWindow.W.model.bigJunctions.getObjectById(BNodeJBId) : null;
    const ATurns = ANodeJB === null ? null : getJunctionBoxTurnsFrom(ANodeJB, segment, "reverse").filter((turn) => turn.turnData.hasSegmentPath());
    const BTurns = BNodeJB === null ? null : getJunctionBoxTurnsFrom(BNodeJB, segment, "forward").filter((turn) => turn.turnData.hasSegmentPath());
    const ANodeCanBeNormalizedResult = isANodeConnectedToRoundabout && getCanBeNormalizedResult(ANodeJB, ATurns);
    const BNodeCanBeNormalizedResult = isBNodeConnectedToRoundabout && getCanBeNormalizedResult(BNodeJB, BTurns);
    return {
        canNormalize: true,
        canNormalizeA: ANodeCanBeNormalizedResult,
        canNormalizeB: BNodeCanBeNormalizedResult,
        normalizeA: NormalizeTurns.bind(this, ATurns, ANodeJB, segment.getFromNode()),
        normalizeB: NormalizeTurns.bind(this, BTurns, BNodeJB, segment.getToNode()),
    };
}
function NormalizeTurns(turns, jb, node) {
    // calculate the angles for the turns
    getRoundaboutAngles(turns);
    // for each turn set the script_key.exit to the exit number
    // determine the exit number by sorting them by the segmentPath, and then their index will be the exit number
    [...turns].sort((a, b) => a.turnData.segmentPath.length - b.turnData.segmentPath.length).forEach((turn, index) => {
        turn[modules_script_key].exit = index + 1;
    });
    // right angle 45-135 | continue 135-225 | left 225 - 315 | uTurn 315-45
    // group the turns by angle
    const groupedTurns = turns.reduce((acc, turn) => {
        const angle = turn[`${modules_script_key}`].angle;
        let arr;
        if (angle >= 45 && angle < 135)
            arr = acc.right;
        else if (angle >= 135 && angle < 225)
            arr = acc.continue;
        else if (angle >= 225 && angle < 315)
            arr = acc.left;
        else
            arr = acc.uTurn;
        arr.push(turn);
        return acc;
    }, { right: [], continue: [], left: [], uTurn: [] });
    convertAnglesToInstructions(groupedTurns);
    // generate new turn instructions
    const allInstructedTurns = [
        ...groupedTurns.right.map((turn) => turn.withTurnData(turn.turnData.withInstructionOpcode(RoundaboutTurnInstructionsOpcodes[turn[`${modules_script_key}`].instruction]))),
        ...groupedTurns.continue.map((turn) => turn.withTurnData(turn.turnData.withInstructionOpcode(RoundaboutTurnInstructionsOpcodes[turn[`${modules_script_key}`].instruction]))),
        ...groupedTurns.left.map((turn) => turn.withTurnData(turn.turnData.withInstructionOpcode(RoundaboutTurnInstructionsOpcodes[turn[`${modules_script_key}`].instruction]))),
        ...groupedTurns.uTurn.map((turn) => turn.withTurnData(turn.turnData.withInstructionOpcode(RoundaboutTurnInstructionsOpcodes[turn[`${modules_script_key}`].instruction])))
    ];
    unsafeWindow.W.model.actionManager.add(new NormalizeRoundaboutTurns(allInstructedTurns, node));
    // const arrowsContainer = getAllTurnsArrowContainers();
    // [...groupedTurns.right, ...groupedTurns.continue, ...groupedTurns.left, ...groupedTurns.uTurn].forEach((turn: any) => injectRoundaboutTurnInstructionsBadge(
    //         turn, 
    //         // (450 - jb.getAngleAtIntersection(unsafeWindow.W.model.segments.getObjectById(turn.toVertex.getSegmentID()).geometry)) % 360,
    //         arrowsContainer,
    //         turn[script_key].exit
    // ));
}
function injectBadgesCSStoDOM() {
    /*
        the following classes are used to identify the turn arrows

        global:
            .normalize-rb.badge - defines the background image of the badge
        
        turn:
            .normalize-rb.rbs-badge - defines the background image position (x) data the the straight (s, continue) turn
            .normalize-rb.rbl-badge - defines the background image position (x) data the the left (l) turn
            .normalize-rb.rbr-badge - defines the background image position (x) data the the right (r) turn
            .normalize-rb.rbu-badge - defines the background image position (x) data the the u-turn (u) turn
            in combination with .normalize-rb.icon-badge or .normalize-rb.char-badge - defines the background image position (y) data

        count exits:
            .normalize-rb.rbcount-badge-1 - defines the background image position (x, y) data for the first exit
            .normalize-rb.rbcount-badge-2 - defines the background image position (x, y) data for the second exit
            .normalize-rb.rbcount-badge-3 - defines the background image position (x, y) data for the third exit
            ...and so on up to 9
            .normalize-rb.rbcount-badge-question - defines the background image position (x, y) data for the question mark
    */
    function injectBoundsCSS(name, bounds) {
        injectCSS(name, {
            backgroundPosition: `${-bounds.left}px ${-bounds.top}px`
        });
    }
    // inject the badge styles
    injectCSS('normalize-rb.rb-badge', {
        backgroundImage: `url(${badges})`,
        backgroundRepeat: 'no-repeat',
        width: '16px',
        height: '16px'
    });
    injectBoundsCSS('normalize-rb.icon-badge.rbs-badge', badges_conf_badges.icons.continue);
    injectBoundsCSS('normalize-rb.icon-badge.rbl-badge', badges_conf_badges.icons.left);
    injectBoundsCSS('normalize-rb.icon-badge.rbr-badge', badges_conf_badges.icons.right);
    injectBoundsCSS('normalize-rb.icon-badge.rbu-badge', badges_conf_badges.icons.uTurn);
    injectBoundsCSS('normalize-rb.char-badge.rbs-badge', badges_conf_badges.chars.continue);
    injectBoundsCSS('normalize-rb.char-badge.rbl-badge', badges_conf_badges.chars.left);
    injectBoundsCSS('normalize-rb.char-badge.rbr-badge', badges_conf_badges.chars.right);
    injectBoundsCSS('normalize-rb.char-badge.rbu-badge', badges_conf_badges.chars.uTurn);
    injectBoundsCSS('normalize-rb.rbcount-badge-1', badges_conf_badges.count_exits[1]);
    injectBoundsCSS('normalize-rb.rbcount-badge-2', badges_conf_badges.count_exits[2]);
    injectBoundsCSS('normalize-rb.rbcount-badge-3', badges_conf_badges.count_exits[3]);
    injectBoundsCSS('normalize-rb.rbcount-badge-4', badges_conf_badges.count_exits[4]);
    injectBoundsCSS('normalize-rb.rbcount-badge-5', badges_conf_badges.count_exits[5]);
    injectBoundsCSS('normalize-rb.rbcount-badge-6', badges_conf_badges.count_exits[6]);
    injectBoundsCSS('normalize-rb.rbcount-badge-7', badges_conf_badges.count_exits[7]);
    injectBoundsCSS('normalize-rb.rbcount-badge-8', badges_conf_badges.count_exits[8]);
    injectBoundsCSS('normalize-rb.rbcount-badge-9', badges_conf_badges.count_exits[9]);
    injectBoundsCSS('normalize-rb.rbcount-badge-question', badges_conf_badges.count_exits["?"]);
}
function domNormalizeButton(nodeName, onClick, canNormalizeResult) {
    const tooltipLabel = canNormalizeResult !== CanEntryBeNormalizedResult.Yes ? I18n.translate(canEntryBeNormalizedResultTranslations[canNormalizeResult]) : null;
    const tooltipWrapper = document.createElement("div");
    tooltipWrapper.className = "edit-house-numbers-btn-wrapper";
    tooltipWrapper.setAttribute("data-original-title", tooltipLabel);
    if (tooltipLabel)
        tooltip(tooltipWrapper);
    const button = document.createElement("wz-button");
    button.className = `disabled-events ${modules_script_key}`;
    button.color = "text";
    button.size = "sm";
    button.innerText = I18n.translate("edit.roundabout.normalize_turns_at", {
        nodeName
    });
    button.disabled = canNormalizeResult !== CanEntryBeNormalizedResult.Yes;
    button.addEventListener("click", onClick);
    tooltipWrapper.appendChild(button);
    return tooltipWrapper;
}
let previousCustomButtonsContainer = null;
function onWmeSelectionChanged(event) {
    const selected = event.detail.selected;
    const segmentFeatures = selected.filter((f) => getWazeObjectFromSelection(f).type === 'segment');
    const segments = segmentFeatures.map((f) => getWazeObjectFromSelection(f));
    const { canNormalize, normalizeA, normalizeB, canNormalizeA, canNormalizeB } = getTurnsNormalizer(segments);
    if (!canNormalize)
        return;
    const buttonsContainer = document.querySelector(".form-group.more-actions");
    if (!buttonsContainer)
        return;
    const customButtonsContainer = document.createElement("div");
    customButtonsContainer.className = "form-group more-actions";
    buttonsContainer.style.marginBottom = '10px';
    if (canNormalizeA !== false) {
        customButtonsContainer.appendChild(domNormalizeButton('A', normalizeA, canNormalizeA));
    }
    if (canNormalizeB !== false) {
        customButtonsContainer.appendChild(domNormalizeButton('B', normalizeB, canNormalizeB));
    }
    buttonsContainer.after(customButtonsContainer);
    if (previousCustomButtonsContainer)
        previousCustomButtonsContainer.remove();
    previousCustomButtonsContainer = customButtonsContainer;
}
/* harmony default export */ const normalizeRoundaboutTurns = (() => addEventListener("wmeload", () => {
    injectBadgesCSStoDOM();
    unsafeWindow.W.selectionManager.events.on("selectionchanged", onWmeSelectionChanged);
}));

;// CONCATENATED MODULE: ./src/modules.ts




/* harmony default export */ function modules() {
    convertGeometry();
    jb_cloner();
    prefs();
    normalizeRoundaboutTurns();
}
const modules_script_key = "ejCZYwCQJb";

;// CONCATENATED MODULE: ./src/Actions/index.ts
function generateActionClasses() {
    const ActionBase = unsafeWindow.require("Waze/Action/MultiAction").__proto__.__proto__;
    const MultiActionBase = unsafeWindow.require("Waze/Action/MultiAction").__proto__;
    const UpdateObjectActionBase = unsafeWindow.require("Waze/Action/UpdateObject");
    const UpdateFeatureAddressActionBase = unsafeWindow.require("Waze/Action/UpdateFeatureAddress");
    Object.assign(window, {
        BigJunctionGeometryTransformedToRoundabout: class BigJunctionGeometryTransformedToRoundabout extends ActionBase {
            constructor(previousGeometry, roundaboutGeometry, bigJunctionAction, doCallback, undoCallback) {
                super();
                this.previousGeometry = previousGeometry;
                this.roundaboutGeometry = roundaboutGeometry;
                this.bigJunctionAction = bigJunctionAction;
                this.doCallback = doCallback;
                this.undoCallback = undoCallback;
                this.shouldSerialize = false;
            }
            generateDescription() {
                this._description = I18n.translate("save.changes_log.actions.BigJunctionGeometryTransformedToRoundabout");
            }
            getAffectedUniqueIds() {
                return [this.bigJunctionAction.bigJunction.getUniqueID()];
            }
            getFocusFeatures() {
                return [this.bigJunctionAction.bigJunction];
            }
            doAction() {
                this.bigJunctionAction.initialGeometry = this.bigJunctionAction.bigJunction.attributes.geometry = this.roundaboutGeometry;
                this.bigJunctionAction.subActions[0].attributes.geoJSONGeometry = unsafeWindow.W.userscripts.toGeoJSONGeometry(this.roundaboutGeometry);
                this._changeFeatureGeometry(this.roundaboutGeometry);
                this.doCallback();
                return true;
            }
            undoAction() {
                this.bigJunctionAction.initialGeometry = this.bigJunctionAction.bigJunction.attributes.geometry = this.previousGeometry;
                this.bigJunctionAction.subActions[0].attributes.geoJSONGeometry = unsafeWindow.W.userscripts.toGeoJSONGeometry(this.previousGeometry);
                this._changeFeatureGeometry(this.previousGeometry);
                this.undoCallback();
                return true;
            }
            redoAction() {
                this.doAction();
            }
            _changeFeatureGeometry(geometry) {
                let jbLayer = unsafeWindow.W.map.getLayerByUniqueName("big_junctions");
                let drawFeature = jbLayer.featureMap.get(this.bigJunctionAction.bigJunction.getID());
                jbLayer.removeFeatures(drawFeature);
                drawFeature.geometry = geometry;
                jbLayer.addFeatures(drawFeature);
            }
        },
        PasteBigJunctionPropertiesAction: class PasteBigJunctionPropertiesAction extends MultiActionBase {
            constructor(bigJunction, subActions, newAddress, newName, prevJbPastedValue, updateJbPastedValue) {
                super();
                this.bigJunction = bigJunction;
                this.prevJbPastedValue = prevJbPastedValue;
                this.updateJbPastedValue = updateJbPastedValue;
                this.subActions = [new UpdateObjectActionBase(bigJunction, {
                        name: newName
                    }), ...subActions, this.generateAddressChangeAction(newAddress)];
            }
            generateDescription() {
                this._description = I18n.translate("save.changes_log.actions.PasteBigJunctionProperties");
                this.subActions.forEach(action => action.generateDescription());
            }
            getAffectedUniqueIds() {
                return [this.bigJunction.getUniqueID()];
            }
            getFocusFeatures() {
                return [this.bigJunction];
            }
            doAction(model) {
                return super.doAction(model) && (this.updateJbPastedValue(true), true);
            }
            undoAction(model) {
                if (super.undoSupported())
                    super.undoAction(model);
                this.subActions.forEach(subAction => subAction.undoAction(model));
                this.updateJbPastedValue(this.prevJbPastedValue);
            }
            setModel(model) {
                super.setModel(model);
                this.subActions.forEach(action => action.setModel(model));
            }
            generateAddressChangeAction(newAddress) {
                const addressChangeAction = new UpdateFeatureAddressActionBase(this.bigJunction, {
                    cityID: newAddress.city.id,
                    cityName: newAddress.city.name,
                    emptyCity: newAddress.city.isEmpty,
                    citySelectedById: !newAddress.city.isEmpty,
                    countryID: newAddress.country
                }, {
                    getCityFromDataModel: !newAddress.city.isEmpty,
                    streetIDField: undefined,
                    updateStreet: false
                });
                return addressChangeAction;
            }
        },
        NormalizeRoundaboutTurns: class NormalizeRoundaboutTurnsAction extends MultiActionBase {
            constructor(turns, node) {
                super([]);
                this.turns = turns;
                this.node = node;
                this.SetTurnAction = unsafeWindow.require("Waze/Model/Graph/Actions/SetTurn");
                this.subActions = turns.map(turn => new this.SetTurnAction(unsafeWindow.W.model.turnGraph, turn));
            }
            generateDescription() {
                this._description = I18n.translate("save.changes_log.actions.NormalizeRoundaboutTurns", {
                    count: this.turns.length
                });
                this.subActions.forEach(action => action.generateDescription());
            }
            setModel(model) {
                super.setModel(model);
                this.subActions.forEach(action => action.setModel(model));
            }
            getFocusFeatures() {
                return [this.node];
            }
            getAffectedUniqueIds() {
                return [this.node.getUniqueID()];
            }
        }
    });
}

;// CONCATENATED MODULE: ./src/beta.ts
var beta_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

function checkIfAllowedToUseScript() {
    return beta_awaiter(this, void 0, void 0, function* () {
        if (false) {}
        // if the script is not in beta, always return true
        return true;
    });
}
function getLuhnCheckDigit(id) {
    const sid = id.toString();
    const digits = sid.split('').map(c => parseInt(c, 10));
    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
        if (i % 2 === 0) {
            const doubled = digits[i] * 2;
            if (doubled > 9) {
                sum += 1 + (doubled - 10);
            }
            else {
                sum += doubled;
            }
        }
        else {
            sum += digits[i];
        }
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit;
}

// EXTERNAL MODULE: ./node_modules/@r0den/convert-conventions/dist/index.js
var dist = __webpack_require__(8276);
;// CONCATENATED MODULE: ./src/index.ts
var src_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};






window.proxy = function (object, method, handler, runOriginalBefore, getOriginal) {
    try {
        let originalMethod = object[method];
        object[method] = window.proxyMethod(originalMethod, handler, runOriginalBefore, getOriginal);
    }
    catch (e) {
        console.error(e);
    }
};
window.proxyMethod = function proxyMethod(method, handler, runOriginalBefore, getOriginal) {
    return function () {
        let ran = false;
        let ranResult = null;
        let run = (thisObject, argsArray) => {
            if (ran)
                return ranResult;
            ranResult = method.apply(thisObject, argsArray);
            ran = true;
            return ranResult;
        };
        if (runOriginalBefore)
            run(this, arguments);
        let result = handler.apply(this, getOriginal ? [(function () {
                return run(this, arguments);
            }).bind(this), ...Array.from(arguments)] : arguments);
        if (ran)
            return result;
        if (result === void 0)
            return run(this, arguments);
        else if (Array.isArray(result))
            return run(this, result);
        return result;
    };
};
(() => src_awaiter(void 0, void 0, void 0, function* () {
    const runAllWMELoaders = (function () {
        const loaders = [];
        proxy(window, "addEventListener", (eventName, handler) => {
            // if event name is "wmeload" then store the handler and ignore the original function handler
            if (eventName === "wmeload") {
                loaders.push(handler);
                return false;
            }
        });
        return () => {
            initialize();
            loaders.forEach((loader) => {
                loader();
            });
        };
    })();
    console.log("[Roundabout JB] Loading script");
    yield new Promise((resolve) => {
        var _a, _b, _c, _d, _e, _f;
        if (((_c = (_b = (_a = unsafeWindow.W) === null || _a === void 0 ? void 0 : _a.userscripts) === null || _b === void 0 ? void 0 : _b.state) === null || _c === void 0 ? void 0 : _c.isInitialized) && ((_f = (_e = (_d = unsafeWindow.W) === null || _d === void 0 ? void 0 : _d.loginManager) === null || _e === void 0 ? void 0 : _e.isLoggedIn) === null || _f === void 0 ? void 0 : _f.call(_e)))
            resolve(undefined);
        else
            document.addEventListener('wme-logged-in', () => {
                resolve(undefined);
            }, { once: true });
    });
    if (!(yield checkIfAllowedToUseScript())) {
        // log that the user is not allowed to use the script
        console.log("[Roundabout JB] You aren't allowed to use the script");
        return;
    }
    window.I18n = new localization(unsafeWindow.I18n.locale);
    yield I18n.downloadTranslations();
    window.tooltip = ((element) => unsafeWindow.$(element).tooltip({
        container: "body"
    }));
    window.appendJsxTo = (destination, jsx) => {
        if (Array.isArray(jsx)) {
            return destination.append.apply(destination, jsx);
        }
        if (typeof jsx !== 'string') {
            // if node is fragment, append all its children
            if (jsx.nodeName === "FRAGMENT") {
                return destination.append.apply(destination, jsx.childNodes);
            }
        }
        return destination.append(jsx);
    };
    window.jsxCreateElement = (tagName, props, ...children) => {
        if (typeof (tagName) === 'function') {
            // default props
            if (!props)
                props = {};
            // set the children as a new property in the props object
            props.children = children;
            return tagName(props);
        }
        let refObj = null;
        let refKey = null;
        let protoObj = null;
        const eventListeners = {};
        let isTooltip = false;
        function processSystemAttributes() {
            // if there are no props, return
            if (!props)
                return;
            // process the ref attribute
            if (props.hasOwnProperty("ref")) {
                refObj = props.ref;
                delete props.ref;
            }
            // process the ref-key attribute
            if (props.hasOwnProperty("refKey")) {
                refKey = props.refKey;
                delete props.refKey;
            }
            // process the prototype attribute
            if (props.hasOwnProperty("prototype")) {
                protoObj = props.prototype;
                delete props.prototype;
            }
            // process the wmeTooltip attribute
            if (props.hasOwnProperty("wmeTooltip")) {
                // if the tooltip is a string, then set a new data-original-title attribute with the string
                if (typeof (props.wmeTooltip) === "string") {
                    props["data-original-title"] = props.wmeTooltip;
                }
                // if the type is not boolean, then it's an object
                if (typeof (props.wmeTooltip) !== "boolean") {
                    // the object contains:
                    //  - placement (data-placement): the placement of the tooltip
                    //  - [required] label (data-original-title): the value of the tooltip
                    if (props.wmeTooltip.hasOwnProperty("placement")) {
                        props["data-placement"] = props.wmeTooltip.placement;
                    }
                    props["data-original-title"] = props.wmeTooltip.label;
                }
                // if the attribute value is convertional true, then set isTooltip to true
                // otherwise, set it to false
                isTooltip = !!props.wmeTooltip;
                // delete the wmeTooltip attribute
                delete props.wmeTooltip;
            }
            // process the event listeners (all props that start with "on")
            Object.keys(props).forEach(key => {
                if (key.startsWith("on")) {
                    // remove the 'on' prefix, lowercase the first letter only
                    const eventName = key.substring(2, 3).toLowerCase() + key.substring(3);
                    eventListeners[eventName] = props[key];
                    delete props[key];
                }
            });
        }
        processSystemAttributes();
        const flattenChildren = children.reduce((acc, child) => {
            if (!child)
                return acc;
            if (Array.isArray(child)) {
                return acc.concat(child);
            }
            return acc.concat(child);
        }, []);
        let result = document.createElement(tagName);
        if (props) {
            const keyConverter = (key, value) => {
                if (key === 'className')
                    return ['class', String(value)];
                if (key === 'htmlFor')
                    return ['for', String(value)];
                if (key === 'style') {
                    const style = {};
                    Object.keys(value).forEach(styleKey => {
                        const key = (0,dist/* default */.Z)(styleKey, 'kebab-case');
                        style[key] = value[styleKey];
                    });
                    return ['style', Object.entries(style).map(([key, value]) => `${key}: ${value}`).join(';')];
                }
                return [(0,dist/* default */.Z)(key, 'kebab-case'), value];
            };
            Object.keys(props).forEach(key => {
                result.setAttribute.apply(result, keyConverter(key, props[key]));
            });
        }
        if (flattenChildren.length) {
            flattenChildren.forEach((child) => {
                if (typeof (child) === 'string') {
                    result.innerHTML += child;
                }
                else {
                    appendJsxTo(result, child);
                }
            });
        }
        // if the refObj is set, set the ref to the node
        if (refObj)
            refObj[refKey || "current"] = result;
        // if the protoObj is set, copy the prototype properties to the node
        if (protoObj) {
            for (let key in protoObj) {
                if (protoObj.hasOwnProperty(key)) {
                    result[key] = protoObj[key];
                }
            }
        }
        // if there are event listeners, add them to the node
        if (Object.keys(eventListeners).length > 0) {
            for (let eventName in eventListeners) {
                if (eventListeners.hasOwnProperty(eventName)) {
                    result.addEventListener(eventName, eventListeners[eventName]);
                }
            }
        }
        // if isTooltip is true, then call the WME tooltip function
        if (isTooltip) {
            tooltip(result);
        }
        return result;
    };
    generateActionClasses();
    modules();
    console.log("[Roundabout JB] Script loaded | Locale: %s", I18n.locale);
    // run all modules
    proxy(unsafeWindow.W.app, "trigger", function (event) {
        if (event === 'selectionChanged')
            fixJunctionBoxesEditPanelActionControlsClasses();
    }, true);
    runAllWMELoaders();
}))();


/***/ }),

/***/ 8687:
/***/ ((module) => {

"use strict";
module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFEAAABACAYAAABiBZsIAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAA+QSURBVHgB7VtrdBRFFr4dIglohrAg7JqEnQQighEiuMIiaoDVo/iKwB5BPEvwuftD4ayvH+qJEd2zwlEeuj7WsyauuuhRNPiWAAmiEN4BEgIEklmSwOEVMhOEhAR671fT1anp6cn0mGF9hC+n6J7u/m7dulV169bthsgCXdcTuczmUszlmO7HMeN3DoXBz53faXAlWVxqjIr1tWtL9bFXX6s/8shjem1tnbyM+1lO+CHwk+V3Gix4hqzF6/XpzzzzrO5OHWQWGPODD5eoyswIxXeIs87/15v5rHeW0H/Y8Mutg2EGRRMs0K0bQx+VwGCqAdUC4xrA824rPwKcVb51EKiDwTCkyY+WEfNl5eg92XN5z8wxzkfoD3MvSkVqa2vl48Uqv6GhQd+4caNeXFysFxUViXOfz9eRIQL4aNzXy4oCHoBLmTp1utAHdeO8oqLSli+BGSPbAL6UPXHiLaYMlR8NA7pVBbxer9kQVCx7T/6WSinIxD/79+8XhrMruCf5aNiCBYuC+OoM+PrrogBj2JUPPlgSwFdx//1/tj5jtm3YMH9nwGUZSKROIoZLpnrB5XLRNVePpd27d1PpulJxzedrog+XfETJyUk0evQoq4zc5uZm2rt3r/iRkpJCWVlZoqSlpYlru3btora2NqqrqxOyFixcRAsXvmTy6+rqadqd0wnH5KQkSk5Joh07KvmZReKBu2fm0NayzaLMmvWguDbn2eeELPCtCtXV14njxRcPImvbXL16+Z/hugxkUycRSxYjwiA8DcXxNDcc4ClJjz76OK0rXUfz5j1vlZF97Ngx8Xzv3r1p8ODB5g0YkUcDbdu+TXRCj/geoiPQgAWGgdgo2dKAfgPU00033WrKGD1qFD311BPm79mzHmI91nMHr6NlRUU0ZfKkICP4fMfF8fTpMwHXUQc6EoAeBtzUScRYL1RXVwuDXHDBBTRx4kSqqa6ieXOfJ1dCgjAEihUnT54URxjRirj4OFqzppQ+//xLwVVGgGnI5KRk85rLlcANTKb+/ftTnz59aNz4rCCZo0ZfKY7SIKFQXb2XDhw4IM6PHz/OOnwuzq+7/jpRT7SAkeiRPzDl2H+J88zMTIqPjxfnU6ZMIl+Tj+bMeY6WLVuO3ldlFPJzYjRgRFpRydMSwJQcMnQI5b9ZQDsq/dfmzfu74L/++ivZ06bdJa5jyn3+2Sfc6Cae0jtsO0bKNIxfSMaULOWZgg6QaG1to3feeZdnx8XUs2dPGjgwjR7+62zKzg4YvGXUScQYSgi0GdMXxpMGlMC0Aurrg3o/r1+/fnTeeecJI2IkQw78lTB60XLR6zPZiDiqBpwyebLgw3CLF79DQ4cMESMVxnAi0/DPefjH71fvEr7V5/WKOj759DN65dXXafmKlRQbG0sDBgyge++9R53KUTGigO7fEumtra1iNUWIgnO7sEEJD4B8ybeuzgEr6YcfmqvjfbxyytVX5cv7FRU7TOEOZAbwH1HCMJu40A75FC3oSrCK2A4Kr127VmdfJ2pCWCPjNCVsCAp2m5qaTD6ev2PadLuQKCTf7qEOZNryVUOGMWB0g21DkRxIhuFWr15t9v6d0++y260AOXb8CHDW+NgkhDFgED+ahhQbeBiyoqJCTGsYEftP7GQM1OjnEhDhoft7tVgPTiUhxRQ2wv+58yNFjI0CqCRURY2apjVSB/i58zuNH3s6/dj8TkP/CeYD/5/8zkAzFHDzYQtZpkFZWRk1NvpHPxIKFuDG5Tw9PFZ+SUlJwIOJiYliB+SUr8pwu92i2CBs/agTdaMNaIt6TeVTNKBb8nE1NTU6G03HLVm4IfqWLVusvWmbz1N5Kh9ynfBVGQUFBXoHCOKjDslFdCEe4qO8ZtHh7OQTUQkarDZennMP2hkiM5QBwFU7A+c2yLS76NCIQfwIjQhEP5+IqeDxeMQ5V05cqShyGnCjrDJyQwl/+umnhYzZs2eL31KuU75DdJYf/XziqlWrxFEmVgH4JJ7KFKkShYWFwnA4AjZ+sUO+Q3SW76ZOIjbUDbmgdAYwnjQgOmT+/Pn0SwSms0e9IEcLVjO5ymE0paamipKXl2eVURhKOKazBHJ4IVbZkHyHCOAbK6/A0qVLxXHr1q229w10PhWm+78YMMH5u6gtLFgU2B+aXMgOtzBYZWAxysnJEcXJwgJYIwtZuCPt+G6KBnQjHydhXaEpdIiTb8dXjQjDwYD4zSPTEV+VoRYb5DvVH4a1GQBRySc6CrYjDZatwW4IOY6CbRWWgL9Dvqp/iIA9usE2oP+E8oE/Bj+ahjyXgIgW9HP5xIgQFCey70hMTU1P9HvLIO0aPZ69HQaQvwQ+myWH+beRfyMCo4NTxvy3mF9g5WiBAgZlkabnX0QXua/URlJf7VcUx38t/HdEb6CdtJt26rs8pGszPZ49JcEKdE2+aUT3wIEz4s7EFdyoXU9J2m8oFOr1A7RCL6GmmKYcz969b53jG0bkIezurp2/ZWrM7YkJ5P+8IuXKFOqV3O4+9hTtpuamFnHexH/vn/m4sUX//nLezXjs+ELGqAHUK6kX85qZX2Ved8KPS4ijjMkZFOeKJ1+9l/aV7uOjL6L6gUHXpVN8QnyADk74R+MaKHlCMrmSXHSw9hAd2XCI+h7ta8s3fGK33Cu1EQEKZEy5jC6dlGH+/mfWPtOIeG6YlpG4gTYhWB1nx7/j3anCiBLeOi+9fUuBkBGODwP+6dMc7sReP4gvceGQfpT96u0mXxoxHH+3q4rmrpwXsEXE1nf+H1+klGPJQfwY9EKcFpczXMsIUKDF20wthtHsgOfjqHuW252eaeVjBEkDSsVhkEsnX+aIn359umnANYu+E3pEwpcdIQ0Yqf53L7hHGPDf/3iL/jbpOWFABOtXTLnChu9O5AREt0w7H7DyuZVUPGdFSCVYAKVqv+UUhp5r5aMBtetquZ82UuFfPjY7I84V54i/r7SW3p/+Hr11a4GQIeGr8zriA+OemiAM71U4TvVf8+Z39PKDL9OB/+yntqrW9voNdxLAp27ZPJ21zD7Uh34IxPDXKbuPFsjfVLBJFAA+CUYFYFgnfPhAlAx2JzM+yRHXMKKrllc54mMmgAsZa1/6jm54fiJFov+Zb09TM52glh4t7JamiVGIUbl/aT31Pq93IJ80dwydRcApj3tivDgvX1LORtwXCV0sBnIUw79BnpM6f//gVf46PyqnZl9z+z3FxzpB2l0DafCwwWI675q7M8CAKtiImgerzQ/BUf0o1vdCOz4ajV7ElDpceYiKn13hmI/IIGPSZdTia6GXLl8ojA85I3OuCMsfgIjAMNYYNmb2q/5vKXHtjnemOqpfYgsnMJA/fTHnBVsDCj7pZWzE1sIa/b8cTp6iSHGYGnjsa3lWPqbwVMOAGElVPBVHzrxCXHfCv3BoP7ph7o3CACNzRvLo6uW4foxeX53PLOriqPq0juqXuPbmayk3N5euuema0PXT6bIYHqqNLKBkq76dIsE2vZyatOMFHk9VmZXfj0ehXETgD8c8dJUoqhE74lfwNIQ/g4xxT04wO0P62Y74e4r2cDj2mlnkwoQF5v3pix3VL4E0GqZyZfXODtov40S9beZWqtiSRu7EvoqT3ccLwVePfSnOT3nbfUuTfpzW6ZsbSW/Ns+Nj5GEUWOGt9zriYxq/d+d7PDVThB9rYb8GnypHVTi+CqkLRqhT/c32v+ChN+ZWUo9uPQK+WrLy27d97oE5CZorf4J2bZhtz37e9nzDgnwz1c14V+bbJiAuocHuS7R06st/cVp3atFP0RH+26BvpnraH3YD39X4dgkjFpbOqSDxwU97KkgXb8X49Vkb/ECYdFLX4scEC+DeIH043k1R+zsLD8XgXURbYXgFuh5f8YmcjIyJzY3Tu88epl1GQyidEjT/hvwIx0NH6Cit1zdhRVpAZ9ryrMK6Mr/diKmDtlyiXZw5VhstEpF2QCy1nv3CNn07Z3nbxqmCujK/mxCQNmg+p3ays7SxdL7rfBpy01CO9foHFMRs39d/T7/VkllY668PakfiG481fG3lxxpvHJDFSb9uEKVekyZiNIQnsVydEz7iyYsykwLqR6jjq/ZGVL/MJiEn2VDd4Lh+Kz+c/hpSYQlaYs0dMZNED2B3cP+qB4J6AfvQrx77wuyRt88sxqrFubg2j8oHYARrGgrZHJkWC8e/v+SBoH0uGvJG1uuO+OOeHB+0RSz/aLsZ84bjy82BiuJnV3KwvzGIj1UaqbBcf24seAgj6yLL4R0HzetIA8Fv4MsMO75UALsFabgxD17lmI8AGZ2Ggn03cErZvnXEx4yRBkT9suHYi8cb2aRwfKk/Anyp/wjeftrXj7d9msb5xIvIDkiIpvCuAVswCFQxhOOoDdpmfiOmN6p8KIFtn+Rjy4aGeC371lB8oJhzmRL3lTxgGsQJH7sdTD1sN+u485EJh1HRhmalI0Lqn9D+fxpLOGmSkOwSMwvtEC7FyE+282m2+D6xb4h8IlL8EheyX1IzMf5cmv9jIJUvlUBj1BQ/DIoSjq8iRcnI7LPLRYbgr1n0LafgJtBtr7W7lE35mxzxW4z0GzrhVubbBtIWvm0+UWZA1OmAbIqcDk6AEYmsicwhYopEwgdGzPRPIcwCX73XEQf1jpjhn85wQ4cMdzDCof7o/DULvxXnMq3W0WsSIIZfSAfkE9ETctSs5VK+pD270b1X+1A/InJp4oV2EF/iy8e/EAuKhLpYhOKbz3JyNf0P/qwPsjpWhOJjJZejF1kbmbnBtQuH9ndU/6HKw/QV6y5eUdxcYGbm1SSMySf/FxBLK/Xds/CyWmLcU+MF8dCOkWYkKVL2yvsKBJ/sT6GEV+WjJ9H78IvjOaut+iEnfIkxs8aKIxYWu4x4KH6z72R7O5BVDzEfO6p/zENjhCvBoiIzT9BDbYvJJ39muxC5MZmUVIdzP06OykVCXViwIUfQSWeQCgrkA/BJABxyhvHaFSNbKhGOj1GI7DZgXVDC8Q/zKDJdECeC1ZVadka4+iUf+qt8+/p5fW9sbPAkJLp6n6CTo9M0t3joQNkB/zuR9bXk+cZDX3J86FldYwoppfW0T69d6PHUvGfHR2Ar/RhkrVm0JmBKhuNj9Jw4fEIkWMttpnI4vuebGjEboAf8IurfurgsYv3hCyV/j/KSTOUb6hr7Ri22eDhlZP4uZqSIg+yAHuAX1rRVLw/Y9nR1vtj2cRq8OTHR9f5BOtyjiqpH+4Xo1FPrKchNehNto3JaphcjKbmQ3yvMVPedXZ0f5Hbd4rvcbk/zreF8N1Nc5BWMRC5NK7RLZnZ1/v8AzF+4wEVyJDcAAAAASUVORK5CYII=";

/***/ }),

/***/ 2357:
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ 8605:
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ 7211:
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ 2087:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ 2413:
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ 3867:
/***/ ((module) => {

"use strict";
module.exports = require("tty");

/***/ }),

/***/ 8835:
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ 1669:
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ 8761:
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ }),

/***/ 8593:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"name":"axios","version":"0.21.3","description":"Promise based HTTP client for the browser and node.js","main":"index.js","scripts":{"test":"grunt test","start":"node ./sandbox/server.js","build":"NODE_ENV=production grunt build","preversion":"npm test","version":"npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json","postversion":"git push && git push --tags","examples":"node ./examples/server.js","coveralls":"cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js","fix":"eslint --fix lib/**/*.js"},"repository":{"type":"git","url":"https://github.com/axios/axios.git"},"keywords":["xhr","http","ajax","promise","node"],"author":"Matt Zabriskie","license":"MIT","bugs":{"url":"https://github.com/axios/axios/issues"},"homepage":"https://axios-http.com","devDependencies":{"coveralls":"^3.0.0","es6-promise":"^4.2.4","grunt":"^1.3.0","grunt-banner":"^0.6.0","grunt-cli":"^1.2.0","grunt-contrib-clean":"^1.1.0","grunt-contrib-watch":"^1.0.0","grunt-eslint":"^23.0.0","grunt-karma":"^4.0.0","grunt-mocha-test":"^0.13.3","grunt-ts":"^6.0.0-beta.19","grunt-webpack":"^4.0.2","istanbul-instrumenter-loader":"^1.0.0","jasmine-core":"^2.4.1","karma":"^6.3.2","karma-chrome-launcher":"^3.1.0","karma-firefox-launcher":"^2.1.0","karma-jasmine":"^1.1.1","karma-jasmine-ajax":"^0.1.13","karma-safari-launcher":"^1.0.0","karma-sauce-launcher":"^4.3.6","karma-sinon":"^1.0.5","karma-sourcemap-loader":"^0.3.8","karma-webpack":"^4.0.2","load-grunt-tasks":"^3.5.2","minimist":"^1.2.0","mocha":"^8.2.1","sinon":"^4.5.0","terser-webpack-plugin":"^4.2.3","typescript":"^4.0.5","url-search-params":"^0.10.0","webpack":"^4.44.2","webpack-dev-server":"^3.11.0"},"browser":{"./lib/adapters/http.js":"./lib/adapters/xhr.js"},"jsdelivr":"dist/axios.min.js","unpkg":"dist/axios.min.js","typings":"./index.d.ts","dependencies":{"follow-redirects":"^1.14.0"},"bundlesize":[{"path":"./dist/axios.min.js","threshold":"5kB"}]}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module doesn't tell about it's top-level declarations so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(1603);
/******/ 	
/******/ })()
;