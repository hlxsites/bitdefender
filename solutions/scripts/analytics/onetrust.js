/* eslint-disable default-case */
import { loadScript } from '../lib-franklin.js';
import {analyticsSetConsent} from './lib-analytics.js';

const ONE_TRUST_ID = 'e20c9587-7d17-4f35-85f7-38c1eb9c3478'; // Set site provided OneTrust Id on here



/**
 * Runs initialization setup
 */
function setup() {
  // Consent preferences are selected when cookie OptanonAlertBoxClosed is present
  const isConsentDone = document.cookie.match(/(?:^|;\s*)OptanonAlertBoxClosed=([^;]*)/);
  if (isConsentDone) {
    // Runs the callback only when user has selected the consent.
   console.log("user chose preferences")  
   }
  // Setups OneTrust OnConsentChanged callback
  window.Optanon.OnConsentChanged((event) => {
    if (event && Array.isArray(event.detail)) {
      //window.location.reload();
      console.log("event is"+event.detail);
      analyticsSetConsent(true); 
      adobeDataLayer.push({event:"OneTrustOnConsentChanged"})}
    })
}

function initOneTrust() {
  /* Waits for OneTrust fully loaded to run initialization */
  let tries = 0;
  const interval = setInterval(() => {
    tries += 1;
    if (window.Optanon && window.OptanonActiveGroups) {
      clearInterval(interval);
      setup();
    } else if (tries > 10) {
      clearInterval(interval);
    }
  }, 500);
}

/**
 * Loads OneTrust cookie consent and when user selects its preferences
 * it executes the callback passed as parameter
 * Whenever the user changes the cookie preferences, the page is reloaded
 * @param {Function} callback executed when user selects consent
 */
export default function loadOneTrust() {
  const dataAttrs = {
    'data-domain-script': `${ONE_TRUST_ID}-test`,
    'data-dlayer-name': 'adobeDataLayer',
  };
  loadScript('../onetrust/consent/2e112ba7-dfdc-491a-8b9a-c862b3140402/otSDKStub.js', {
    type: 'text/javascript',
    charset: 'UTF-8',
    ...dataAttrs,
  }).then(() => {
    initOneTrust();
  });
}
