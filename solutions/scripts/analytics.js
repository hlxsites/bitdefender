/*
 * Copyright 2023 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
export async function setConsent(approved) {
  // eslint-disable-next-line no-undef
  if (!alloy) {
    // console.warn('alloy not initialized, cannot set consent');
    return Promise.resolve();
  }
  // eslint-disable-next-line no-undef
  return alloy('setConsent', {
    consent: [{
      standard: 'Adobe',
      version: '1.0',
      value: {
        general: approved ? 'in' : 'out',
      },
    }],
  });
}

async function sendEvent(xdm, data) {
  // eslint-disable-next-line no-undef
  if (!alloy) {
    // console.warn('alloy not initialized, cannot send analytics event');
    return Promise.resolve();
  }

  // eslint-disable-next-line no-undef
  return alloy('sendEvent', {
    documentUnloading: true,
    xdm,
    data,
  });
}

function getAlloyInitScript() {
  return `!function(n,o){o.forEach(function(o){n[o]||((n.__alloyNS=n.__alloyNS||[]).push(o),n[o]=
  function(){var u=arguments;return new Promise(function(i,l){n[o].q.push([i,l,u])})},n[o].q=[])})}(window,["alloy"]);`;
}

function createInlineScript(document, element, innerHTML, type) {
  const script = document.createElement('script');
  script.type = type;
  script.innerHTML = innerHTML;
  element.appendChild(script);
  return script;
}

export async function initAnalyticsTrackingQueue() {
  createInlineScript(document, document.body, getAlloyInitScript(), 'text/javascript');
}

function getAlloyConfiguration(document, datastreamConfig) {
  const { hostname } = document.location;
  return {
    debugEnabled: hostname.startsWith('localhost') || hostname.includes('--'),
    clickCollectionEnabled: true,
    defaultConsent: 'pending',
    ...datastreamConfig,
  };
}

export async function setupAnalyticsTracking(document, datastreamConfig) {
  // eslint-disable-next-line no-undef
  if (!alloy) {
    console.warn('alloy not initialized, cannot configure');
    return;
  }

  import('../vendor/adobe/adobe-client-data-layer.min.js');
  import('../vendor/adobe/alloy.min.js');

  // eslint-disable-next-line no-undef
  alloy('configure', getAlloyConfiguration(document, datastreamConfig));

  if (!window.adobeDataLayer) {
    window.adobeDataLayer = [];
  }
  window.adobeDataLayer.push((dl) => {
    dl.addEventListener('adobeDataLayer:event', (event) => {
      console.log('event', JSON.stringify(event));
      sendEvent(event.eventInfo);
    });
  });
}
