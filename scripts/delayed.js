// eslint-disable-next-line import/no-cycle
import {
  loadScript,
  sampleRUM,
  fetchPlaceholders,
} from './lib-franklin.js';

// eslint-disable-next-line import/no-cycle
import {
  getLanguageCountryFromPath,
  pushProductsToDataLayer,
  getOperatingSystem,
} from './scripts.js';
import { loadBreadcrumbs } from './breadcrumbs.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

/**
 * Returns the environment name based on the hostname
 * @returns {String}
 */
function getEnvironment(hostname, country) {
  if (hostname.includes('hlx.page') || hostname.includes('hlx.live')) {
    return 'stage';
  }
  if (hostname.includes(`.${country}`)) {
    return 'prod';
  }
  return 'dev';
}

const PATHNAME = window.location.pathname;
const HOSTNAME = window.location.hostname;
const LANGUAGE_COUNTRY = getLanguageCountryFromPath(PATHNAME);
const LAUNCH_URL = 'https://assets.adobedtm.com';
const ENVIRONMENT = getEnvironment(HOSTNAME, LANGUAGE_COUNTRY.country);

/**
 * Returns the current user operating system based on userAgent
 * @returns {String}
 */
/**
 * Returns the value of a query parameter
 * @returns {String}
 */
function getParamValue(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

/**
 * Returns the current user time in the format HH:MM|HH:00-HH:59|dayOfWeek|timezone
 * @returns {String}
 */
function getCurrentTime() {
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const dayOfWeek = date.getDay();
  const timezone = date.getTimezoneOffset();
  return `${hours}:${minutes}|${hours}:00-${hours}:59|${dayOfWeek}|${timezone}`;
}

/**
 * Returns the current GMT date in the format DD/MM/YYYY
 * @returns {String}
 */
function getCurrentDate() {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Calculates the payload for tracking page load event.
function getPageLoadTrackingPayload(params) {
  const { languageCountry, pathname, environment } = params;
  const pageSections = pathname.split('/').filter((subPath) => subPath.trim() !== '' && subPath !== languageCountry.languageCountryPath) || [];
  return {
    pageInstanceID: environment,
    page: {
      info: {
        name: (pageSections.length > 0) ? pageSections.unshift('au') && pageSections.join(':') : 'Home', // e.g. au:consumer:product:internet security or au:consumer:solutions
        section: pageSections[0] || '',
        subSection: pageSections[1] || '',
        subSubSection: pageSections[2] || '',
        subSubSubSection: pageSections[3] || '',
        destinationURL: window.location.href,
        queryString: window.location.search,
        referringURL: getParamValue('ref') || getParamValue('adobe_mc') || document.referrer || '',
        serverName: 'hlx.live',
        language: navigator.language || navigator.userLanguage || languageCountry.language,
        sysEnv: getOperatingSystem(window.navigator.userAgent),
      },
      attributes: {
        promotionID: getParamValue('pid') || '',
        internalPromotionID: getParamValue('icid') || '',
        trackingID: getParamValue('cid') || '',
        time: getCurrentTime(),
        date: getCurrentDate(),
        domain: HOSTNAME,
        domainPeriod: HOSTNAME.split('.').length,
      },
    },
  };
}

function pushPageLoadEvent() {
  // Init Adobe data layer
  window.adobeDataLayer = window.adobeDataLayer || [];
  window.adobeDataLayerInPage = true;

  const trackingPayload = getPageLoadTrackingPayload({
    languageCountry: LANGUAGE_COUNTRY,
    pathname: PATHNAME,
    environment: ENVIRONMENT,
  });

  if (trackingPayload) {
    window.adobeDataLayer.push({
      event: 'page load started',
      ...trackingPayload,
    });
  }
}

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

pushPageLoadEvent();
pushProductsToDataLayer();

// Load breadcrumbs
loadBreadcrumbs();
