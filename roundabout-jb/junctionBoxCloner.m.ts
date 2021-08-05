import type Translation from './translations';

import { canCloneJunctionBox, CanCloneJunctionBoxResult, getAllJunctionBoxTurns, getJunctionBoxConnectedSegments } from './utils/JunctionBoxUtils.js';

interface JunctionBoxClonedAttributes {
    name: string,
    cityID: number,
    rank: number,
    segIDs: number[]
}
interface JunctionBoxClonedData {
    attributes: JunctionBoxClonedAttributes,
    turns: any[],
    copiedJunctionId: number,
    changeableActions: any[],
    entrances: number[],
    exits: number[]
}

export default function(translations: Translation, Action) {
    let jbData: JunctionBoxClonedData = null;
    let copyDataDOMButton: HTMLButtonElement = null,
        pasteDataDOMButton: HTMLButtonElement = null;
    let currentSelectedJunctionBox: number = null;

    
    class PasteJunctionBoxAction extends Action {
        private subActions: any[];
        private affectingChangableActions: number[];
        repository: any;
        object: any;
        attributes: any;
        newAttributes: any;
        oldAttributes: any;
        stateChanged: boolean;
        
        get hasChanges() {
            return this.newAttributes.length !== 0;
        }

        constructor(subActions: any[], junctionBox: any, newAttributes: any) {
            super();
            this.subActions = subActions;
            this.object = junctionBox;

            this.attributes = this.oldAttributes = junctionBox.attributes;
            this.newAttributes = newAttributes;
            this.affectingChangableActions = jbData.changeableActions;
        }

        getFocusFeatures() {
            return [this.object];
        }

        getAffectedUniqueIds() {
            return [this.object.getUniqueID()];
        }

        generateDescription() {
            this._description = translations.translate("save.changes_log.actions.PasteJunctionBoxProps");
        }

        doAction() {
            jbData.changeableActions = [];
            this.repository = this.model.getRepository(this.object.getType());

            Object.assign(this.attributes, this.newAttributes);
            
            if (this.hasChanges) {
                if (this.object.isUnchanged()) {
                    this.object.setState("UPDATE");
                    this.stateChanged = true;
                }
                this.repository.changed(this.object);
            }


            return !this.subActions.map(subAction => subAction.doAction()).some(result => result === false);
        }

        undoAction() {
            Object.assign(this.attributes, this.oldAttributes);
            if (this.stateChanged) this.object.setState(null);
            this.repository.changed(this.object);
            this.subActions.forEach(subAction => subAction.undoAction());
            jbData.changeableActions = this.affectingChangableActions;
        }

        setModel(model) {
            this.model = model;
            this.subActions.forEach(subAction => subAction.setModel(model));
        }

        serialize() {
            let attributes = this.newAttributes;
            attributes.id = this.object.getID();
            return {
                _objectType: this.object.getType(),
                action: "UPDATE",
                attributes: attributes
            }
        }
    }


    function enableButton(button: HTMLButtonElement) {
        // enable the button and remove the tooltip (which applied to the parent)
        button.disabled = false;
        (button.parentNode as HTMLElement).removeAttribute("data-original-title");
        // also remove the pointer events
        button.style.pointerEvents = "auto";
    }
    function disableButton(button: HTMLButtonElement, tooltipText: string) {
        // disable the button and add the tooltip
        button.disabled = true;
        (button.parentNode as HTMLElement).setAttribute("data-original-title", tooltipText);
        // also remove the pointer events
        button.style.pointerEvents = "none";

        $(button.parentElement).tooltip({
            container: 'body'
        });
    }

    function isJunctionBoxChanged() {
        // return true if the jb data is null
        if (jbData === null) return true;

        // otherwise, check in the undo stack if the last actions were a junction box edit, and their id (in string, need to be converted) is higher than the last edit action id
        let undoStack = W.model.actionManager._undoStack;

        function isActionExistsInStack(stack: any[], actionId: string) {
            for (let action of stack) {
                if (action.getID() == actionId) return true;
                // if this action contains subActions, check them too
                if (action.hasOwnProperty("subActions")) {
                    if (isActionExistsInStack(action.subActions, actionId)) return true;
                }
            }
            return false;
        }

        return jbData.changeableActions.some(action => isActionExistsInStack(undoStack, action));
    }

    // subscribe to selected features changed event and operate only on big junctions
    function selectedFeaturesChangedCallback({ selected }) {
        // reset the links to the copy and paste buttons, and the junction box id
        copyDataDOMButton = pasteDataDOMButton = null;
        currentSelectedJunctionBox = null;

        // if the selection length isn't 1, return
        if (selected.length !== 1)
            return;

        // check if the selected model type is bigJunction
        if (selected[0].model.type != "bigJunction")
            return;

        // let jbEntrances = getJunctionBoxEntrances(selected[0].model);
        // let jbExits = getJunctionBoxExits(selected[0].model);
        let { entrances: jbEntrances, exits: jbExits } = getJunctionBoxConnectedSegments(selected[0].model, jbData !== null ? jbData.copiedJunctionId : null);

        let jbTurnsAnyToAny = getAllJunctionBoxTurns(selected[0].model, jbEntrances);

        function saveJbData() {
            // if we currently have a jb data, ask the user confirmation to overrite it
            if (jbData !== null) {
                if (!confirm(translations.translate("edit.big_junction.override_copied_props")))
                    return;
            }

            let attributes = {
                name: selected[0].model.attributes.name,
                cityID: selected[0].model.attributes.cityID,
                rank: selected[0].model.attributes.rank,
                segIDs: selected[0].model.attributes.segIDs
            };
    
            if (copyDataDOMButton) {
                disableButton(copyDataDOMButton, translations.translate("edit.big_junction.errors.props_already_saved"));
            }

            if (pasteDataDOMButton) {
                disableButton(pasteDataDOMButton, translations.translate("edit.big_junction.errors.no_changes"));
            }

            jbData = {
                attributes: attributes,
                turns: jbTurnsAnyToAny,
                copiedJunctionId: selected[0].model.attributes.id,
                changeableActions: [],
                entrances: jbEntrances.map(e => e.getID()),
                exits: jbExits.map(e => e.getID())
            }
        }
        
        function pasteJbData() {
            // if we don't have a jb data, return
            if (jbData === null) return;

            // if the jbData segIDs are different from the selected model segIDs
            if (jbData.attributes.segIDs.length !== selected[0].model.attributes.segIDs.length || !jbData.attributes.segIDs.every(id => selected[0].model.attributes.segIDs.includes(id))) {
                // loop over all jbData turns, check the possible turns between the segments on the current selected jb
                // then find the turn with the same length of segment path, and change the saved turn segment path to the current segment path
                let jbTurns = jbData.turns;
                for (let turn of jbTurns) {
                    // find the possible turns between the segments on the current selected jb
                    let possibleTurns = selected[0].model.getPossibleTurnsBetween(turn.fromVertex, turn.toVertex);
                    // find the turn with the same length of segment path
                    let turnWithSameLength = possibleTurns.find(t => t.turnData.segmentPath.length === turn.turnData.segmentPath.length);
                    // change the saved turn segment path to the current segment path
                    turn.turnData.segmentPath = turnWithSameLength.turnData.segmentPath;
                }
            }


            const SetTurn = require("Waze/Model/Graph/Actions/SetTurn");
            W.model.actionManager.add(new PasteJunctionBoxAction(jbData.turns.map(t => {
                return new SetTurn(W.model.turnGraph, t);
            }), selected[0].model, { 
                name: jbData.attributes.name,
                cityID: jbData.attributes.cityID,
                rank: jbData.attributes.rank
            }));

            lockUnlcokButtons();
        }

        function isCurrentJbHasChangesFromSave() {
            // if the name, cityID, rank or segIDs are different, return true
            if (jbData.attributes.name != selected[0].model.attributes.name ||
                jbData.attributes.cityID != selected[0].model.attributes.cityID ||
                jbData.attributes.rank != selected[0].model.attributes.rank ||
                jbData.attributes.segIDs != selected[0].model.attributes.segIDs) {
                    return true;
            }

            // if the turns count is different, return true
            if (jbData.turns.length != jbTurnsAnyToAny.length) {
                return true;
            }

            // loop over the turns and check if any of them are different (segment path, from and to ids)
            for (let i = 0; i < jbData.turns.length; i++) {
                if (jbData.turns[i].turnData.segmentPath != jbTurnsAnyToAny[i].turnData.segmentPath ||
                    jbData.turns[i].fromVertex.segmentID != jbTurnsAnyToAny[i].fromVertex.segmentID ||
                    jbData.turns[i].toVertex.segmentID != jbTurnsAnyToAny[i].toVertex.segmentID) {
                        return true;
                }
            }

            return false;
        }

        function addDOMButton(onclick: () => void|null, text: string, tooltip: string|null, enabled: boolean) {
            // create a wrapper div
            let wrapper = document.createElement('div');

            // set a tooltip if provided
            wrapper.setAttribute("data-original-title", tooltip || "");
            wrapper.setAttribute("data-toggle", "tooltip");
            $(wrapper).tooltip({ container: "body" });

            // create the button with the classes: action-button waze-btn waze-btn-smaller waze-btn-white
            const button = document.createElement("button");
            button.className = "action-button waze-btn waze-btn-smaller waze-btn-white";
            if (!enabled) {
                button.setAttribute("disabled", "");
                // set pointer events to none to disable the button
                button.style.pointerEvents = "none";
            }
            button.onclick = onclick;
            button.innerText = text;

            // add the button to the DOM
            wrapper.appendChild(button);
            let actionsContainer = document.querySelector(".controls.junction-actions");
            actionsContainer.appendChild(wrapper);

            return [ button, wrapper ];
        }

        let canClone: CanCloneJunctionBoxResult
        if (!isJunctionBoxChanged() && jbData.copiedJunctionId ===selected[0].model.attributes.id) canClone = CanCloneJunctionBoxResult.PropertiesCopied;
        else canClone = canCloneJunctionBox(selected[0].model, jbEntrances, jbTurnsAnyToAny);

        let copyPropsTooltip = null;
        switch (canClone) {
            case CanCloneJunctionBoxResult.Locked:
                copyPropsTooltip = "edit.big_junction.errors.locked";
                break;
            case CanCloneJunctionBoxResult.SegmentsLocked:
                copyPropsTooltip = "edit.big_junction.errors.segments_locked";
                break;
            case CanCloneJunctionBoxResult.TurnFeatureLocked:
                copyPropsTooltip = "edit.big_junction.errors.turn_feature_locked";
                break;
            case CanCloneJunctionBoxResult.PropertiesCopied:
                copyPropsTooltip = "edit.big_junction.errors.props_already_saved";
                break;
        }
        if (copyPropsTooltip !== null) copyPropsTooltip = translations.translate(copyPropsTooltip);

        let pasteButtonTooltip = null;
        // if the junction box is locked for the user (can be based on the canClone == locked), set the tooltip to the appropriate one
        if (canClone == CanCloneJunctionBoxResult.Locked)
            pasteButtonTooltip = "edit.big_junction.errors.locked"
        else if (jbData === null)
            pasteButtonTooltip = "edit.big_junction.errors.no_saved_props";
        // if some of the entrances or exits from the saved jb are not in exist in the current jb, set the tooltip to the appropriate one
        else if (jbData.entrances.some(e => !jbEntrances.some(ee => ee.getID() == e)) || jbData.exits.some(e => !jbExits.some(ee => ee.getID() == e)))
            pasteButtonTooltip = "edit.big_junction.errors.missing_entrances_exits";
        else if (canClone !== CanCloneJunctionBoxResult.Yes && !isCurrentJbHasChangesFromSave())
            pasteButtonTooltip = "edit.big_junction.errors.no_changes";
        
        if (pasteButtonTooltip !== null) pasteButtonTooltip = translations.translate(pasteButtonTooltip);

        copyDataDOMButton = addDOMButton(saveJbData, translations.translate("edit.big_junction.copy_props"), copyPropsTooltip, canClone === CanCloneJunctionBoxResult.Yes)[0] as HTMLButtonElement;
        pasteDataDOMButton = addDOMButton(pasteJbData, translations.translate("edit.big_junction.paste_props"), pasteButtonTooltip, jbData !== null && pasteButtonTooltip === null)[0] as HTMLButtonElement;
        currentSelectedJunctionBox = selected[0].model.attributes.id;
    }

    function lockUnlcokButtons() {
        if (copyDataDOMButton && pasteDataDOMButton) {
        // if (currentSelectedJunctionBox === jbData.copiedJunctionId) {
            if (isJunctionBoxChanged()) {
                // the copied jb changed, we can enable the buttons
                enableButton(copyDataDOMButton);
                enableButton(pasteDataDOMButton);
            }
            else {
                // the copied jb did not change, we can disable the buttons
                disableButton(copyDataDOMButton, translations.translate("edit.big_junction.errors.props_already_saved"));
                disableButton(pasteDataDOMButton, translations.translate("edit.big_junction.errors.no_changes"));
            }
        // }
        }
    }

    function onAfterAction({ action }, isSubAction?: boolean) {
        // if the jb data is null, then the junction box is not saved yet
        if (jbData === null) return;

        // if the action is a junction box action (we know that if the action has bigJunction property), and if so, check for the big junction id and compare it to the current junction box id
        if (action.bigJunction && action.bigJunction.attributes.id === jbData.copiedJunctionId) {
            // and if the junction box id is the same, then the junction box is changed, so add this action id to the change list of the jbData
            jbData.changeableActions.push(action.getID());
        }
        else 
        {
            // if the CLASS_NAME is a Waze.Action.SetTurn, then we have to check the from segment
            if (action.CLASS_NAME == "Waze.Action.SetTurn") {
                // check if the from segment is a entrance segment
                if (jbData.entrances.includes(action._turn.fromVertex.segmentID)) {
                    // if it is, calculate the matches in the turn data
                    // for it, first of all get the current turns from the segment (or return if the jb is null)
                    let jb = W.model.bigJunctions.getObjectById(jbData.copiedJunctionId);
                    if (!jb) return;
                    let currentTurns = jb.getTurnsFrom(action._turn.fromVertex);
                    // then count the matches by to vertex segment id and segment path
                    let matches = currentTurns.filter(t => t.toVertex.segmentID == action._turn.toVertex.segmentID && t.turnData.segmentPath == action._turn.turnData.segmentPath).length;
                    // if the matches are not the same, then changes were made
                    if (matches != currentTurns.length)
                        jbData.changeableActions.push(action.getID());
                }
            }

            // if we have subActions in the action, then we have to check them too (recursively)
            if (action.subActions) {
                for (let subAction of action.subActions) {
                    onAfterAction({ action: subAction }, true);
                }
            }
        }

        if (!isSubAction) {
            lockUnlcokButtons();
        }
    }

    function onAfterUndoAction({ action }) {
        // if the jb data is null, then the junction box is not saved yet
        if (jbData === null) return;

        lockUnlcokButtons();
    }

    function onAfterClearActions() {
        // if the jb data is null, then the junction box is not saved yet
        if (jbData === null) return;

        // clearing the actions means that the changes that change the JB state irelevant anymore
        // so we can clear the jb data changes
        jbData.changeableActions = [];
    }

    W.selectionManager.events.on("selectionchanged", selectedFeaturesChangedCallback);
    W.model.actionManager.events.on("afteraction", onAfterAction);
    W.model.actionManager.events.on("afterundoaction", onAfterUndoAction);
    W.model.actionManager.events.on("afterclearactions", onAfterClearActions);
}