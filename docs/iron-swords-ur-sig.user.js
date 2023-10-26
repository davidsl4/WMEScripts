// ==UserScript==
// @name         WME Iron Swords Signature
// @version      0.1
// @description  try to take over the world!
// @author       Israeli Community
// @match        https://*.waze.com/*editor*
// @match        https://waze.com/*editor*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=waze.com
// ==/UserScript==

const SIGNATURE = '\n\n🇮🇱 ביחד ננצח 🇮🇱';

async function init() {
  function mockImplementation(object, fnName, handler) {
    const originalFunction = object[fnName];
    object[fnName] = function(...args) {
      return handler(args, originalFunction);
    }
  }

  mockImplementation(unsafeWindow, 'Request', ([url, opts, ...rest], originalRequest) => {
    try {
      const rurl = new URL(url);
      if (rurl.pathname === unsafeWindow.W.Config.paths.updateRequestComments) {
        const origText = opts.body.get('text');
        if (!origText.endsWith(SIGNATURE)) opts.body.set('text', origText + SIGNATURE);
      }
    }
    finally {
      return new originalRequest(url, opts, ...rest);
    }
  });
};

if (unsafeWindow.W?.userscripts?.state.isInitialized) {
  init();
} else {
  document.addEventListener("wme-initialized", init, {
    once: true,
  });
}
