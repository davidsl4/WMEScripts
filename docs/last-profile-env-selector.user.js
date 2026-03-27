// ==UserScript==
// @name         Waze Editor Profile Environment Selector
// @version      1.0.0
// @description  Allows you to change the environment in the editor profile
// @author       You
// @match        https://waze.com/user/editor/*
// @match        https://waze.com/*/user/editor/*
// @match        https://*.waze.com/user/editor/*
// @match        https://*.waze.com/*/user/editor/*
// @match        https://*.wazestg.com/user/editor/*
// @match        https://*.wazestg.com/*/user/editor/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=waze.com
// @grant        none
// ==/UserScript==

(async function() {
  'use strict';

  const ENVIRONMENTS = {
    il: 'Israel',
    row: 'Rest of World',
    na: 'North America',
  };

  function waitForElement(selector, parent = document, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const element = parent.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }

      let timeoutId;
      const observer = new MutationObserver((mutations) => {
        const element = parent.querySelector(selector);
        if (element) {
          resolve(element);
          observer.disconnect();
          clearTimeout(timeoutId);
        }
      });
      observer.observe(parent, { childList: true, subtree: true });

      timeoutId = setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Element ${selector} not found within timeout`));
      }, timeout);
    });
  }

  class EditorProfileManager {
    static ENV_SERVICE_NAME = 'services:env:name';

    constructor(app) {
      this.app = app;
      this.initializedEnv = this.currentEnv = this.app.request(EditorProfileManager.ENV_SERVICE_NAME);
      this.changeReqResHandler(EditorProfileManager.ENV_SERVICE_NAME, () => this.currentEnv);
    }

    getReqResHandler(name) {
      return this.app.reqres._wreqrHandlers[name].callback;
    }

    changeReqResHandler(name, handler) {
      this.app.reqres._wreqrHandlers[name].callback = handler;
    }

    loadEnvironment(env) {
      if (this.currentEnv === env) return;
      this.currentEnv = env;
      this.refreshEnvironmentDependentRegions();
    }

    refreshEnvironmentDependentRegions() {
      const recentEdits = this.app.RecentEdits.Controller.load();
      this.app.recentEditsRegion.show(recentEdits);
    }
  };

  function createEnvironmentSelector(lastEnv) {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.marginLeft = '20px';

    const label = document.createElement('span');
    label.textContent = 'Environment: ';
    label.style.marginRight = '5px';
    container.appendChild(label);

    const select = document.createElement('select');
    for (const [env, name] of Object.entries(ENVIRONMENTS)) {
      const option = document.createElement('option');
      option.value = env;
      option.textContent = name;
      if (env === lastEnv) {
        option.selected = true;
        option.textContent = '* ' + name;
      }
      select.appendChild(option);
    }
    container.appendChild(select);

    return {
      appendTo(parent) {
        parent.appendChild(container);
      },
      addEventListener(event, handler) {
        return select.addEventListener(event, handler);
      },
      removeEventListener(event, handler) {
        return select.removeEventListener(event, handler);
      },
      get value() {
        return select.value;
      },
      set value(val) {
        select.value = val;
      },
    }
  }

  const userHeadlineElement = await waitForElement('.user-headline', document.getElementById('header'));
  const editorProfileManager = new EditorProfileManager(W.EditorProfile);
  const environmentSelector = createEnvironmentSelector(editorProfileManager.initializedEnv);
  environmentSelector.addEventListener('change', (event) => {
    const selectedEnv = event.target.value;
    editorProfileManager.loadEnvironment(selectedEnv);
  });
  environmentSelector.appendTo(userHeadlineElement);
})();
