import Translations from "./translations.js";

import JunctionBoxEditPanelStylesModule from './junctionBoxEditPanelStyles.m.js';
import RoundaboutJBGeometryModule from './roundaboutJBGeometry.m.js';
import NormalizeRoundaboutInstructionsModule from './normalizeRoundaboutInstructions.m.js';
import JunctionBoxClonerModule from './junctionBoxCloner.m.js';

(async () => {
    console.log("[Roundabout JB] Loading script");

    while(!window.hasOwnProperty("require"))
    {
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    const translations = new Translations();

    const ActionClass = require("Waze/Action/AddAlternateStreet").__proto__;

    console.log("[Roundabout JB] Script loaded | Locale: %s", translations.locale);

    // run all modules
    JunctionBoxEditPanelStylesModule();
    RoundaboutJBGeometryModule(translations);
    NormalizeRoundaboutInstructionsModule(translations, ActionClass);
    JunctionBoxClonerModule(translations, ActionClass);
})();