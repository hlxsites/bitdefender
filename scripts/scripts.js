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
  createOptimizedPicture,
  getMetadata,
  toClassName,
} from './lib-franklin.js';

import {
  createTag,
} from './utils/utils.js';

const LCP_BLOCKS = ['hero']; // add your LCP blocks to the list
const TRACKED_PRODUCTS = [];

export const SUPPORTED_LANGUAGES = ['en'];
export const DEFAULT_LANGUAGE = 'en';

export const SUPPORTED_COUNTRIES = ['au'];
export const DEFAULT_COUNTRY = 'au';

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
 * Sets the page language.
 * @param {Object} param The language and country
 */
function setPageLanguage(param) {
  document.documentElement.lang = param.language;
  createMetadata('nav', '/nav');
  createMetadata('footer', '/footer');
}

export function pushToDataLayer(data) {
  if (!data || !data.event) {
    // eslint-disable-next-line no-console
    console.error('The data layer event is missing');
    return;
  }

  if (!window.adobeDataLayer) {
    window.adobeDataLayer = [];
    window.adobeDataLayerInPage = true;
  }

  window.adobeDataLayer.push(data);
}

export function trackProduct(product) {
  // eslint-disable-next-line max-len
  const isDuplicate = TRACKED_PRODUCTS.find((p) => p.platform_product_id === product.platform_product_id && p.variation_id === product.variation_id);
  const isTrackedPage = getMetadata('analytics-tracking') === 'product';
  if (isTrackedPage && !isDuplicate) TRACKED_PRODUCTS.push(product);
}

export function pushProductsToDataLayer() {
  if (TRACKED_PRODUCTS.length > 0) {
    pushToDataLayer({
      event: 'product loaded',
      product: TRACKED_PRODUCTS
        .map((p) => ({
          info: {
            ID: p.platform_product_id,
            name: getMetadata('breadcrumb-title') || getMetadata('og:title'),
            devices: +p.variation.dimension_value,
            subscription: p.variation.years * 12,
            version: p.variation.years ? 'yearly' : 'monthly',
            basePrice: +p.price,
            discountValue: Math.round(p.price - p.discount.discounted_price),
            discountRate: Math.floor(((p.price - p.discount.discounted_price) / p.price) * 100),
            currency: p.currency_iso,
            priceWithTax: +p.discount.discounted_price,
          },
        })),
    });
  }
}

function setRumToAnalyticsMapping() {
  sampleRUM.always.on('viewblock', async (data) => {
    if (data) {
      // cache or act on the RUM event data
    }
  });

  sampleRUM.always.on('convert', async (data) => {
    if (data) {
      // cache or act on the RUM event data
    }
  });
}

/**
 * Decorates picture elements with a link to a video.
 * @param {Element} main The main element
 */
export default function decorateLinkedPictures(main) {
  main.querySelectorAll('picture').forEach((picture) => {
    if (!picture.closest('div.block')) {
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
 * const modalContainer = await createModal(modalPath, modalTemplate);
 * document.body.append(modalContainer);
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

function buildCta(section) {
  const backgroundImageSrc = section.dataset.backgroundImage;
  const backgroundImage = backgroundImageSrc ? createOptimizedPicture(backgroundImageSrc) : null;
  const backgroundImageHtml = backgroundImage ? backgroundImage.innerHTML : '';

  const fullWidthContainer = createTag(
    'div',
    { class: 'full-width' },
    `<div class="cta-container">
<div class="left-col">
</div>
<div class="right-col">
    <div class="img-container">
        <img class="red-img" src="/images/b-red-mask.png">
        <div class="bg-img">
            <div class="cmp-img">
                ${backgroundImageHtml}
            </div>
        </div>
        <img class="transparent-img" src="/icons/cta-circle.svg">
    </img>
</div>`,
  );

  const leftCol = fullWidthContainer.querySelector('.left-col');
  [...section.children].forEach((e) => leftCol.append(e));
  section.append(fullWidthContainer);
}

function buildCtaSections(main) {
  main.querySelectorAll('div.section.cta')
    .forEach(buildCta);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  setPageLanguage(getLanguageCountryFromPath(window.location.pathname));
  setRumToAnalyticsMapping();
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    buildCtaSections(main);
    detectModalButtons(main);
    document.body.classList.add('appear');
    await waitForLCP(LCP_BLOCKS);
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
  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));

  const context = { getMetadata, toClassName };
  // eslint-disable-next-line import/no-relative-packages
  const { initConversionTracking } = await import('../plugins/rum-conversion/src/index.js');
  await initConversionTracking.call(context, document);
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  window.setTimeout(() => {
    // eslint-disable-next-line import/no-cycle
    import('./delayed.js');
  }, 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
