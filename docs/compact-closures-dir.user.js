// ==UserScript==
// @name         WME Compact Closure Directions
// @version      0.1
// @description  Use the new compact version of Waze for the direction field in the closures window
// @author       r0den
// @include     https://www.waze.com/editor*
// @include     https://www.waze.com/*/editor*
// @include     https://beta.waze.com/editor*
// @include     https://beta.waze.com/*/editor*
// @exclude     https://www.waze.com/user/*
// @exclude     https://www.waze.com/*/user/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=waze.com
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  function createChip(value, isChecked) {
    const element = document.createElement('wz-checkable-chip');
    element.setAttribute('show-check-icon-when-checked', 'false');
    element.value = value;
    element.checked = isChecked;
    return element;
  }
  function createDirectionChip(value, isChecked, beforeLabel, iconName, afterLabel) {
    const chip = createChip(value, isChecked);
    chip.appendChild(document.createTextNode(beforeLabel));

    const icon = document.createElement('i');
    icon.classList.add('w-icon');
    icon.classList.add('w-icon-' + iconName);
    chip.appendChild(icon);

    if (afterLabel) chip.appendChild(document.createTextNode(afterLabel));
    return chip;
  }

  function appendDirectionChipSelector(directionSelectElement) {
    directionSelectElement.style.display = 'none';

    const container = document.createElement('div');
    container.className = 'form-group segment-direction-editor';
    const label = document.createElement('wz-label');
    label.innerText = I18n.translate('closures.fields.direction');
    container.appendChild(label);

    const chips = document.createElement('wz-chip-select');
    const appendChip = (value, beforeLabel, iconName, afterLabel) => {
      const selectedValue = directionSelectElement.value;
      const isChecked = selectedValue === value;
      const chip = createDirectionChip(value, isChecked, beforeLabel, iconName, afterLabel);
      chips.appendChild(chip);
    };
    appendChip(3, I18n.translate('segment.direction.two_way'), 'arrow-two-way');
    appendChip(1, 'A', 'arrow-right', 'B');
    appendChip(2, 'B', 'arrow-right', 'A');
    chips.addEventListener('chipSelected', (e) => {
      const { value } = e.detail;
      directionSelectElement.value = value;
    });

    container.appendChild(chips);
    directionSelectElement.after(container);
  }

  // monitor the body element for changes, we have to wait for the #closure_direction element to be added
  const observer = new MutationObserver((mutations) => {
    const directionSelectElement = document.getElementById('closure_direction');
    const isHidden = directionSelectElement && directionSelectElement.style.display === 'none';
    if (directionSelectElement && !isHidden) {
      appendDirectionChipSelector(directionSelectElement);
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
