// eslint-disable-next-line import/prefer-default-export
export function createTag(tag, attributes, html) {
  const el = document.createElement(tag);
  if (html) {
    if (html instanceof HTMLElement
        || html instanceof SVGElement
        || html instanceof DocumentFragment) {
      el.append(html);
    } else if (Array.isArray(html)) {
      el.append(...html);
    } else {
      el.insertAdjacentHTML('beforeend', html);
    }
  }
  if (attributes) {
    Object.entries(attributes).forEach(([key, val]) => {
      el.setAttribute(key, val);
    });
  }
  return el;
}

const FETCH_URL = 'https://www.bitdefender.com/site/Store/ajax';

/**
 * Fetches a product from the Bitdefender store.
 * @param code The product code
 * @param variant The product variant
 * @returns {Promise<*>}
 */
export async function fetchProduct(code = 'av', variant = '1u-1y') {
  const data = new FormData();
  data.append('data', JSON.stringify({
    ev: 1,
    product_id: code,
    config: {
      extra_params: {
        pid: null,
      },
    },
  }));

  const res = await fetch(FETCH_URL, {
    method: 'POST',
    body: data,
  });
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  const json = await res.json();

  // eslint-disable-next-line guard-for-in,no-restricted-syntax
  for (const i in json.data.product.variations) {
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const j in json.data.product.variations[i]) {
      const v = json.data.product.variations[i][j];
      if (v.variation.variation_name === variant) {
        return v;
      }
    }
  }

  throw new Error('Variant not found');
}

const nanoBlocks = new Map();

function findTextNodes(parent) {
  let all = [];
  for (let node = parent.firstChild; node; node = node.nextSibling) {
    if (node.nodeType === Node.TEXT_NODE) all.push(node);
    else all = all.concat(findTextNodes(node));
  }
  return all;
}

/**
 * Create a nano block
 * @param name The name of the block
 * @param renderer The renderer function
 */
export function createNanoBlock(name, renderer) {
  nanoBlocks.set(name.toLowerCase(), renderer);
}

/**
 * Renders nano blocks
 * @param parent The parent element
 */
export function renderNanoBlocks(parent = document.body) {
  const regex = /{([^}]+)}/g;
  findTextNodes(parent).forEach((node) => {
    const text = node.textContent.trim();
    const matches = text.match(regex);
    if (matches) {
      matches.forEach((match) => {
        const [name, ...params] = match.slice(1, -1).split(',').map((p) => p.trim());
        const renderer = nanoBlocks.get(name.toLowerCase());
        if (renderer) {
          const element = renderer(...params);
          node.parentNode.replaceChild(element, node);
        }
      });
    }
  });
}
