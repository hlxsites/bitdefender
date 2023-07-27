// eslint-disable-next-line import/no-cycle
import {
  loadScript,
  sampleRUM,
  fetchPlaceholders,
  getMetadata,
} from './lib-franklin.js';

// eslint-disable-next-line import/no-cycle
import { getLanguageCountryFromPath } from './scripts.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

const languageCountry = getLanguageCountryFromPath(window.location.pathname);
const LAUNCH_URL = 'https://assets.adobedtm.com';
const { LAUNCH_PROD_SCRIPT, LAUNCH_STAGE_SCRIPT } = await fetchPlaceholders(`/${languageCountry.languageCountryPath}`);

function removeDoubleDashes(url) {
  return url.replace(/([^:]\/)\/+/g, '$1');
}

/**
 * Returns the instance name based on the hostname
 * @returns {String}
 */
function getInstance(hostname) {
  const hostToInstance = {
    'bitdefender.com': 'prod',
    'hlx.page': 'stage',
    'hlx.live': 'stage',
  };

  return Object.entries(hostToInstance).find(([host]) => hostname.includes(host))?.[1] || 'dev';
}

/**
 * Returns the current user operating system based on userAgent
 * @returns {String}
 */
function getOperatingSystem(userAgent) {
  const systems = [
    ['Windows NT 10.0', 'Windows 10'],
    ['Windows NT 6.2', 'Windows 8'],
    ['Windows NT 6.1', 'Windows 7'],
    ['Windows NT 6.0', 'Windows Vista'],
    ['Windows NT 5.1', 'Windows XP'],
    ['Windows NT 5.0', 'Windows 2000'],
    ['X11', 'X11'],
    ['Mac', 'MacOS'],
    ['Linux', 'Linux'],
    ['Android', 'Android'],
    ['like Mac', 'iOS'],
  ];

  return systems.find(([substr]) => userAgent.includes(substr))?.[1] || 'Unknown';
}

/**
 * Returns the sections based on the current URL
 * @returns {Object}
 */
function getPageSections(pathname, lc) {
  const pageSectionParts = window.location.pathname.split('/').filter((subPath) => subPath !== '' || subPath !== lc.languageCountryPath);
  const subSubSection = pageSectionParts[0];

  pageSectionParts[0] = DEFAULT_LANGUAGE === 'en' ? 'us' : DEFAULT_LANGUAGE;

  try {
    if (pageSectionParts[1].length === 2) pageSectionParts[1] = 'offers'; // landing pages

    pageSectionParts.splice(2, 0, subSubSection);

    return pageSectionParts;
  } catch (e) {
    return {
      pageName: 'us:404',
      section: 'us',
      subSection: '404',
    };
  }
}

// Calculates the payload for tracking page load event.
function getPageLoadTrackingPayload(params) {
  const sections = getPageSections(window.location.pathname, languageCountry);
  return {
    pageInstanceID: getInstance(window.location.hostname),
    page: {
      info: {
        name: pageSectionParts.join(':') || 'Home', // e.g. au:consumer:product:internet security or au:consumer:solutions
        section: sections[0] || '',
        subSection: sections[1] || '',
        subSubSection: sections[2] || '',
        subSubSubSection: sections[3] || '',
        destinationURL: window.location.href,
        queryString: window.location.search,
        referringURL: getParamValue('ref') || getParamValue('adobe_mc') || document.referrer || '',
        serverName: 'hlx.live',
        language: navigator.language || navigator.userLanguage || params.languageCountry.language,
        sysEnv: getOperatingSystem(window.navigator.userAgent),
      },
      attributes: {
        promotionID: getParamValue('pid') || '',
        internalPromotionID: getParamValue('icid') || '',
        trackingID: getParamValue('cid') || '',
        time: formatUserTime,
        date: currentGMTDate,
        domain: window.location.hostname,
        domainPeriod: window.location.hostname.split('.').length,
      },
    },
  };
}

function pushPageLoadEvent() {
  // Init Adobe data layer
  window.adobeDataLayer = window.adobeDataLayer || [];
  window.adobeDataLayerInPage = true;

  const trackingPayload = getPageLoadTrackingPayload({
    languageCountry,
  });

  if (trackingPayload) {
    window.adobeDataLayer.push({
      event: 'page load started',
      ...trackingPayload,
    });
  }
}

// Load Adobe Experience platform data collection (Launch) script
if (!window.location.host.includes('hlx.page') && !window.location.host.includes('localhost')) {
  loadScript(`${removeDoubleDashes(LAUNCH_URL + LAUNCH_PROD_SCRIPT)}`);
} else {
  loadScript(`${removeDoubleDashes(LAUNCH_URL + LAUNCH_STAGE_SCRIPT)}`);
}

pushPageLoadEvent();
