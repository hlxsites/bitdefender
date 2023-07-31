import {
  sampleRUM,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  loadCSS, createOptimizedPicture,
} from './lib-franklin.js';

const LCP_BLOCKS = []; // add your LCP blocks to the list

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

/**
 * Decorates picture elements with a link to a video.
 * @param {Element} main The main element
 */
export default function decorateLinkedPicturesModal(main) {
  main.querySelectorAll('picture').forEach((picture) => {
    if (!picture.closest('div.block')) {
      const next = picture.parentNode.nextElementSibling;
      if (next) {
        const a = next.querySelector('a');
        const link = a?.textContent;
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
  decorateLinkedPicturesModal(main);
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

  const closeModal = () => modalContainer.remove();
  modalContainer.addEventListener('click', closeModal);

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

  const close = document.createElement('div');
  close.classList.add('modal-close');
  close.addEventListener('click', closeModal);
  modalContent.append(close);
  return modalContainer;
}

export async function detectModalButtons(main) {
  main.querySelectorAll('a.button.modal').forEach((link) => {
    link.addEventListener('click', async () => {
      const modalPath = link.dataset.modal;
      const modalTemplate = modalPath.split('/').pop();
      const modalContainer = await createModal(modalPath, modalTemplate);
      document.body.append(modalContainer);
    });
  });
}

function buildCta(section) {
  const backgroundImageSrc = section.dataset.backgroundImage;
  const backgroundImage = backgroundImageSrc ? createOptimizedPicture(backgroundImageSrc) : null;

  const leftEl = document.createElement('div');
  const rightEl = document.createElement('div');
  leftEl.classList.add('left-col');
  rightEl.classList.add('right-col');
  const containerEl = document.createElement('div');
  containerEl.classList.add('cta-container');
  containerEl.append(leftEl, rightEl);
  [...section.children].forEach((e) => leftEl.append(e));
  rightEl.innerHTML = `<div class="img-container">
<img class="red-img" src="/images/b-red-mask.png">
<div class="bg-img">
${backgroundImage?.innerHTML}
</div>
<img class="transparent-img" src="/icons/cta-circle.svg">
</div>`;
  section.append(containerEl);
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
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
