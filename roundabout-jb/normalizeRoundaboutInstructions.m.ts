import type { Translation } from './translations';

export default function(translation: Translation) {
    // function that will be called once a selected features change
    function selectedFeaturesChangedCallback({ selected }: { selected: OpenLayers_Feature_Vector<Waze.FeatureVector<any>>[] }) {
        // ignore if selected features count isn't 1
        if (selected.length !== 1) {
            return;
        }

        // ignore if the selected feature isn't a segment
        if (selected[0].model.type !== 'segment') {
            return;
        }

        // [!] attributes:
        // [!] fwdDirection and revDirection of the model describes if you can drive forward/backward on the segment
        const segment = selected[0].model as Waze.SegmentFeature;

        // if the segment already in a roundabout, then we can't do anything to normalize it
        if (segment.isInRoundabout()) {
            return;
        }

        function isNodeCanBeNormalized(node: Waze.NodeFeature) { // should be inside a roundabout and in a bigJunction
            // return false if the node is not inside a bigJunction
            if (!node.isConnectedToBigJunction()) {
                return false;
            }

            // filter node segment ids, ignore the current segment
            let otherSegIds = node.getSegmentIds().filter(id => id !== segment.attributes.id);

            // if no other segments, then it's not in a roundabout
            if (otherSegIds.length === 0) {
                return false;
            }

            // filter segments that are not in roundabout, and set true if any segment is filtered
            let notARoundabout = otherSegIds.filter(id => !(W.model.segments.getObjectById(id) as Waze.SegmentFeature).isInRoundabout()).length > 0;
            
            return !notARoundabout;
        }

        function getTurnsThroughARoundabout(direction: string) {
            // get the vertex of the segment
            const vertexClass = require("Waze/Model/Graph/Vertex");
            const vertex = vertexClass[direction + "Of"](segment.getID());
            let allTurns = W.model.turnGraph.getTurnsFrom(vertex);
            // filter the turns without segment path (i.e length > 0)
            allTurns = allTurns.filter(turn => turn.turnData.segmentPath.length > 0).sort((a, b) => a.turnData.segmentPath.length < b.turnData.segmentPath.length ? -1 : 1);

            console.log(allTurns);

            // return the turns
            return allTurns;
        }

        function normalizeTurns(turns: any[]) {
            const turnOpcodes = [ "TURN_RIGHT", "CONTINUE", "TURN_LEFT", "UTURN" ];

            // Get the SetTurn action class
            const SetTurn = require("Waze/Model/Graph/Actions/SetTurn");
            // map the turns to SetTurn actions
            const actions = turns.map((turn, index) => new SetTurn(W.model.turnGraph, turn.withTurnData(turn.turnData.withInstructionOpcode(turnOpcodes[index]))));
            // add the actions to the actionManager model (in a foreach loop)
            for (let action of actions) {
                W.model.actionManager.add(action);
            }
        }

        function addNormalizeButtonToTheDOM(turns: any[], node: string) {
            // create the button with the classes: action-button waze-btn waze-btn-white
            // also add a 4px margin to the top
            const button = document.createElement("button");
            button.className = "action-button waze-btn waze-btn-white";
            button.style.marginTop = "4px";
            button.innerText = translation.normalizeRoundaboutTurnsOn.replace("{node}", node);
            button.onclick = normalizeTurns.bind(this, turns);

            // get the DOM container #segment-edit-general .form-group.more-actions
            // and append the button
            const container = document.querySelector("#segment-edit-general .form-group.more-actions");
            container.appendChild(button);
        }

        // if you can drive forward on the segment
        if (segment.attributes.fwdDirection) {
            if (isNodeCanBeNormalized(segment.getNodeByDirection("to"))) {
                // get the turns through a roundabout
                const forwardTurns = getTurnsThroughARoundabout("forward");
                // we can operate only if there are 4 exit turns
                if (forwardTurns.length === 4) {
                    addNormalizeButtonToTheDOM(forwardTurns, "B");
                }
            }
        }

        // if you can drive backward on the segment
        if (segment.attributes.revDirection) {
            if (isNodeCanBeNormalized(segment.getNodeByDirection("from"))) {
                // get the turns through a roundabout
                const backwardTurns = getTurnsThroughARoundabout("reverse");
                // we can operate only if there are 4 exit turns
                if (backwardTurns.length === 4) {
                    addNormalizeButtonToTheDOM(backwardTurns, "A");
                }
            }
        }

    }

    W.selectionManager.events.on("selectionchanged", selectedFeaturesChangedCallback);
}