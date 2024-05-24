import { getMetadata } from './lib-franklin.js';

const TARGET_SESSION_ID_PARAM = 'adobeTargetSessionId';

const DEFAULT_AUDIENCE = 'current';

/**
 * Generate a random session id.
 * @param length
 * @returns {string}
 */
function generateSessionID(length = 16) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let sessionID = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    sessionID += characters.charAt(randomIndex);
  }
  return sessionID;
}

/**
 * Get or create a session id for the current user.
 * @returns {string}
 */
function getOrCreateSessionId() {
  let sessionId = sessionStorage.getItem(TARGET_SESSION_ID_PARAM);
  console.debug(`Session id: ${sessionId}`);
  if (!sessionId) {
    sessionId = generateSessionID();
    console.debug(`Generated new session id: ${sessionId}`);
    sessionStorage.setItem(TARGET_SESSION_ID_PARAM, sessionId);
  }
  return sessionId;
}

/**
 * Fetch the target offers for the current location.
 * @returns {Promise<boolean>}
 */
async function fetchJsonOffers(tenant, targetLocation) {
  console.debug(`Fetching target offers for location: ${targetLocation}`);
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

  return url;
}

export default function getTargetConfig(tenant) {
  const targetLocation = getMetadata('experiment-target-location');
  if (!targetLocation) {
    return {};
  }
  // eslint-disable-next-line no-console
  console.debug(`Setting up target audiences for location: ${targetLocation}`);
  async function audienceResolver() {
    return fetchJsonOffers(tenant, targetLocation);
  }
  return {
    audiences: {
      // eslint-disable-next-line max-len
      [DEFAULT_AUDIENCE]: () => audienceResolver().then((url) => !!url).catch(() => false),
    },
    configuredAudiences: audienceResolver().then((url) => {
      return {
        [DEFAULT_AUDIENCE]: url,
      };
    }),
  };
}
