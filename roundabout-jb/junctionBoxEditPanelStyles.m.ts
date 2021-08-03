export default function() {
    // hook the selectionChanged event from the W.app.trigger method
    let origTrig = W.app.trigger;
    W.app.trigger = function(event) {
        // we want to apply our code after the original event is triggered
        origTrig.apply(this, arguments);

        if (event === 'selectionChanged') {
            // our code
            let selection = W.selectionManager._selectedFeatures;

            // if there is no selection or the model type is not junction box (AKA bigJunction) - return
            if (selection.length === 0 || selection[0].model.type !== "bigJunction") return;

            // new big junctions have a problem with the classes (more-actions instead of side-panel-section)
            // so we need to fix the class manually (new junctions are negative id)
            if (selection[0].model.attributes.id < 0) {
                // get the actions container
                let actionsContainer = document.querySelector(".controls.junction-actions").parentElement;

                // hook remove and add class methods, to ignore the "more-actions" class
                let origRemove = actionsContainer.classList.remove;
                actionsContainer.classList.remove = function(className) {
                    if (className === "side-panel-section") {
                        return;
                    }

                    origRemove.apply(this, arguments);
                }

                let origAdd = actionsContainer.classList.add;
                actionsContainer.classList.add = function(className) {
                    if (className === "more-actions") {
                        return;
                    }

                    origAdd.apply(this, arguments);
                }
            }
        }
    }

    // create style tag to change some junction box edit panel styles
    let styleTag = document.createElement("style");
    // set 4px margin-top to selector "#big-junction-edit-general .form-group.side-panel-section .controls.junction-actions > *:not(:first-child)"
    styleTag.innerHTML = `
        #big-junction-edit-general .form-group.side-panel-section .controls.junction-actions > *:not(:first-child) {
            margin-top: 4px;
        }
    `;
    // append style tag to the document
    document.head.appendChild(styleTag);
}