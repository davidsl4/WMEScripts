// ==UserScript==
// @name         WME Last Build Started At
// @namespace    http://github.com/davidsl4/
// @version      1.0
// @description  Adds a new entry to the map tile build status dialog with the time the previous build started at
// @author       r0den
// @match        https://*.waze.com/*editor*
// @match        https://waze.com/*editor*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=waze.com
// @license      None. Feel free to do whatever you want.
// ==/UserScript==

// Define months as constants to avoid potential mutation
const MONTHS = Object.freeze(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);

/**
 * Formats the given date object into a string.
 * @param {Date} date
 * @returns {String} - Formatted date string in 'MMM DD YYYY, hh:mmA' format.
 */
function formatDate(date) {
  const month = MONTHS[date.getMonth()];
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear().toString().padStart(4, '0');

  let hour = (date.getHours() % 12).toString().padStart(2, '0');
  hour = hour === '00' ? '12' : hour;

  const minutes = date.getMinutes().toString().padStart(2, '0');
  const period = date.getHours() >= 12 ? 'PM' : 'AM';

  return `${month} ${day} ${year}, ${hour}:${minutes}${period}`;
}

/**
 * Mock implementation to override the behavior of a function on an object.
 * @param {Object} object - The object whose function is being mocked.
 * @param {string} fnName - The function name to override.
 * @param {Function} handler - The handler function to execute.
 */
function mockImplementation(object, fnName, handler) {
  const originalFunction = object[fnName];
  object[fnName] = function (...args) {
    return handler(args, originalFunction);
  };
}

/**
 * Updates the last build timestamp on the page.
 * @param {Date} timestamp - The timestamp of the last build start.
 * @param {HTMLElement} lastBuiltStartElement - The element to update with the formatted date.
 */
function updateLastBuildTimestamp(timestamp, lastBuiltStartElement) {
  if (lastBuiltStartElement) {
    lastBuiltStartElement.innerText = formatDate(timestamp);
  }
}

/**
 * Initializes the mutation observer and fetch mock to track build start times.
 */
async function init() {
  let lastBuildStartTimestamp = null;
  let lastBuiltStartElement = null;

  const dialogContainer = document.getElementById('wz-dialog-container');

  // Setup mutation observer to monitor DOM changes in the dialog container
  const observer = new MutationObserver((records) => {
    const dialogs = dialogContainer.getElementsByClassName('tile-build-status-card');
    if (!dialogs.length) return;

    const dialog = dialogs[0];

    if (dialog.getAttribute('data-added-last-build-start-time')) return;

    const previousBuildBlockContent = dialog.querySelector(
      'wz-dialog-content .tile-build-status-card-block:last-of-type .tile-build-status-card-block__content'
    );

    if (!previousBuildBlockContent) return;

    // Create a new caption node for the start time
    const firstCaption = previousBuildBlockContent.firstChild;
    const captionNode = firstCaption.cloneNode();
    captionNode.innerHTML = firstCaption.innerHTML;
    captionNode.style.paddingTop = '5px';
    captionNode.firstChild.innerText = 'Started at';
    lastBuiltStartElement = captionNode.lastChild;

    // Update the timestamp with the last known value
    updateLastBuildTimestamp(lastBuildStartTimestamp, lastBuiltStartElement);

    // Mark the dialog as updated
    dialog.setAttribute('data-added-last-build-start-time', true);

    firstCaption.after(captionNode);
  });

  // Observe changes in the dialog container
  observer.observe(dialogContainer, {
    subtree: true,
    childList: true,
  });

  // Mock the fetch function to intercept specific network requests
  mockImplementation(unsafeWindow, 'fetch', ([input, ...rest], originalFetch) => {
    const execOrig = () => originalFetch(input, ...rest);

    // Ensure input is a Request object and the URL matches the expected pattern
    if (!(input instanceof Request) || !input.url.includes('waze-tile-build-public') || !input.url.endsWith('-status.json')) {
      return execOrig();
    }

    // Clone the response to safely read its data
    return execOrig().then((response) => {
      const safeResponse = response.clone();
      safeResponse.json().then((data) => {
        lastBuildStartTimestamp = new Date(data.previous_build.start_time);
        updateLastBuildTimestamp(lastBuildStartTimestamp, lastBuiltStartElement);
      });

      return response;
    });
  });
}

// Initialize the script
init();
