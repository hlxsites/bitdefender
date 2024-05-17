import {
  sampleRUM,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateTags,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  loadCSS,
  getMetadata, loadScript,
} from './lib-franklin.js';

import {
  adobeMcAppendVisitorId,
  createTag, getDefaultLanguage, GLOBAL_EVENTS, localisationList,
} from './utils/utils.js';

const LCP_BLOCKS = ['hero']; // add your LCP blocks to the list
const TRACKED_PRODUCTS = [];

export const SUPPORTED_LANGUAGES = ['en'];
export const DEFAULT_LANGUAGE = getDefaultLanguage();

export const DEFAULT_COUNTRY = getDefaultLanguage();

export const METADATA_ANAYTICS_TAGS = 'analytics-tags';

const hreflangMap = new Map([
  ['en-ro', { baseUrl: 'https://www.bitdefender.ro', pageType: 'html' }],
  ['de', { baseUrl: 'https://www.bitdefender.de', pageType: 'html' }],
  ['sv', { baseUrl: 'https://www.bitdefender.se', pageType: 'html' }],
  ['pt', { baseUrl: 'https://www.bitdefender.pt', pageType: 'html' }],
  ['en-sv', { baseUrl: 'https://www.bitdefender.se', pageType: 'html' }],
  ['pt-BR', { baseUrl: 'https://www.bitdefender.com.br', pageType: 'html' }],
  ['en', { baseUrl: 'https://www.bitdefender.com', pageType: 'html' }],
  ['it', { baseUrl: 'https://www.bitdefender.it', pageType: 'html' }],
  ['fr', { baseUrl: 'https://www.bitdefender.fr', pageType: 'html' }],
  ['nl-BE', { baseUrl: 'https://www.bitdefender.br', pageType: 'html' }],
  ['es', { baseUrl: 'https://www.bitdefender.es', pageType: 'html' }],
  ['en-AU', { baseUrl: 'https://www.bitdefender.com.au', pageType: '', hasIndexPages: true }],
  ['ro', { baseUrl: 'https://www.bitdefender.ro', pageType: 'html' }],
  ['nl', { baseUrl: 'https://www.bitdefender.nl', pageType: 'html' }],
  ['en-GB', { baseUrl: 'https://www.bitdefender.co.uk', pageType: 'html' }],
  ['zh-hk', { baseUrl: 'https://www.bitdefender.com/zh-hk', pageType: '', hasIndexPages: true }],
  ['zh-tw', { baseUrl: 'https://www.bitdefender.com/zh-tw', pageType: '', hasIndexPages: true }],
  ['x-default', { baseUrl: 'https://www.bitdefender.com', pageType: 'html' }],
]);

window.hlx.plugins.add('rum-conversion', {
  load: 'lazy',
  url: '../plugins/rum-conversion/src/index.js',
});

function initMobileDetector(viewport) {
  const mobileDetectorDiv = document.createElement('div');
  mobileDetectorDiv.setAttribute(`data-${viewport}-detector`, '');
  document.body.append(mobileDetectorDiv);
}

export function isView(viewport) {
  const element = document.querySelectorAll(`[data-${viewport}-detector]`)[0];
  return !!(element && getComputedStyle(element).display !== 'none');
}

/**
 * Creates a meta tag with the given name and value and appends it to the head.
 * @param {String} name The name of the meta tag
 * @param {String} value The value of the meta tag
 */
export function createMetadata(name, value) {
  const meta = document.createElement('meta');
  meta.setAttribute('name', name);
  meta.setAttribute('content', value);
  document.head.append(meta);
}

export function getLanguageCountryFromPath() {
  return {
    language: DEFAULT_LANGUAGE,
    country: DEFAULT_COUNTRY,
  };
}

/**
 * Returns the current user operating system based on userAgent
 * @returns {String}
 */
export function getOperatingSystem(userAgent) {
  const systems = [
    ['Windows NT 10.0', 'Windows 10'],
    ['Windows NT 6.2', 'Windows 8'],
    ['Windows NT 6.1', 'Windows 7'],
    ['Windows NT 6.0', 'Windows Vista'],
    ['Windows NT 5.1', 'Windows XP'],
    ['Windows NT 5.0', 'Windows 2000'],
    ['X11', 'X11'],
    ['Linux', 'Linux'],
    ['Android', 'Android'],
    ['iPhone', 'iOS'],
    ['iPod', 'iOS'],
    ['iPad', 'iOS'],
    ['Mac', 'MacOS'],
  ];

  return systems.find(([substr]) => userAgent.includes(substr))?.[1] || 'Unknown';
}

/**
 * Returns the value of a query parameter
 * @returns {String}
 */
function getParamValue(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

export function openUrlForOs(urlMacos, urlWindows, urlAndroid, urlIos) {
  // Get user's operating system
  const { userAgent } = navigator;
  const userOS = getOperatingSystem(userAgent);

  // Open the appropriate URL based on the OS
  let openUrl;
  switch (userOS) {
    case 'MacOS':
      openUrl = urlMacos;
      break;
    case 'Windows 10':
    case 'Windows 8':
    case 'Windows 7':
    case 'Windows Vista':
    case 'Windows XP':
    case 'Windows 2000':
      openUrl = urlWindows;
      break;
    case 'Android':
      openUrl = urlAndroid;
      break;
    case 'iOS':
      openUrl = urlIos;
      break;
    default:
      openUrl = null; // Fallback or 'Unknown' case
  }

  if (openUrl) {
    window.open(openUrl, '_self');
  }
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
  const timezone = date.toTimeString().split(' ')[1];
  const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return `${hours}:${minutes}|${hours}:00-${hours}:59|${weekday[dayOfWeek]}|${timezone}`;
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

/**
 * Returns the environment name based on the hostname
 * @returns {String}
 */
export function getEnvironment(hostname) {
  if (hostname.includes('hlx.page') || hostname.includes('hlx.live')) {
    return 'stage';
  }
  if (hostname.includes('www.bitdefender')) {
    return 'prod';
  }
  return 'dev';
}

export function getDomain() {
  return window.location.pathname.split('/').filter((item) => item)[0];
}

export function getLocalizedResourceUrl(resourceName) {
  const { pathname } = window.location;
  const lastCharFromUrl = pathname.charAt(pathname.length - 1);
  const lpIsInFolder = lastCharFromUrl === '/';

  let pathnameAsArray = pathname.split('/');

  if (lpIsInFolder) {
    return `${pathnameAsArray.join('/')}${resourceName}`;
  }

  const basePathIndex = pathname.startsWith('/pages/') ? 3 : 2;
  pathnameAsArray = pathnameAsArray.slice(0, basePathIndex + 1); // "/consumer/en";

  return `${pathnameAsArray.join('/')}/${resourceName}`;
}

/**
 * Sets the page language.
 * @param {Object} param The language and country
 */
function setPageLanguage(param) {
  document.documentElement.lang = param.language;
  createMetadata('nav', `${getLocalizedResourceUrl('nav')}`);
  createMetadata('footer', `${getLocalizedResourceUrl('footer')}`);
}

export function pushToDataLayer(event, payload) {
  if (!event) {
    // eslint-disable-next-line no-console
    console.error('The data layer event is missing');
    return;
  }
  if (!window.adobeDataLayer) {
    window.adobeDataLayer = [];
    window.adobeDataLayerInPage = true;
  }
  window.adobeDataLayer.push({ event, ...payload });
}

export function getTags(tags) {
  return tags ? tags.split(':').filter((tag) => !!tag).map((tag) => tag.trim()) : [];
}

export function trackProduct(product) {
  // eslint-disable-next-line max-len
  const isDuplicate = TRACKED_PRODUCTS.find((p) => p.platformProductId === product.platformProductId && p.variantId === product.variantId);
  const tags = getTags(getMetadata(METADATA_ANAYTICS_TAGS));
  const isTrackedPage = tags.includes('product') || tags.includes('service');
  if (isTrackedPage && !isDuplicate) TRACKED_PRODUCTS.push(product);
}

export function pushProductsToDataLayer() {
  if (TRACKED_PRODUCTS.length > 0) {
    pushToDataLayer('product loaded', {
      product: TRACKED_PRODUCTS
        .map((p) => ({
          info: {
            ID: p.platformProductId,
            name: getMetadata('breadcrumb-title') || getMetadata('og:title'),
            devices: p.devices,
            subscription: p.subscription,
            version: p.version,
            basePrice: p.basePrice,
            discountValue: p.discount,
            discountRate: p.discountRate,
            currency: p.currency,
            priceWithTax: p.actualPrice,
          },
        })),
    });
  }
}

export function decorateBlockWithRegionId(element, id) {
  // we could consider to use `element.setAttribute('s-object-region', id);` in the future
  if (element) element.id = id;
}

export function decorateLinkWithLinkTrackingId(element, id) {
  if (element) element.setAttribute('s-object-id', id);
}

/**
 * Decorates picture elements with a link to a video.
 * @param {Element} main The main element
 */
export default function decorateLinkedPictures(main) {
  main.querySelectorAll('picture').forEach((picture) => {
    // this condition checks if the picture is part of some content block ( rte )
    // and not a direct element in some DIV block
    // that could have different behaviour for some blocks (ex: columns )
    if (!picture.closest('div.block') && picture.parentElement.tagName !== 'DIV') {
      const next = picture.parentNode.nextElementSibling;
      if (next) {
        const a = next.querySelector('a');
        const link = a?.textContent;
        /* Modal video */
        if (a && link.startsWith('https://') && link.includes('fragments')) {
          a.innerHTML = '';
          a.className = 'video-placeholder';
          a.appendChild(picture);
          const overlayPlayButton = document.createElement('span');
          overlayPlayButton.className = 'video-placeholder-play';
          a.appendChild(overlayPlayButton);
          a.addEventListener('click', async (event) => {
            event.preventDefault();
            // eslint-disable-next-line no-use-before-define
            const modalContainer = await createModal(link, 'video-modal');
            document.body.append(modalContainer);
          });
          const up = a.parentElement;
          if (up.childNodes.length === 1 && (up.tagName === 'P' || up.tagName === 'DIV')) {
            up.classList.add('modal-video-container');
          }
          return;
        }
        // Basic linked image
        if (a && link.startsWith('https://')) {
          a.innerHTML = '';
          a.className = 'linked-image';
          const pictureParent = picture.parentNode;
          a.append(picture);
          if (pictureParent.children.length === 0) {
            pictureParent.parentNode.removeChild(pictureParent);
          }
          const up = a.parentElement;
          if (up.childNodes.length === 1 && (up.tagName === 'P' || up.tagName === 'DIV')) {
            up.classList.add('linked-image-container');
          }
        }
      }
    }
  });
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  decorateTags(main);
  decorateLinkedPictures(main);
  decorateSections(main);
  decorateBlocks(main);
}

/**
 *
 * @param {String} path The path to the modal
 * @param {String} template The template to use for the modal styling
 * @returns {Promise<Element>}
 * @example
 */
export async function createModal(path, template) {
  const modalContainer = document.createElement('div');
  modalContainer.classList.add('modal-container');

  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');

  // fetch modal content
  const resp = await fetch(`${path}.plain.html`);

  if (!resp.ok) {
    // eslint-disable-next-line no-console
    console.error(`modal url cannot be loaded: ${path}`);
    return modalContainer;
  }

  const html = await resp.text();
  modalContent.innerHTML = html;

  decorateMain(modalContent);
  await loadBlocks(modalContent);
  modalContainer.append(modalContent);

  // add class to modal container for opportunity to add custom modal styling
  if (template) modalContainer.classList.add(template);

  const closeModal = () => modalContainer.remove();
  const close = document.createElement('div');
  close.classList.add('modal-close');
  close.addEventListener('click', closeModal);
  modalContent.append(close);
  return modalContainer;
}

export async function detectModalButtons(main) {
  main.querySelectorAll('a.button.modal').forEach((link) => {
    link.addEventListener('click', async (e) => {
      e.preventDefault();
      document.body.append(await createModal(link.href));
    });
  });
}

function populateColumns(section) {
  if (section.querySelectorAll('.columns div div').length === 2) {
    const rightColContainer = section.querySelector('.columns div div:last-child');
    rightColContainer.classList.add('right-col');
    section.querySelector('.columns div div:last-child').classList.add('right-col');
    const leftColContainer = section.querySelector('.columns div div:first-child');
    leftColContainer.classList.add('left-col');

    section.querySelectorAll('.right-column').forEach((el) => rightColContainer.append(el));
    section.querySelectorAll('.left-column').forEach((el) => leftColContainer.append(el));
  }
}

function populateHero(section) {
  if (section.querySelectorAll('.hero div div').length === 2) {
    const rightColContainer = section.querySelector('.hero div div:last-child');
    rightColContainer.classList.add('right-col');
    section.querySelector('.hero div div:last-child').classList.add('right-col');
    const leftColContainer = section.querySelector('.hero div div:first-child');
    leftColContainer.classList.add('left-col');

    section.querySelectorAll('.right-column').forEach((el) => rightColContainer.append(el));
    section.querySelectorAll('.left-column').forEach((el) => leftColContainer.append(el));
  }
}

function buildTwoColumnsSection(main) {
  main.querySelectorAll('div.section.two-columns').forEach((section) => {
    populateHero(section);
    populateColumns(section);
  });
}

function buildCta(section) {
  populateColumns(section);
  const fullWidthContainer = createTag(
    'div',
    { class: 'full-width' },
    '',
  );
  [...section.children].forEach((el) => fullWidthContainer.append(el));
  section.append(fullWidthContainer);
}

function buildCtaSections(main) {
  main.querySelectorAll('div.section.cta, div.section.footer-cta')
    .forEach(buildCta);
}

function getDomainInfo(hostname) {
  const domain = hostname.match(/^(?:.*?\.)?([a-zA-Z0-9\\_]{3,}(\.|:)?(?:\w{2,8}|\w{2,4}\.\w{2,4}))$/);
  return {
    domain: domain[1],
    domainPartsCount: domain[1].split('.').length,
  };
}

function pushPageLoadToDataLayer() {
  const { hostname } = window.location;
  if (!hostname) {
    return;
  }

  const { domain, domainPartsCount } = getDomainInfo(hostname);
  const languageCountry = getLanguageCountryFromPath(window.location.pathname);
  const environment = getEnvironment(hostname, languageCountry.country);
  const tags = getTags(getMetadata(METADATA_ANAYTICS_TAGS));
  pushToDataLayer('page load started', {
    pageInstanceID: environment,
    page: {
      info: {
        name: [languageCountry.country, ...tags].join(':'), // e.g. au:consumer:product:internet security
        section: languageCountry.country || '',
        subSection: tags[0] || '',
        subSubSection: tags[1] || '',
        subSubSubSection: tags[2] || '',
        destinationURL: window.location.href,
        queryString: window.location.search,
        referringURL: getParamValue('adobe_mc_ref') || getParamValue('ref') || document.referrer || '',
        serverName: 'hlx.live', // indicator for AEM Success Edge
        language: navigator.language || navigator.userLanguage || languageCountry.language,
        sysEnv: getOperatingSystem(window.navigator.userAgent),
      },
      attributes: {
        promotionID: getParamValue('pid') || '',
        internalPromotionID: getParamValue('icid') || '',
        trackingID: getParamValue('cid') || '',
        time: getCurrentTime(),
        date: getCurrentDate(),
        domain,
        domainPeriod: domainPartsCount,
      },
    },
  });
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  console.log('body', doc.body);
  setPageLanguage(getLanguageCountryFromPath(window.location.pathname));
  decorateTemplateAndTheme();
  const templateMetadata = getMetadata('template');
  const hasTemplate = getMetadata('template') !== '';
  if (hasTemplate) {
    loadCSS(`${window.hlx.codeBasePath}/scripts/template-factories/${templateMetadata}.css`);
    // loadScript(`${window.hlx.codeBasePath}/scripts/template-factories/${templateMetadata}.js`, {
    //   type: 'module',
    // });
  }
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    buildCtaSections(main);
    buildTwoColumnsSection(main);
    detectModalButtons(main);
    document.body.classList.add('appear');
    await waitForLCP(LCP_BLOCKS);
  }
}

// todo remove export after having a clear path for the
// overall unit testing strategy of the all page
export function generateHrefLang() {
  hreflangMap.forEach(({ baseUrl, pageType }, key) => {
    const link = document.createElement('link');
    link.setAttribute('rel', 'alternate');
    link.setAttribute('hreflang', key);

    const foundLanguage = localisationList.find((item) => baseUrl.indexOf(`/${item}/`) !== -1 || window.location.pathname.indexOf(`/${item}/`) !== -1);
    const isHomePage = window.location.pathname === `/${foundLanguage}/`;

    const lastCharFromHref = window.location.pathname.slice(-1);
    const isCurrentIndexPage = lastCharFromHref === '/';
    const suffix = `${!isHomePage && pageType && !isCurrentIndexPage ? `.${pageType}` : ''}`;

    let href = `${baseUrl}${window.location.pathname.replace(/\/us\/en/, '')}`;
    href = `${href}${suffix}`;

    href = href.replace(`/${foundLanguage}`, '');

    link.setAttribute('href', href);
    document.head.appendChild(link);
  });
}

export async function loadTrackers() {
  const isPageNotInDraftsFolder = window.location.pathname.indexOf('/drafts/') === -1;

  const onAdobeMcLoaded = () => {
    document.dispatchEvent(new Event(GLOBAL_EVENTS.ADOBE_MC_LOADED));
    window.ADOBE_MC_EVENT_LOADED = true;
  };

  if (isPageNotInDraftsFolder) {
    const LANGUAGE_COUNTRY = getLanguageCountryFromPath(window.location.pathname);
    const LAUNCH_URL = 'https://assets.adobedtm.com';
    const ENVIRONMENT = getEnvironment(window.location.hostname, LANGUAGE_COUNTRY.country);

    // Load Adobe Experience platform data collection (Launch) script
    // const { launchProdScript, launchStageScript, launchDevScript } = await fetchPlaceholders();

    const ADOBE_MC_URL_ENV_MAP = new Map([
      ['prod', '8a93f8486ba4/5492896ad67e/launch-b1f76be4d2ee.min.js'],
      ['stage', '8a93f8486ba4/5492896ad67e/launch-3e7065dd10db-staging.min.js'],
      ['dev', '8a93f8486ba4/5492896ad67e/launch-fbd6d02d30e8-development.min.js'],
    ]);

    const adobeMcScriptUrl = `${LAUNCH_URL}/${ADOBE_MC_URL_ENV_MAP.get(ENVIRONMENT)}`;
    await loadScript(adobeMcScriptUrl);

    onAdobeMcLoaded();

    await loadScript('https://www.googletagmanager.com/gtm.js?id=GTM-PLJJB3');
  } else {
    onAdobeMcLoaded();
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');

  // eslint-disable-next-line no-unused-vars
  loadHeader(doc.querySelector('header'));
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);

  const templateMetadata = getMetadata('template');
  const hasTemplate = getMetadata('template') !== '';
  if (hasTemplate) {
    loadCSS(`${window.hlx.codeBasePath}/scripts/template-factories/${templateMetadata}-lazy.css`);
  }

  loadTrackers();

  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));

  generateHrefLang();
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  window.setTimeout(() => {
    window.hlx.plugins.load('delayed');
    window.hlx.plugins.run('loadDelayed');
    // load anything that can be postponed to the latest here
    // eslint-disable-next-line import/no-cycle
    return import('./delayed.js');
  }, 3000);
}

async function loadPage() {
  pushPageLoadToDataLayer();
  await window.hlx.plugins.load('eager');
//   document.documentElement.innerHTML = `
//   <!DOCTYPE html>
// <html>
//   <head>
//     <title>Bitdefender Trusted. Always.</title>
//     <link rel="canonical" href="https://www.bitdefender.com/en-us/trusted/">
//     <meta name="description" content="With integrity and demonstrated results, Bitdefender aims to embody trust in cybersecurity today and tomorrow.">
//     <meta property="og:title" content="Bitdefender Trusted. Always.">
//     <meta property="og:description" content="With integrity and demonstrated results, Bitdefender aims to embody trust in cybersecurity today and tomorrow.">
//     <meta property="og:url" content="https://www.bitdefender.com/en-us/trusted/">
//     <meta property="og:image" content="https://www.bitdefender.com/en-us/trusted/media_19da99aea11eabd49cf05bac78ff78c8b4b6d3a30.jpeg?width=1200&#x26;format=pjpg&#x26;optimize=medium">
//     <meta property="og:image:secure_url" content="https://www.bitdefender.com/en-us/trusted/media_19da99aea11eabd49cf05bac78ff78c8b4b6d3a30.jpeg?width=1200&#x26;format=pjpg&#x26;optimize=medium">
//     <meta name="twitter:card" content="summary_large_image">
//     <meta name="twitter:title" content="Bitdefender Trusted. Always.">
//     <meta name="twitter:description" content="With integrity and demonstrated results, Bitdefender aims to embody trust in cybersecurity today and tomorrow.">
//     <meta name="twitter:image" content="https://www.bitdefender.com/en-us/trusted/media_19da99aea11eabd49cf05bac78ff78c8b4b6d3a30.jpeg?width=1200&#x26;format=pjpg&#x26;optimize=medium">
//     <meta name="analytics-tags" content="trusted">
//     <meta name="template" content="trusted">
//     <meta name="meta-locales" content="de-DE,nl-NL,fr-FR,it-IT,ro-RO">
//     <meta name="meta-job-name" content="Trusted-LP – 2 Apr 2024">
//     <meta name="referrer" content="no-referrer-when-downgrade">
//     <meta name="viewport" content="width=device-width, initial-scale=1">
//     <script src="/_src/scripts/lib-franklin.js" type="module"></script>
//     <script src="/_src/scripts/utils/utils.js" type="module"></script>
//     <script src="/_src/scripts/scripts.js" type="module"></script>
//     <link rel="stylesheet" href="/_src/styles/styles.css">
//   <script>window.LiveReloadOptions={port:3000,host:location.hostname,https:false};</script><script src="/__internal__/livereload.js"></script><meta property="hlx:proxyUrl" content="https://main--www-websites--bitdefender.hlx.page/en-us/trusted/"></head>
//   <body>
//     <header></header>
//     <main>
//       <div>
//         <div class="section-metadata">
//           <div>
//             <div data-valign="middle">video-player-settings</div>
//             <div data-valign="middle">muted, loop, playsinline, controlslist=nodownload nofullscreen noremoteplayback noplaybackrate, disablepictureinpicture</div>
//           </div>
//           <div>
//             <div data-valign="middle">video-player-poster</div>
//             <div data-valign="middle">
//               <picture>
//                 <source type="image/webp" srcset="./media_19da99aea11eabd49cf05bac78ff78c8b4b6d3a30.jpeg?width=2000&#x26;format=webply&#x26;optimize=medium" media="(min-width: 600px)">
//                 <source type="image/webp" srcset="./media_19da99aea11eabd49cf05bac78ff78c8b4b6d3a30.jpeg?width=750&#x26;format=webply&#x26;optimize=medium">
//                 <source type="image/jpeg" srcset="./media_19da99aea11eabd49cf05bac78ff78c8b4b6d3a30.jpeg?width=2000&#x26;format=jpeg&#x26;optimize=medium" media="(min-width: 600px)">
//                 <img loading="lazy" alt="" src="./media_19da99aea11eabd49cf05bac78ff78c8b4b6d3a30.jpeg?width=750&#x26;format=jpeg&#x26;optimize=medium" width="1366" height="768">
//               </picture>
//             </div>
//           </div>
//         </div>
//         <div class="trusted-hero">
//           <div>
//             <div data-valign="middle">
//               <h1 id="trusted-always">Trusted. Always.</h1>
//               <h2 id="two-decades-of-unparalleled-cybersecurity-excellence">Two decades of unparalleled cybersecurity excellence.</h2>
//               <p>Bitdefender is a global cybersecurity leader delivering innovative and award-winning cyber protection to millions of consumers and businesses worldwide.</p>
//               <p><a href="https://www.bitdefender.com/solutions/">Explore Home</a></p>
//               <p><a href="https://www.bitdefender.com/business/">Explore Business</a></p>
//             </div>
//           </div>
//           <div>
//             <div data-valign="middle">https://www.bitdefender.com/en-us/trusted/media_18416f5764794dacd18f8eef0dad9dc77223f2a9b.mp4</div>
//           </div>
//         </div>
//       </div>
//
//
//
//       <div>
//         <div class="section-metadata">
//           <div>
//             <div data-valign="middle"></div>
//             <div data-valign="middle"></div>
//           </div>
//           <div>
//             <div data-valign="middle"></div>
//             <div data-valign="middle">
//             </div>
//           </div>
//         </div>
//         <div class="trusted-main-carousel">
//           <div></div>
//         </div>
//       </div>
//
//
//
//       <div>
//         <div class="section-metadata">
//           <div>
//             <div data-valign="middle">style</div>
//             <div data-valign="middle">static-awards</div>
//           </div>
//         </div>
//         <p><a href="https://www.bitdefender.com/business/awards.html">https://www.bitdefender.com/business/awards.html</a></p>
//         <p>
//           <picture>
//             <source type="image/webp" srcset="./media_15b0d4cf1c1f202337fa1633926b914b9597867eb.png?width=2000&#x26;format=webply&#x26;optimize=medium" media="(min-width: 600px)">
//             <source type="image/webp" srcset="./media_15b0d4cf1c1f202337fa1633926b914b9597867eb.png?width=750&#x26;format=webply&#x26;optimize=medium">
//             <source type="image/png" srcset="./media_15b0d4cf1c1f202337fa1633926b914b9597867eb.png?width=2000&#x26;format=png&#x26;optimize=medium" media="(min-width: 600px)">
//             <img loading="lazy" alt="" src="./media_15b0d4cf1c1f202337fa1633926b914b9597867eb.png?width=750&#x26;format=png&#x26;optimize=medium" width="2560" height="589">
//           </picture>
//         </p>
//         <p>
//           <picture>
//             <source type="image/webp" srcset="./media_1b7aa7ae003b6c296bbbddbffe6076e953bc92352.png?width=2000&#x26;format=webply&#x26;optimize=medium" media="(min-width: 600px)">
//             <source type="image/webp" srcset="./media_1b7aa7ae003b6c296bbbddbffe6076e953bc92352.png?width=750&#x26;format=webply&#x26;optimize=medium">
//             <source type="image/png" srcset="./media_1b7aa7ae003b6c296bbbddbffe6076e953bc92352.png?width=2000&#x26;format=png&#x26;optimize=medium" media="(min-width: 600px)">
//             <img loading="lazy" alt="" src="./media_1b7aa7ae003b6c296bbbddbffe6076e953bc92352.png?width=750&#x26;format=png&#x26;optimize=medium" width="274" height="230">
//           </picture>
//         </p>
//         <p>
//           <picture>
//             <source type="image/webp" srcset="./media_1028483a62826284062aedc9c5db4a15f24b8aedd.png?width=2000&#x26;format=webply&#x26;optimize=medium" media="(min-width: 600px)">
//             <source type="image/webp" srcset="./media_1028483a62826284062aedc9c5db4a15f24b8aedd.png?width=750&#x26;format=webply&#x26;optimize=medium">
//             <source type="image/png" srcset="./media_1028483a62826284062aedc9c5db4a15f24b8aedd.png?width=2000&#x26;format=png&#x26;optimize=medium" media="(min-width: 600px)">
//             <img loading="lazy" alt="" src="./media_1028483a62826284062aedc9c5db4a15f24b8aedd.png?width=750&#x26;format=png&#x26;optimize=medium" width="191" height="33">
//           </picture>
//         </p>
//         <p>
//           <picture>
//             <source type="image/webp" srcset="./media_15103826d8b2db92c6a21d186e531e6e36420f011.png?width=2000&#x26;format=webply&#x26;optimize=medium" media="(min-width: 600px)">
//             <source type="image/webp" srcset="./media_15103826d8b2db92c6a21d186e531e6e36420f011.png?width=750&#x26;format=webply&#x26;optimize=medium">
//             <source type="image/png" srcset="./media_15103826d8b2db92c6a21d186e531e6e36420f011.png?width=2000&#x26;format=png&#x26;optimize=medium" media="(min-width: 600px)">
//             <img loading="lazy" alt="" src="./media_15103826d8b2db92c6a21d186e531e6e36420f011.png?width=750&#x26;format=png&#x26;optimize=medium" width="142" height="33">
//           </picture>
//         </p>
//         <p>
//           <picture>
//             <source type="image/webp" srcset="./media_157355851d5575141f599150de7effb7be92189a6.jpeg?width=2000&#x26;format=webply&#x26;optimize=medium" media="(min-width: 600px)">
//             <source type="image/webp" srcset="./media_157355851d5575141f599150de7effb7be92189a6.jpeg?width=750&#x26;format=webply&#x26;optimize=medium">
//             <source type="image/jpeg" srcset="./media_157355851d5575141f599150de7effb7be92189a6.jpeg?width=2000&#x26;format=jpeg&#x26;optimize=medium" media="(min-width: 600px)">
//             <img loading="lazy" alt="" src="./media_157355851d5575141f599150de7effb7be92189a6.jpeg?width=750&#x26;format=jpeg&#x26;optimize=medium" width="520" height="504">
//           </picture>
//         </p>
//         <p>
//           <picture>
//             <source type="image/webp" srcset="./media_1db10703722df323faebf65a84913972c93fd5237.png?width=2000&#x26;format=webply&#x26;optimize=medium" media="(min-width: 600px)">
//             <source type="image/webp" srcset="./media_1db10703722df323faebf65a84913972c93fd5237.png?width=750&#x26;format=webply&#x26;optimize=medium">
//             <source type="image/png" srcset="./media_1db10703722df323faebf65a84913972c93fd5237.png?width=2000&#x26;format=png&#x26;optimize=medium" media="(min-width: 600px)">
//             <img loading="lazy" alt="" src="./media_1db10703722df323faebf65a84913972c93fd5237.png?width=750&#x26;format=png&#x26;optimize=medium" width="326" height="120">
//           </picture>
//         </p>
//       </div>
//       <div>
//         <div class="section-metadata">
//           <div>
//             <div data-valign="middle">style</div>
//             <div data-valign="middle">particle-band</div>
//           </div>
//         </div>
//       </div>
//       <div>
//         <div class="section-metadata">
//           <div>
//             <div data-valign="middle">style</div>
//             <div data-valign="middle">trusted-bg-1</div>
//           </div>
//           <div>
//             <div data-valign="middle">links-open-in-new-tab</div>
//             <div data-valign="middle">true</div>
//           </div>
//         </div>
//         <div class="columns">
//           <div>
//             <div>
//               <p><u>OUR VISION</u></p>
//               <h2 id="to-become-the-worlds-most-trusted-cybersecurity-provider">To become the world’s most trusted cybersecurity provider.</h2>
//             </div>
//             <div>
//               <p>Bitdefender’s vision is unwavering: to become the world’s most trusted cybersecurity provider, offering unmatched protection and peace of mind. We achieve this through relentless innovation and technical excellence, staying ahead of sophisticated threats with advanced solutions.</p>
//               <p>Beyond safeguarding our customers, we’re committed to being a force for good globally, collaborating with law enforcement and contributing to next-generation research initiatives to move the industry forward. With integrity and demonstrated results, Bitdefender aims to embody trust in cybersecurity today and tomorrow.</p>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div>
//         <div class="section-metadata">
//           <div>
//             <div data-valign="middle">links-open-in-new-tab</div>
//             <div data-valign="middle">true</div>
//           </div>
//         </div>
//         <div class="columns">
//           <div>
//             <div>
//               <picture>
//                 <source type="image/webp" srcset="./media_13f65d642460fe406f73f4393ec140c65a52797ab.jpeg?width=2000&#x26;format=webply&#x26;optimize=medium" media="(min-width: 600px)">
//                 <source type="image/webp" srcset="./media_13f65d642460fe406f73f4393ec140c65a52797ab.jpeg?width=750&#x26;format=webply&#x26;optimize=medium">
//                 <source type="image/jpeg" srcset="./media_13f65d642460fe406f73f4393ec140c65a52797ab.jpeg?width=2000&#x26;format=jpeg&#x26;optimize=medium" media="(min-width: 600px)">
//                 <img loading="lazy" alt="" src="./media_13f65d642460fe406f73f4393ec140c65a52797ab.jpeg?width=750&#x26;format=jpeg&#x26;optimize=medium" width="900" height="900">
//               </picture>
//             </div>
//             <div>
//               <p>
//                 <picture>
//                   <source type="image/webp" srcset="./media_10cb390e06d45f0c857cc4dbac57bae0e51a14db0.png?width=2000&#x26;format=webply&#x26;optimize=medium" media="(min-width: 600px)">
//                   <source type="image/webp" srcset="./media_10cb390e06d45f0c857cc4dbac57bae0e51a14db0.png?width=750&#x26;format=webply&#x26;optimize=medium">
//                   <source type="image/png" srcset="./media_10cb390e06d45f0c857cc4dbac57bae0e51a14db0.png?width=2000&#x26;format=png&#x26;optimize=medium" media="(min-width: 600px)">
//                   <img loading="lazy" alt="" src="./media_10cb390e06d45f0c857cc4dbac57bae0e51a14db0.png?width=750&#x26;format=png&#x26;optimize=medium" width="200" height="120">
//                 </picture>
//               </p>
//               <h2 id="bitdefender-ranked-1-on-pcmags-best-brands-for-2024-list-of-technology-providers">Bitdefender ranked #1 on PCMag’s Best Brands for 2024 list of technology providers.</h2>
//               <p>Technology authority PCMag ranked Bitdefender number one on its highly coveted “Best Brands for 2024” list of technology vendors. PCMag rated Bitdefender ahead of some of the industry’s best-known names based on an index that combines customer satisfaction scores with the magazine’s product review evaluations.</p>
//               <p><a href="https://www.bitdefender.com/news/bitdefender-earns-top-spot-on-pcmag-s-best-brands-list-for-2024.html">Read more</a></p>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div>
//         <div class="section-metadata">
//           <div>
//             <div data-valign="middle">style</div>
//             <div data-valign="middle">bg-white</div>
//           </div>
//           <div>
//             <div data-valign="middle">links-open-in-new-tab</div>
//             <div data-valign="middle">true</div>
//           </div>
//         </div>
//         <div class="columns">
//           <div>
//             <div>
//               <p>
//                 <picture>
//                   <source type="image/webp" srcset="./media_15b0d4cf1c1f202337fa1633926b914b9597867eb.png?width=2000&#x26;format=webply&#x26;optimize=medium" media="(min-width: 600px)">
//                   <source type="image/webp" srcset="./media_15b0d4cf1c1f202337fa1633926b914b9597867eb.png?width=750&#x26;format=webply&#x26;optimize=medium">
//                   <source type="image/png" srcset="./media_15b0d4cf1c1f202337fa1633926b914b9597867eb.png?width=2000&#x26;format=png&#x26;optimize=medium" media="(min-width: 600px)">
//                   <img loading="lazy" alt="" src="./media_15b0d4cf1c1f202337fa1633926b914b9597867eb.png?width=750&#x26;format=png&#x26;optimize=medium" width="2560" height="589">
//                 </picture>
//               </p>
//               <h2 id="bitdefender-named-a-visionary-in-the-2023-gartner-magic-quadrant-for-endpoint-protection-platforms">Bitdefender named a Visionary in the 2023 Gartner® Magic Quadrant™ for Endpoint Protection Platforms.</h2>
//               <p>Our placement as Visionary in the Gartner Magic Quadrant for Endpoint Protection Platforms is in our opinion another top-tier independent evaluation which further confirms our strong cybersecurity vision and relentless focus on innovation.</p>
//               <p><a href="https://www.bitdefender.com/business/campaign/2023-gartner-magic-quadrant-epp.html">Read more</a></p>
//             </div>
//             <div>
//               <picture>
//                 <source type="image/webp" srcset="./media_148eab48c3acdd44f1ef2d0f43fefbd17076aa34f.jpeg?width=2000&#x26;format=webply&#x26;optimize=medium" media="(min-width: 600px)">
//                 <source type="image/webp" srcset="./media_148eab48c3acdd44f1ef2d0f43fefbd17076aa34f.jpeg?width=750&#x26;format=webply&#x26;optimize=medium">
//                 <source type="image/jpeg" srcset="./media_148eab48c3acdd44f1ef2d0f43fefbd17076aa34f.jpeg?width=2000&#x26;format=jpeg&#x26;optimize=medium" media="(min-width: 600px)">
//                 <img loading="lazy" alt="" src="./media_148eab48c3acdd44f1ef2d0f43fefbd17076aa34f.jpeg?width=750&#x26;format=jpeg&#x26;optimize=medium" width="160" height="160">
//               </picture>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div>
//         <div class="section-metadata">
//           <div>
//             <div data-valign="middle">links-open-in-new-tab</div>
//             <div data-valign="middle">true</div>
//           </div>
//         </div>
//         <div class="columns">
//           <div>
//             <div>
//               <picture>
//                 <source type="image/webp" srcset="./media_1e616930aadd55ea656ed7ddd8d0492ee47753a85.jpeg?width=2000&#x26;format=webply&#x26;optimize=medium" media="(min-width: 600px)">
//                 <source type="image/webp" srcset="./media_1e616930aadd55ea656ed7ddd8d0492ee47753a85.jpeg?width=750&#x26;format=webply&#x26;optimize=medium">
//                 <source type="image/jpeg" srcset="./media_1e616930aadd55ea656ed7ddd8d0492ee47753a85.jpeg?width=2000&#x26;format=jpeg&#x26;optimize=medium" media="(min-width: 600px)">
//                 <img loading="lazy" alt="" src="./media_1e616930aadd55ea656ed7ddd8d0492ee47753a85.jpeg?width=750&#x26;format=jpeg&#x26;optimize=medium" width="900" height="900">
//               </picture>
//             </div>
//             <div>
//               <p>
//                 <picture>
//                   <source type="image/webp" srcset="./media_122dd6de6e3f822112da52d3cb1d5a5890f3646eb.png?width=2000&#x26;format=webply&#x26;optimize=medium" media="(min-width: 600px)">
//                   <source type="image/webp" srcset="./media_122dd6de6e3f822112da52d3cb1d5a5890f3646eb.png?width=750&#x26;format=webply&#x26;optimize=medium">
//                   <source type="image/png" srcset="./media_122dd6de6e3f822112da52d3cb1d5a5890f3646eb.png?width=2000&#x26;format=png&#x26;optimize=medium" media="(min-width: 600px)">
//                   <img loading="lazy" alt="" src="./media_122dd6de6e3f822112da52d3cb1d5a5890f3646eb.png?width=750&#x26;format=png&#x26;optimize=medium" width="241" height="56">
//                 </picture>
//               </p>
//               <h2 id="years-of-leadership-for-best-protection--performance">10 Years of Leadership for Best Protection &#x26; Performance</h2>
//               <p>Over the last two decades, we have consistently proven our unparalleled expertise and our unwavering commitment to our users by outperforming all competitors in terms of protection, performance, and usability and earning wide recognition for our outstanding results in AV-Test independent tests.</p>
//               <p><a href="https://www.bitdefender.com/news/bitdefender-earns-record-six-av-test-best-cybersecurity-awards.html?fbclid=IwAR3xJaVFtZ6SMQRAGKrCamDgBtN5DXe8XnujSmS98xJLeTU2_agtFJyCgP4">Read more</a></p>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div>
//         <div class="section-metadata">
//           <div>
//             <div data-valign="middle">style</div>
//             <div data-valign="middle">bg-white</div>
//           </div>
//           <div>
//             <div data-valign="middle">links-open-in-new-tab</div>
//             <div data-valign="middle">true</div>
//           </div>
//         </div>
//         <div class="columns">
//           <div>
//             <div>
//               <p>
//                 <picture>
//                   <source type="image/webp" srcset="./media_1d3956f33b36eabaf61b2c5d1dac9ee55f05d9add.png?width=2000&#x26;format=webply&#x26;optimize=medium" media="(min-width: 600px)">
//                   <source type="image/webp" srcset="./media_1d3956f33b36eabaf61b2c5d1dac9ee55f05d9add.png?width=750&#x26;format=webply&#x26;optimize=medium">
//                   <source type="image/png" srcset="./media_1d3956f33b36eabaf61b2c5d1dac9ee55f05d9add.png?width=2000&#x26;format=png&#x26;optimize=medium" media="(min-width: 600px)">
//                   <img loading="lazy" alt="" src="./media_1d3956f33b36eabaf61b2c5d1dac9ee55f05d9add.png?width=750&#x26;format=png&#x26;optimize=medium" width="350" height="56">
//                 </picture>
//               </p>
//               <h2 id="bitdefender-named-a-leader-in-the-forrester-wave-endpoint-security-q4-2023">Bitdefender named a Leader in The Forrester Wave™: Endpoint Security, Q4 2023.</h2>
//               <p>According to the Forrester report, Bitdefender “differentiates with its aggressive prevention-first mindset” and has received the highest possible scores in 10 criteria, including Malware Prevention, Network Threat Detection, Patching Remediation, Innovation, and Pricing Flexibility and Transparency.</p>
//               <p><a href="https://businessresources.bitdefender.com/forrester-wave-endpoint-security-q4-2023">Read more</a></p>
//             </div>
//             <div>
//               <picture>
//                 <source type="image/webp" srcset="./media_1b35b2f17dd35d6cf3992df17fbc684ac3a3abf6a.jpeg?width=2000&#x26;format=webply&#x26;optimize=medium" media="(min-width: 600px)">
//                 <source type="image/webp" srcset="./media_1b35b2f17dd35d6cf3992df17fbc684ac3a3abf6a.jpeg?width=750&#x26;format=webply&#x26;optimize=medium">
//                 <source type="image/jpeg" srcset="./media_1b35b2f17dd35d6cf3992df17fbc684ac3a3abf6a.jpeg?width=2000&#x26;format=jpeg&#x26;optimize=medium" media="(min-width: 600px)">
//                 <img loading="lazy" alt="" src="./media_1b35b2f17dd35d6cf3992df17fbc684ac3a3abf6a.jpeg?width=750&#x26;format=jpeg&#x26;optimize=medium" width="160" height="160">
//               </picture>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div>
//         <div class="section-metadata">
//           <div>
//             <div data-valign="middle">links-open-in-new-tab</div>
//             <div data-valign="middle">true</div>
//           </div>
//         </div>
//         <div class="columns">
//           <div>
//             <div>
//               <picture>
//                 <source type="image/webp" srcset="./media_18dcda5cf9a6059650e5ec8095c250c5192d81529.jpeg?width=2000&#x26;format=webply&#x26;optimize=medium" media="(min-width: 600px)">
//                 <source type="image/webp" srcset="./media_18dcda5cf9a6059650e5ec8095c250c5192d81529.jpeg?width=750&#x26;format=webply&#x26;optimize=medium">
//                 <source type="image/jpeg" srcset="./media_18dcda5cf9a6059650e5ec8095c250c5192d81529.jpeg?width=2000&#x26;format=jpeg&#x26;optimize=medium" media="(min-width: 600px)">
//                 <img loading="lazy" alt="" src="./media_18dcda5cf9a6059650e5ec8095c250c5192d81529.jpeg?width=750&#x26;format=jpeg&#x26;optimize=medium" width="900" height="900">
//               </picture>
//             </div>
//             <div>
//               <p>
//                 <picture>
//                   <source type="image/webp" srcset="./media_132b112dbe8851cde9315cfe42a917b5b2321ddd9.png?width=2000&#x26;format=webply&#x26;optimize=medium" media="(min-width: 600px)">
//                   <source type="image/webp" srcset="./media_132b112dbe8851cde9315cfe42a917b5b2321ddd9.png?width=750&#x26;format=webply&#x26;optimize=medium">
//                   <source type="image/png" srcset="./media_132b112dbe8851cde9315cfe42a917b5b2321ddd9.png?width=2000&#x26;format=png&#x26;optimize=medium" media="(min-width: 600px)">
//                   <img loading="lazy" alt="" src="./media_132b112dbe8851cde9315cfe42a917b5b2321ddd9.png?width=750&#x26;format=png&#x26;optimize=medium" width="200" height="120">
//                 </picture>
//               </p>
//               <h2 id="cybersecurity-product-of-the-year-industry-record">Cybersecurity Product of the Year Industry Record</h2>
//               <p>We have cemented our position as an industry leader by winning five “Product of the Year” awards (2013-2024), a feat unmatched by any other vendor. Furthermore, our consistent high scores in AV Comparatives tests demonstrate our unrivaled commitment to ensuring the utmost security for individuals and organizations.</p>
//               <p><a href="https://www.bitdefender.com/news/bitdefender-internet-security-named-av-comparatives-product-of-the-year.html">Read more</a></p>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div>
//         <div class="section-metadata">
//           <div>
//             <div data-valign="middle">style</div>
//             <div data-valign="middle">testimonials</div>
//           </div>
//         </div>
//         <div class="box-carousel">
//           <div>
//             <div>
//               <h2 id="trusted-by">Trusted by</h2>
//             </div>
//           </div>
//           <div>
//             <div>
//               <p>
//                 <picture>
//                   <source type="image/webp" srcset="./media_175edd698b11cecd8e8a9bc13a72d12f039f648c4.png?width=2000&#x26;format=webply&#x26;optimize=medium" media="(min-width: 600px)">
//                   <source type="image/webp" srcset="./media_175edd698b11cecd8e8a9bc13a72d12f039f648c4.png?width=750&#x26;format=webply&#x26;optimize=medium">
//                   <source type="image/png" srcset="./media_175edd698b11cecd8e8a9bc13a72d12f039f648c4.png?width=2000&#x26;format=png&#x26;optimize=medium" media="(min-width: 600px)">
//                   <img loading="lazy" alt="" src="./media_175edd698b11cecd8e8a9bc13a72d12f039f648c4.png?width=750&#x26;format=png&#x26;optimize=medium" width="467" height="108">
//                 </picture>
//               </p>
//               <p>We spend 70 percent less time on incident response, which gives us more time for other strategic and complex projects, such as network- and micro-segmentation.</p>
//               <p>Tim O’Neill</p>
//               <p>Head of Information Security</p>
//             </div>
//           </div>
//           <div>
//             <div>
//               <p>
//                 <picture>
//                   <source type="image/webp" srcset="./media_16a69face5464083a487fee244a639ef67d30235b.png?width=2000&#x26;format=webply&#x26;optimize=medium" media="(min-width: 600px)">
//                   <source type="image/webp" srcset="./media_16a69face5464083a487fee244a639ef67d30235b.png?width=750&#x26;format=webply&#x26;optimize=medium">
//                   <source type="image/png" srcset="./media_16a69face5464083a487fee244a639ef67d30235b.png?width=2000&#x26;format=png&#x26;optimize=medium" media="(min-width: 600px)">
//                   <img loading="lazy" alt="" src="./media_16a69face5464083a487fee244a639ef67d30235b.png?width=750&#x26;format=png&#x26;optimize=medium" width="414" height="122">
//                 </picture>
//               </p>
//               <p>We calculated our operational costs were 40 percent less by going with Bitdefender MDR compared to hiring an additional three employees to achieve around-the-clock monitoring.</p>
//               <p>Mostafa Mabrouk</p>
//               <p>Corporate Information Security Manager</p>
//             </div>
//           </div>
//           <div>
//             <div>
//               <p>
//                 <picture>
//                   <source type="image/webp" srcset="./media_168e37ae4d11909aaa18d51d1b3c6f96108a19767.jpeg?width=2000&#x26;format=webply&#x26;optimize=medium" media="(min-width: 600px)">
//                   <source type="image/webp" srcset="./media_168e37ae4d11909aaa18d51d1b3c6f96108a19767.jpeg?width=750&#x26;format=webply&#x26;optimize=medium">
//                   <source type="image/jpeg" srcset="./media_168e37ae4d11909aaa18d51d1b3c6f96108a19767.jpeg?width=2000&#x26;format=jpeg&#x26;optimize=medium" media="(min-width: 600px)">
//                   <img loading="lazy" alt="" src="./media_168e37ae4d11909aaa18d51d1b3c6f96108a19767.jpeg?width=750&#x26;format=jpeg&#x26;optimize=medium" width="200" height="200">
//                 </picture>
//               </p>
//               <p>By adding GravityZone XDR Network Sensors, we can consolidate cues across our network and endpoints to gain a more complete view of risks and respond to threats quickly.</p>
//               <p>Paul Jobson</p>
//               <p>Director of IT Strategy</p>
//             </div>
//           </div>
//           <div>
//             <div>
//               <p>
//                 <picture>
//                   <source type="image/webp" srcset="./media_17763f30a6de4b8ecc02956b889ee2d11c6305744.png?width=2000&#x26;format=webply&#x26;optimize=medium" media="(min-width: 600px)">
//                   <source type="image/webp" srcset="./media_17763f30a6de4b8ecc02956b889ee2d11c6305744.png?width=750&#x26;format=webply&#x26;optimize=medium">
//                   <source type="image/png" srcset="./media_17763f30a6de4b8ecc02956b889ee2d11c6305744.png?width=2000&#x26;format=png&#x26;optimize=medium" media="(min-width: 600px)">
//                   <img loading="lazy" alt="" src="./media_17763f30a6de4b8ecc02956b889ee2d11c6305744.png?width=750&#x26;format=png&#x26;optimize=medium" width="527" height="96">
//                 </picture>
//               </p>
//               <p>Bitdefender MDR experts have the skill sets to interpret if a process needs to be shut down while the rest of us are sleeping.</p>
//               <p>Daniel Crofts</p>
//               <p>Cybersecurity Lead</p>
//             </div>
//           </div>
//           <div>
//             <div>
//               <p>
//                 <picture>
//                   <source type="image/webp" srcset="./media_123851c38fb51da78980b368be9b4422b4931ddbc.png?width=2000&#x26;format=webply&#x26;optimize=medium" media="(min-width: 600px)">
//                   <source type="image/webp" srcset="./media_123851c38fb51da78980b368be9b4422b4931ddbc.png?width=750&#x26;format=webply&#x26;optimize=medium">
//                   <source type="image/png" srcset="./media_123851c38fb51da78980b368be9b4422b4931ddbc.png?width=2000&#x26;format=png&#x26;optimize=medium" media="(min-width: 600px)">
//                   <img loading="lazy" alt="" src="./media_123851c38fb51da78980b368be9b4422b4931ddbc.png?width=750&#x26;format=png&#x26;optimize=medium" width="250" height="150">
//                 </picture>
//               </p>
//               <p>Combining Bitdefender EDR and XDR Sensors with MDR Foundations gives our customers access to a 24x7 SOC that is staffed with Bitdefender experts.</p>
//               <p>Diederik Twickler</p>
//               <p>CEO</p>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div>
//         <div class="trusted-teaser-impact">
//           <div>
//             <div>
//               <p><u>TRUSTED PROTECTION</u></p>
//               <h2 id="our-impact-by-the-numbers">Our Impact by the Numbers</h2>
//             </div>
//           </div>
//           <div>
//             <div>
//               <p><span class="icon icon-icons-01"></span></p>
//               <p>50B+</p>
//               <p>queries processed daily in threat intelligence.</p>
//             </div>
//           </div>
//           <div>
//             <div>
//               <p><span class="icon icon-icons-02"></span></p>
//               <p>487+</p>
//               <p>new cyber threats discovered every minute.</p>
//             </div>
//           </div>
//           <div>
//             <div>
//               <p><span class="icon icon-icons-03"></span></p>
//               <p>32</p>
//               <p><strong>free decryption tools</strong> released to fight ransomware globally.</p>
//             </div>
//           </div>
//           <div>
//             <div>
//               <p><span class="icon icon-icons-04"></span></p>
//               <p>$1.6B</p>
//               <p>in ransoms saved for ransomware victims worldwide.</p>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div>
//         <div class="section-metadata">
//           <div>
//             <div data-valign="middle">desktop-picture</div>
//             <div data-valign="middle">
//               <picture>
//                 <source type="image/webp" srcset="./media_1c97e4b7b24c7f4cd9d30c51c9d0ca3140d9ca9bc.jpeg?width=2000&#x26;format=webply&#x26;optimize=medium" media="(min-width: 600px)">
//                 <source type="image/webp" srcset="./media_1c97e4b7b24c7f4cd9d30c51c9d0ca3140d9ca9bc.jpeg?width=750&#x26;format=webply&#x26;optimize=medium">
//                 <source type="image/jpeg" srcset="./media_1c97e4b7b24c7f4cd9d30c51c9d0ca3140d9ca9bc.jpeg?width=2000&#x26;format=jpeg&#x26;optimize=medium" media="(min-width: 600px)">
//                 <img loading="lazy" alt="" src="./media_1c97e4b7b24c7f4cd9d30c51c9d0ca3140d9ca9bc.jpeg?width=750&#x26;format=jpeg&#x26;optimize=medium" width="5120" height="2214">
//               </picture>
//             </div>
//           </div>
//           <div>
//             <div data-valign="middle">mobile-picture</div>
//             <div data-valign="middle">
//               <picture>
//                 <source type="image/webp" srcset="./media_115b501cca0f8c2d185384add805a0dca7d0844d7.jpeg?width=2000&#x26;format=webply&#x26;optimize=medium" media="(min-width: 600px)">
//                 <source type="image/webp" srcset="./media_115b501cca0f8c2d185384add805a0dca7d0844d7.jpeg?width=750&#x26;format=webply&#x26;optimize=medium">
//                 <source type="image/jpeg" srcset="./media_115b501cca0f8c2d185384add805a0dca7d0844d7.jpeg?width=2000&#x26;format=jpeg&#x26;optimize=medium" media="(min-width: 600px)">
//                 <img loading="lazy" alt="" src="./media_115b501cca0f8c2d185384add805a0dca7d0844d7.jpeg?width=750&#x26;format=jpeg&#x26;optimize=medium" width="5120" height="2880">
//               </picture>
//             </div>
//           </div>
//         </div>
//         <div class="big-teaser-section">
//           <div>
//             <div data-align="justify" data-valign="middle">
//               <h2 id="trusted-partner-in-fighting-cybercrime-with-global-law-enforcement">Trusted partner in fighting cybercrime with global law enforcement.</h2>
//               <p>Bitdefender stands as a force for good, championing digital safety as trusted defenders of the cyber world. Our 20+-year commitment to fighting cybercrime includes aiding global law enforcement and launching 32 free ransomware decryptors, saving an estimated $1.6 billion in ransom fees. We’ve also played a key role in dismantling ransomware groups and darknet markets, disrupting illegal online transactions.</p>
//             </div>
//           </div>
//           <div>
//             <div data-valign="middle">
//               <picture>
//                 <source type="image/webp" srcset="./media_166087f4492d84134c70e9fc47173e0dbe63c4029.png?width=2000&#x26;format=webply&#x26;optimize=medium" media="(min-width: 600px)">
//                 <source type="image/webp" srcset="./media_166087f4492d84134c70e9fc47173e0dbe63c4029.png?width=750&#x26;format=webply&#x26;optimize=medium">
//                 <source type="image/png" srcset="./media_166087f4492d84134c70e9fc47173e0dbe63c4029.png?width=2000&#x26;format=png&#x26;optimize=medium" media="(min-width: 600px)">
//                 <img loading="lazy" alt="" src="./media_166087f4492d84134c70e9fc47173e0dbe63c4029.png?width=750&#x26;format=png&#x26;optimize=medium" width="437" height="1081">
//               </picture>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div>
//         <div class="section-metadata">
//           <div>
//             <div data-valign="middle">backgrounds</div>
//             <div data-valign="middle">#006EFF,#ff2800</div>
//           </div>
//         </div>
//         <div class="teaser-logos">
//           <div>
//             <div>
//               <picture>
//                 <source type="image/webp" srcset="./media_1f14d33064c632de2c1b91f22def6842ed29391d3.png?width=2000&#x26;format=webply&#x26;optimize=medium" media="(min-width: 600px)">
//                 <source type="image/webp" srcset="./media_1f14d33064c632de2c1b91f22def6842ed29391d3.png?width=750&#x26;format=webply&#x26;optimize=medium">
//                 <source type="image/png" srcset="./media_1f14d33064c632de2c1b91f22def6842ed29391d3.png?width=2000&#x26;format=png&#x26;optimize=medium" media="(min-width: 600px)">
//                 <img loading="lazy" alt="" src="./media_1f14d33064c632de2c1b91f22def6842ed29391d3.png?width=750&#x26;format=png&#x26;optimize=medium" width="3002" height="440">
//               </picture>
//             </div>
//             <div>
//               <picture>
//                 <source type="image/webp" srcset="./media_176d80c14b32bab77b25826a595c208f61d5e24b6.png?width=2000&#x26;format=webply&#x26;optimize=medium" media="(min-width: 600px)">
//                 <source type="image/webp" srcset="./media_176d80c14b32bab77b25826a595c208f61d5e24b6.png?width=750&#x26;format=webply&#x26;optimize=medium">
//                 <source type="image/png" srcset="./media_176d80c14b32bab77b25826a595c208f61d5e24b6.png?width=2000&#x26;format=png&#x26;optimize=medium" media="(min-width: 600px)">
//                 <img loading="lazy" alt="" src="./media_176d80c14b32bab77b25826a595c208f61d5e24b6.png?width=750&#x26;format=png&#x26;optimize=medium" width="2503" height="880">
//               </picture>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div>
//         <div class="section-metadata">
//           <div>
//             <div data-valign="middle">background_color</div>
//             <div data-valign="middle">#0c0f14</div>
//           </div>
//           <div>
//             <div data-valign="middle">style</div>
//             <div data-valign="middle">video_up</div>
//           </div>
//         </div>
//         <div class="video">
//           <div>
//             <div><a href="https://www.youtube.com/watch?v=UfeyKUCfSsM&#x26;t=1s&#x26;ab_channel=BitdefenderEnterprise">https://www.youtube.com/watch?v=UfeyKUCfSsM&#x26;t=1s&#x26;ab_channel=BitdefenderEnterprise</a></div>
//           </div>
//         </div>
//       </div>
//       <div>
//         <div class="section-metadata">
//           <div>
//             <div data-valign="middle">style</div>
//             <div data-valign="middle">dark2_bck, Apartnership_box</div>
//           </div>
//         </div>
//         <h3 id="trusted-by-ferrari-as-their-cybersecurity-partner">Trusted by Ferrari as their Cybersecurity Partner</h3>
//         <p>A partnership built on trust and innovation – Bitdefender provides Ferrari with Advanced Threat Intelligence to improve detection and response to cyber threats. The pressure to keep pace with the evolving global cyber threat landscape is high.</p>
//         <p>Bitdefender Advanced Threat Intelligence helps Ferrari detect and respond to cyberthreats faster with access to the most up-to-date and accurate threat intelligence.</p>
//         <p><strong><a href="https://www.bitdefender.com/ferrari/">Read More</a></strong></p>
//       </div>
//       <div>
//         <div class="dual-teaser">
//           <div>
//             <div><span class="icon icon-bd-round-thumb"></span></div>
//           </div>
//           <div>
//             <div>
//               <p>
//                 <picture>
//                   <source type="image/webp" srcset="./media_1eb866d5792fa6974fef33a903eb44217b5d986af.jpeg?width=2000&#x26;format=webply&#x26;optimize=medium" media="(min-width: 600px)">
//                   <source type="image/webp" srcset="./media_1eb866d5792fa6974fef33a903eb44217b5d986af.jpeg?width=750&#x26;format=webply&#x26;optimize=medium">
//                   <source type="image/jpeg" srcset="./media_1eb866d5792fa6974fef33a903eb44217b5d986af.jpeg?width=2000&#x26;format=jpeg&#x26;optimize=medium" media="(min-width: 600px)">
//                   <img loading="lazy" alt="" src="./media_1eb866d5792fa6974fef33a903eb44217b5d986af.jpeg?width=750&#x26;format=jpeg&#x26;optimize=medium" width="1000" height="1000">
//                 </picture>
//               </p>
//               <h2 id="for-home">For Home</h2>
//               <p>Protection for PC, Macs, mobile devices and smart home.</p>
//               <p><a href="https://www.bitdefender.com/solutions/">See solutions</a></p>
//             </div>
//             <div>
//               <p>
//                 <picture>
//                   <source type="image/webp" srcset="./media_1b6efbc31c4db482efde81c2541db370624d49c1e.jpeg?width=2000&#x26;format=webply&#x26;optimize=medium" media="(min-width: 600px)">
//                   <source type="image/webp" srcset="./media_1b6efbc31c4db482efde81c2541db370624d49c1e.jpeg?width=750&#x26;format=webply&#x26;optimize=medium">
//                   <source type="image/jpeg" srcset="./media_1b6efbc31c4db482efde81c2541db370624d49c1e.jpeg?width=2000&#x26;format=jpeg&#x26;optimize=medium" media="(min-width: 600px)">
//                   <img loading="lazy" alt="" src="./media_1b6efbc31c4db482efde81c2541db370624d49c1e.jpeg?width=750&#x26;format=jpeg&#x26;optimize=medium" width="1000" height="1000">
//                 </picture>
//               </p>
//               <h2 id="for-business">For Business</h2>
//               <p>Choose your security platform or managed services to become a more cyber resilient business.</p>
//               <p><a href="https://www.bitdefender.com/business/">See solutions</a></p>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div>
//         <div class="section-metadata">
//           <div>
//             <div data-valign="middle">style</div>
//             <div data-valign="middle">black_bck, small-text</div>
//           </div>
//         </div>
//         <p>Gartner, Magic Quadrant for Endpoint Protection Platforms, Evgeny Mirolyubov, Max Taggett, Franz Hinner, Nikul Patel, 31 December 2023</p>
//         <p>GARTNER is a registered trademark and service mark, and MAGIC QUADRANT is a trademark and service mark of Gartner, Inc. and/or its affiliates in the U.S. and internationally and are used herein with permission. All rights reserved.</p>
//         <p>Gartner does not endorse any vendor, product or service depicted in its research publications, and does not advise technology users to select only those vendors with the highest ratings or other designation. Gartner research publications consist of the opinions of Gartner's research organization and should not be construed as statements of fact. Gartner disclaims all warranties, expressed or implied, with respect to this research, including any warranties of merchantability or fitness for a particular purpose.</p>
//       </div>
//     </main>
//     <footer></footer>
//   </body>
// </html>
//
//   `;
  await loadEager(document);
  await window.hlx.plugins.load('lazy');
  await loadLazy(document);
  adobeMcAppendVisitorId('main');
  loadDelayed();
}

initMobileDetector('mobile');
initMobileDetector('tablet');
initMobileDetector('desktop');

loadPage();
