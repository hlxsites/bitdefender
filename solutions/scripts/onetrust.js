import { loadScript } from './lib-franklin.js';
import { updateUserConsentStatus } from './analytics.js';

const CHECK_INTERVAL = 100;
const MAX_TRIES = 50;

function handleConsentChange(event) {
  if (event && Array.isArray(event.detail) && window.Optanon) {
    const hasConsent = window.OptanonActiveGroups.includes('C0002');
    updateUserConsentStatus(hasConsent);
    if (!window.adobeDataLayer) {
      window.adobeDataLayer = [];
    }
    window.adobeDataLayer.push({ event: 'OneTrustOnConsentChanged' });
  }
}

function checkAndSetInitialConsent() {
  const isConsentDone = document.cookie.match(/(?:^|;\s*)OptanonAlertBoxClosed=([^;]*)/);
  if (isConsentDone && window.Optanon && window.OptanonActiveGroups.includes('C0002')) {
    updateUserConsentStatus(true);
  }
}

function initializeConsentProcessing() {
  checkAndSetInitialConsent();
  window.Optanon.OnConsentChanged(handleConsentChange);
}

function waitForOneTrustAndInitialize() {
  let tries = 0;

  const interval = setInterval(() => {
    if (window.Optanon && window.OptanonActiveGroups) {
      clearInterval(interval);
      initializeConsentProcessing();
    } else if (tries >= MAX_TRIES) {
      // eslint-disable-next-line no-console
      console.error('OneTrust not available');
      clearInterval(interval);
    }
    tries += 1;
  }, CHECK_INTERVAL);
}

export default function loadOneTrust(domainID) {
  // eslint-disable-next-line no-console
  console.debug(`Loading OneTrust with ID: ${domainID}`);
  const attrs = {
    'data-domain-script': `${domainID}`,
    'data-layer-name': 'adobeDataLayer',
  };
  loadScript(`/solutions/vendor/onetrust/consent/${domainID}/otSDKStub.js`, {
    type: 'text/javascript',
    charset: 'UTF-8',
    ...attrs,
  }).then(waitForOneTrustAndInitialize);
}
