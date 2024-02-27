/* eslint-disable default-case */
import { loadScript } from '../lib-franklin.js';
import { analyticsSetConsent } from './lib-analytics.js';

/**
 * Runs initialization setup
 */
function setup() {
    // Consent preferences are selected when cookie OptanonAlertBoxClosed is present
    const isConsentDone = document.cookie.match(/(?:^|;\s*)OptanonAlertBoxClosed=([^;]*)/);
    if (isConsentDone) {
        // Runs the callback only when user has selected the consent.
        if (window.Optanon && window.OptanonActiveGroups.includes('C0002')) {
            analyticsSetConsent(true);
        }
    }
    // Setups OneTrust OnConsentChanged callback
    window.Optanon.OnConsentChanged((event) => {
        if (event && Array.isArray(event.detail)) {
            //window.location.reload();
            if (window.Optanon && window.OptanonActiveGroups.includes('C0002')) {
                analyticsSetConsent(true);
            } else {
                analyticsSetConsent(false);
                //console.log("we set the content to false");
            }
            adobeDataLayer.push({ event: "OneTrustOnConsentChanged" })
        }
    })
}


function initOneTrust() {
  /* Waits for OneTrust fully loaded to run initialization */
  let tries = 0;
  const interval = setInterval(() => {
    console.log("optanon es "+window.OptanonActiveGroups);
    tries += 1;
    if (window.Optanon && window.OptanonActiveGroups) {
      clearInterval(interval);
      setup();
    } else if (tries > 10) {
      clearInterval(interval);
      interval = null;
    }
  }, 500);
}



/**
 * Loads OneTrust cookie consent and when user selects its preferences
 * it executes the callback passed as parameter
 * Whenever the user changes the cookie preferences, the page is reloaded
 * @param {Function} callback executed when user selects consent
 */
export default function loadOneTrust(ONE_TRUST_ID) {
    console.log('one trust idd '+ONE_TRUST_ID);
  const dataAttrs = {
    'data-domain-script': `${ONE_TRUST_ID}`,
    'data-dlayer-name': 'adobeDataLayer',
  };
  loadScript('/solutions/scripts/onetrust/consent/2e112ba7-dfdc-491a-8b9a-c862b3140402/otSDKStub.js', {
    type: 'text/javascript',
    charset: 'UTF-8',
    ...dataAttrs,
  }).then(() => {
    initOneTrust();
  });
}
