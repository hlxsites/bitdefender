// eslint-disable-next-line import/no-cycle
import {
  loadScript,
  sampleRUM,
  fetchPlaceholders,
  getMetadata,
} from './lib-franklin.js';

// eslint-disable-next-line import/no-cycle
import {
  getLanguageCountryFromPath,
  pushProductsToDataLayer,
  pushToDataLayer,
  getEnvironment,
  getOperatingSystem,
} from './scripts.js';
import { loadBreadcrumbs } from './breadcrumbs.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

const LANGUAGE_COUNTRY = getLanguageCountryFromPath(window.location.pathname);
const LAUNCH_URL = 'https://assets.adobedtm.com';
const ENVIRONMENT = getEnvironment(window.location.hostname, LANGUAGE_COUNTRY.country);

// Load Adobe Experience platform data collection (Launch) script
const { launchProdScript, launchStageScript, launchDevScript } = await fetchPlaceholders();
switch (ENVIRONMENT) {
  case 'prod':
    loadScript(LAUNCH_URL + launchProdScript); break;
  case 'stage':
    loadScript(LAUNCH_URL + launchStageScript); break;
  default:
    loadScript(LAUNCH_URL + launchDevScript); break;
}

pushProductsToDataLayer();
pushToDataLayer('page loaded');

// Load breadcrumbs
loadBreadcrumbs();

// Get the open URL for the user's OS
const openUrlMacos = getMetadata('open-url-macos');
const openUrlWindows = getMetadata('open-url-windows');
const openUrlAndroid = getMetadata('open-url-android');
const openUrlIos = getMetadata('open-url-ios');

if (openUrlMacos || openUrlWindows || openUrlAndroid || openUrlIos) {
  // Get user's operating system
  const { userAgent } = navigator;
  const userOS = getOperatingSystem(userAgent);

  // Open the appropriate URL based on the OS
  let openUrl;
  switch (userOS) {
    case 'MacOS':
      openUrl = openUrlMacos;
      break;
    case 'Windows 10':
    case 'Windows 8':
    case 'Windows 7':
    case 'Windows Vista':
    case 'Windows XP':
    case 'Windows 2000':
      openUrl = openUrlWindows;
      break;
    case 'Android':
      openUrl = openUrlAndroid;
      break;
    case 'iOS':
      openUrl = openUrlIos;
      break;
    default:
      openUrl = null; // Fallback or 'Unknown' case
  }

  if (openUrl) {
    window.open(openUrl, '_self');
  }
}
