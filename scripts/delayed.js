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

function pushPageLoadToDataLayer() {
  const tags = getTags(getMetadata(METADATA_ANAYTICS_TAGS));
  pushToDataLayer('page load started', {
    pageInstanceID: ENVIRONMENT,
    page: {
      info: {
        name: [LANGUAGE_COUNTRY.country, ...tags].join(':'), // e.g. au:consumer:product:internet security
        section: LANGUAGE_COUNTRY.country || '',
        subSection: tags[0] || '',
        subSubSection: tags[1] || '',
        subSubSubSection: tags[2] || '',
        destinationURL: window.location.href,
        queryString: window.location.search,
        referringURL: getParamValue('ref') || getParamValue('adobe_mc') || document.referrer || '',
        serverName: 'hlx.live', // indicator for AEM Success Edge
        language: navigator.language || navigator.userLanguage || LANGUAGE_COUNTRY.language,
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
  });
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

pushPageLoadToDataLayer();
pushProductsToDataLayer();

// Load breadcrumbs
loadBreadcrumbs();
