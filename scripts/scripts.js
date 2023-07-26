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
  loadCSS,
} from './lib-franklin.js';

const LCP_BLOCKS = []; // add your LCP blocks to the list

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

/**
 * Sets the language of the document and redirects nav/footer to the preferred country and language.
 * @param {String} pathname The pathname of the document
 */
export function setLanguage(pathname) {
  const [, languageCountry] = pathname.split('/');
  const [language] = languageCountry.split('-');

  document.documentElement.lang = language;
  createMetadata('nav', `/${languageCountry}/nav`);
  createMetadata('footer', `/${languageCountry}/footer`);
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

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  setLanguage(window.location.pathname);
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
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

async function fetchProduct() {
  const data = new FormData();
  data.append('data', JSON.stringify({
    ev: 1,
    product_id: 'av',
    config: {
      country_code: 'ro',
      extra_params: {
        pid: null,
      },
    },
  }));
  const res = await fetch('https://www.bitdefender.com/site/Store/ajax', {
    method: 'POST',
    body: data,
  });
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  const json = await res.json();
  return json.data;
}

const evaluationFunctions = new Map();

function isPromise(p) {
  if (typeof p === 'object' && typeof p.then === 'function') {
    return true;
  }
  return false;
}

function findTextNodes(parent) {
  let all = [];
  for (let node = parent.firstChild; node; node = node.nextSibling) {
    if (node.nodeType === 3) all.push(node);
    else all = all.concat(findTextNodes(node));
  }
  return all;
}

function registerEvaluationFunction(name, fn) {
  evaluationFunctions.set(name.toLowerCase(), fn);
}

function resolveEvaluationFunctions() {
  findTextNodes(document.body).forEach((node) => {
    const text = node.textContent.trim();
    if (text.startsWith('{') && text.endsWith('}')) {
      const [name, ...params] = text.slice(1, -1).split(',');
      const fn = evaluationFunctions.get(name.toLowerCase());
      if (fn) {
        const element = fn(...params);
        if (isPromise(element)) {
          element.then((e) => {
            node.parentNode.replaceChild(e, node);
          });
        } else if (element instanceof HTMLElement) {
          node.parentNode.replaceChild(element, node);
        }
      }
    }
  });
}

registerEvaluationFunction('price', async () => {
  const div = document.createElement('div');
  div.classList.add('price');
  const data = await fetchProduct();
  const { price } = data.product.variations['1']['1'];
  div.innerText = price;
  return div;
});

registerEvaluationFunction('discount', async () => {
  const div = document.createElement('div');
  div.classList.add('discount');
  const data = await fetchProduct();
  const { discount } = data.product.variations['1']['1'];
  div.innerText = discount.discounted_price;
  return div;
});

async function loadPage() {
  resolveEvaluationFunctions();
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
