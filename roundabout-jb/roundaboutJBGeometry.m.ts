import type { Translation } from './translations';


function RDBExtractPolygon(junctionID: number) {

    if (W.model.junctions.objects.hasOwnProperty(junctionID) == false)
        return null;
    var segIDs = W.model.junctions.objects[junctionID].attributes.segIDs;
    if (segIDs.length == 0)
        return null;
    var i = 0;
    while (i < segIDs.length && W.model.segments.objects.hasOwnProperty(segIDs[i]) == false)
        i++;
    if (i == segIDs.length)
        return null;
    var seg = W.model.segments.objects[segIDs[i]];
    var firstSegID = segIDs[i];
    var polyPoints = new Array();
    var finished = false;
    while (!finished) {
        var followNode = null;
        var vertices = seg.geometry.getVertices();
        if (seg.attributes.fwdDirection) {
            for (var j = 0; j < vertices.length - 1; j++)
                polyPoints.push(vertices[j].clone());
            followNode = W.model.nodes.objects[seg.attributes.toNodeID];
        } else {
            for (var j = vertices.length - 1; j > 0; j--)
                polyPoints.push(vertices[j].clone());
            followNode = W.model.nodes.objects[seg.attributes.fromNodeID];
        }
        var nextSeg = null;
        for (var j = 0; j < followNode.attributes.segIDs.length; j++) {
            nextSeg = W.model.segments.objects[followNode.attributes.segIDs[j]];
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

    let ring = new OpenLayers.Geometry.LinearRing(polyPoints);
    ring = ring.resize(1.2, ring.getCentroid());
    var polygon = new OpenLayers.Geometry.Polygon(ring);
    polygon.calculateBounds();
    return polygon;
}

export default function(translations: Translation) {
    let cachedConverters = {};
    let tmpFunc = null;

    function beforeActionCallback({ action }: { action: any }) {
        // ignore if type is not bigJunction
        if (!action.hasOwnProperty("bigJunction"))
        {
            return;
        }

        tmpFunc = function() {
            let jID = W.model.segments.objects[action.bigJunction.attributes.segIDs[0]].attributes.junctionID;
            if (jID == null)
                return;
            let polygon = RDBExtractPolygon(jID);
            if (polygon == null)
                return;

            // get the last action and change the description and the geometry
            action._description = translations.actions.roundaboutJBAdded;
            action.initialGeometry = action.bigJunction.attributes.geometry = polygon;

            // redraw the feature
            let selectedJB = W.selectionManager.getSelectedFeatures()[0].layer;
            selectedJB.geometry = polygon;
            let featureToDraw = selectedJB._featureMap[action.bigJunction.attributes.id];
            selectedJB.removeFeatures(featureToDraw);
            featureToDraw.geometry = polygon;
            selectedJB.addFeatures(featureToDraw);

            cachedConverters[jID] = true;
            return true;
        }
    }

    function afterActionCallback({ action }: { action: any }) {
        if (!tmpFunc) return;
        // check if all segments are in a roundabout
        if (action.bigJunction.attributes.segIDs.filter(sid => !W.model.segments.objects[sid].isInRoundabout()).length === 0)
            cachedConverters[action.bigJunction.attributes.id] = tmpFunc;
        tmpFunc = null;
    }

    function selectedFeaturesChangedCallback({ selected }) {
        // if no selected features, then we don't need to do anything
        if (selected.length == 0)
        return;

        // check if the selected model type is bigJunction
        if (selected[0].model.type != "bigJunction")
        return;

        // check in the attributes if the junction id is less than 0, which means the JB is not yet created and can be manipulated
        // if the JB cannot be manipulated, we can't do anything and we return
        if (selected[0].model.attributes.junctionID >= 0)
        return;

        let converter = cachedConverters[selected[0].model.attributes.id];
        if (typeof converter === "undefined")
        return;

        // get the junction actions DOM element
        let junctionActionsDOM = document.getElementById("big-junction-edit-general").getElementsByClassName("junction-actions")[0] as HTMLElement;
        // change the "side-panel-section" of the parent class to "more-actions", but since there are more classes, we have to remove and add only those we need
        let junctionActionsDOMParent = junctionActionsDOM.parentNode as HTMLElement;
        junctionActionsDOMParent.classList.remove("side-panel-section");
        junctionActionsDOMParent.classList.add("more-actions");
        // create in runtime a button with classes: action-button select-short-segments waze-btn waze-btn-smaller waze-btn-white
        let convertToRoundaboutJBButtonDOM = document.createElement("button");
        convertToRoundaboutJBButtonDOM.classList.add("action-button", "select-short-segments", "waze-btn", "waze-btn-smaller", "waze-btn-white");
        convertToRoundaboutJBButtonDOM.innerHTML = translations.convertToRoundaboutJB;
        if (converter === true)
        {
            convertToRoundaboutJBButtonDOM.disabled = true;
        }
        else {
            convertToRoundaboutJBButtonDOM.onclick = function() {
                cachedConverters[selected[0].model.attributes.id]();
                convertToRoundaboutJBButtonDOM.disabled = true;
            }
        }
        // add the button to the DOM
        junctionActionsDOM.appendChild(convertToRoundaboutJBButtonDOM);
    }

    W.model.actionManager.events.on("beforeaction", beforeActionCallback);
    W.model.actionManager.events.on("afteraction", afterActionCallback);
    W.selectionManager.events.on("selectionchanged", selectedFeaturesChangedCallback);
};