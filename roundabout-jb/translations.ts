export interface Translation {
    convertToRoundaboutJB: string;
    normalizeRoundaboutTurnsOn: string;
    actions: {
        roundaboutJBAdded: string;
    };
}

export type Languages = "en"|"he";

const translations: {
    [key in Languages]: Translation;
} = {
    "en": {
        convertToRoundaboutJB: "Convert to Roundabout JB",
        normalizeRoundaboutTurnsOn: "Normalize turns on {node} node",
        actions: {
            roundaboutJBAdded: "Added roundabout JB"
        }
    },
    "he": {
        convertToRoundaboutJB: "שנה לקופסת כיכר",
        normalizeRoundaboutTurnsOn: "סדר הנחיות בצומת {node}",
        actions: {
            roundaboutJBAdded: "קופסת כיכר נוספה"
        }
    }
};

export default translations;