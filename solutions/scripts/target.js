import { getMetadata } from './lib-franklin.js';

const TARGET_SESSION_ID_PARAM = 'adobeTargetSessionId';

const DEFAULT_AUDIENCE = 'current';

/**
 * Get or create a session id for the current user.
 * @returns {string}
 */
function getOrCreateSessionId() {
  let sessionId = localStorage.getItem(TARGET_SESSION_ID_PARAM);
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(7);
    localStorage.setItem(TARGET_SESSION_ID_PARAM, sessionId);
  }
  return sessionId;
}

/**
 * Create a meta tag with the current url as the audience.
 * @param url
 */
function createAudienceMetadata(url) {
  const link = document.createElement('meta');
  link.setAttribute('property', `audience:${DEFAULT_AUDIENCE}`);
  link.content = url;
  document.getElementsByTagName('head')[0].appendChild(link);
}

/**
 * Fetch the target offers for the current location.
 * @returns {Promise<boolean>}
 */
async function fetchJsonOffers(tenant, targetLocation) {
  const res = await fetch(`https://${tenant}.tt.omtrdc.net/rest/v1/delivery?client=${tenant}&sessionId=${getOrCreateSessionId()}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      context: {
        channel: 'web',
      },
      execute: {
        pageLoad: {},
        mboxes: [
          {
            name: targetLocation,
            index: 0,
          },
        ],
      },
    }),
  });

  const payload = await res.json();
  const mbox = payload.execute.mboxes.find((m) => m.name === targetLocation);
  const { url } = mbox?.options[0].content ?? { url: null };

  // eslint-disable-next-line no-console
  console.debug(`Resolved challenger url: ${url}`);

  if (url) {
    createAudienceMetadata(url);
  }

  return !!url;
}

export default function getTargetAudiences(tenant) {
  const targetLocation = getMetadata('experiment-target-location');
  if (!targetLocation) {
    return {};
  }
  // eslint-disable-next-line no-console
  console.debug(`Setting up target audiences for location: ${targetLocation}`);
  return {
    [DEFAULT_AUDIENCE]: () => fetchJsonOffers(tenant, targetLocation),
  };
}
