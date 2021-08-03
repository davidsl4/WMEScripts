import type Translation from './translations';

export default function(translation: Translation, Action: any) {
    class NormalizeRoundaboutInstructionsAction extends Action {
        private subActions: any[];
        private fromSegment: Waze.SegmentFeature;
        private atNode: Waze.NodeFeature;

        constructor(turnActions: any[], fromSegment: Waze.SegmentFeature, atNode: Waze.NodeFeature) {
            super();

            this.fromSegment = fromSegment;
            this.atNode = atNode;

            // add turn actions as sub actions
            this.subActions.push.apply(this.subActions, turnActions);
        }

        getFocusFeatures(): Waze.FeatureVector<any>[] {
            return [ this.fromSegment, this.atNode ];
        }

        getAffectedUniqueIds() {
            return [ (this.fromSegment as any).getUniqueID() ]; // TODO: implement Waze.Model.Object class
        }

        generateDescription() {
            this._description = translation.translate("save.changes_log.actions.NormalizeRoundaboutTurns");
        }

        doAction() {
            return !this.subActions.map(subAction => subAction.doAction()).some(result => result === false);
        }

        setModel(model) {
            this.model = model;
            this.subActions.forEach(subAction => subAction.setModel(model));
        }
    }

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
            // filter node segment ids, ignore the current segment
            let otherSegIds = node.getSegmentIds().filter(id => id !== segment.attributes.id);

            // if no other segments, then it's not in a roundabout
            if (otherSegIds.length === 0) {
                return false;
            }

            // filter segments that are not in roundabout, and set true if any segment is filtered
            let notARoundabout = otherSegIds.filter(id => !(W.model.segments.getObjectById(id) as Waze.SegmentFeature).isInRoundabout()).length > 0;
            
            return notARoundabout ? false : node.isConnectedToBigJunction() ? true : "jb";
        }

        function getTurnsThroughARoundabout(direction: string) {
            // get the vertex of the segment
            const vertexClass = require("Waze/Model/Graph/Vertex");
            const vertex = vertexClass[direction + "Of"](segment.getID());
            let allTurns = W.model.turnGraph.getTurnsFrom(vertex);
            // filter the turns without segment path (i.e length > 0)
            allTurns = allTurns.filter(turn => turn.turnData.segmentPath.length > 0).sort((a, b) => a.turnData.segmentPath.length < b.turnData.segmentPath.length ? -1 : 1);

            // return the turns
            return allTurns;
        }

        function normalizeTurns(turns: any[], node: Waze.NodeFeature) {
            const rightHandTurnOpcodes = [ "TURN_RIGHT", "CONTINUE", "TURN_LEFT", "UTURN" ];
            const leftHandTurnOpcodes = [ "TURN_LEFT", "CONTINUE", "TURN_RIGHT", "UTURN" ];

            const isLeftHand = (selected[0].model as any).getAddress().getCountry().leftHandTraffic;

            // Get the SetTurn action class
            const SetTurn = require("Waze/Model/Graph/Actions/SetTurn");
            // map the turns to SetTurn actions
            const actions = turns.map((turn, index) => new SetTurn(W.model.turnGraph, turn.withTurnData(turn.turnData.withInstructionOpcode((isLeftHand ? leftHandTurnOpcodes : rightHandTurnOpcodes)[index % rightHandTurnOpcodes.length]))));
            // add the actions to the actionManager model (in a foreach loop)
            W.model.actionManager.add(new NormalizeRoundaboutInstructionsAction(actions, segment, node));
        }

        function addNormalizeButtonToTheDOM(turns: any[], node: string, nodeFeature: Waze.NodeFeature, disabledText: string|null) {
            // create the wrapper
            const wrapper = document.createElement("div");
            wrapper.className = "edit-house-numbers-btn-wrapper waze-tooltip";
            wrapper.setAttribute("data-toggle", "tooltip");
            wrapper.setAttribute("data-original-title", disabledText);
            
            // create the button with the classes: action-button waze-btn waze-btn-white
            // also add a 4px margin to the top and force 0 on the bottom
            const button = document.createElement("button");
            button.className = "action-button waze-btn waze-btn-white";
            // button.style.marginTop = "4px";
            // button.style.marginBottom = "0";
            button.innerText = translation.translate("edit.segment.normalize_roundabout_turns", ["node",  node]);
            if (disabledText === null)
                button.onclick = normalizeTurns.bind(this, turns, nodeFeature);
            else
            {
                button.disabled = true;
                // set pointer events to none to disable the button
                button.style.pointerEvents = "none";
            }

            // get the DOM container #segment-edit-general .form-group.more-actions
            // and append the button
            const container = document.querySelector("#segment-edit-general .form-group.more-actions");
            wrapper.appendChild(button);
            container.appendChild(wrapper);

            if (button.disabled) {
                $(wrapper).tooltip({
                    container: "body"
                });
            }
        }

        function normalizeFeatures(node: Waze.NodeFeature, direction: string, nodeName: string) {
            let canBeNormalized = isNodeCanBeNormalized(node);
            if (canBeNormalized !== false) {
                // get the turns through a roundabout
                const turns = getTurnsThroughARoundabout(direction);

                let disabledText = null;

                // if canBeNormalized's value is jb, then we can't normalize, but can show the button with the disabled message
                if (canBeNormalized === "jb") {
                    disabledText = translation.translate("edit.segment.normalize_roundabout_turns_disabled.not_connected_to_jb");
                }
                // we can operate only if there are 4 exit turns
                // if not, then disable the button with the text
                else if (turns.length !== 4) {
                    disabledText = translation.translate("edit.segment.normalize_roundabout_turns_disabled.exit_count_not_supported", [ "exit_count", turns.length ]);
                }
                addNormalizeButtonToTheDOM(turns, nodeName, node, disabledText);
            }
        }

        // if you can drive backward on the segment
        if (segment.attributes.revDirection) {
            normalizeFeatures(segment.getNodeByDirection("from"), "reverse", "A");
        }

        // if you can drive forward on the segment
        if (segment.attributes.fwdDirection) {
            normalizeFeatures(segment.getNodeByDirection("to"), "forward", "B");
        }
    }

    W.selectionManager.events.on("selectionchanged", selectedFeaturesChangedCallback);
}