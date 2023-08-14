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
 * Parse nano block parameters, support string and array.
 * parseString("aa, bb, cc") -> [ 'aa', 'bb', 'cc' ]
 * parseString("aa, [x, y, z], cc") -> [ 'aa', [ 'x', 'y', 'z' ], 'cc' ]
 * @param params string representing nanoblock parameters
 * @returns an array representation of the parameters
 */
function parseParams(params) {
  const segments = params.split(',').map((segment) => segment.trim());
  const result = [];

  let tempArray = [];
  let isInArray = false;

  segments.forEach((segment) => {
    if (isInArray) {
      if (segment.endsWith(']')) {
        tempArray.push(segment.slice(0, -1));
        result.push(tempArray);
        tempArray = [];
        isInArray = false;
      } else {
        tempArray.push(segment);
      }
    } else if (segment.startsWith('[')) {
      if (segment.endsWith(']')) {
        result.push(JSON.parse(segment));
      } else {
        tempArray.push(segment.slice(1));
        isInArray = true;
      }
    } else {
      result.push(segment);
    }
  });

  return result;
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
        const [name, ...params] = parseParams(match.slice(1, -1));
        const renderer = nanoBlocks.get(name.toLowerCase());
        if (renderer) {
          const element = renderer(...params);
          const oldElement = node.parentNode;
          oldElement.parentNode.replaceChild(element, oldElement);
        }
      });
    }
  });
}

/**
 * Results returned from {@link fetchIndex} come from a derived Excel sheet that is constructed
 * with the FILTER function. This FILTER function has the unwanted side effect of returning '0' in
 * cells that are empty in the original sheet.
 *
 * This function replaces those '0' values with empty cells again.
 *
 * @see fetchIndex
 * @param {Object} data - the data returned from the fetchIndex function.
 */
export function fixExcelFilterZeroes(data) {
  data.forEach((line) => {
    Object.keys(line).forEach((k) => {
      line[k] = line[k] === '0' ? '' : line[k];
    });
  });
}

export async function fetchIndex(indexFile, sheet, pageSize = 500) {
  const idxKey = indexFile.concat(sheet || '');

  const handleIndex = async (offset) => {
    const sheetParam = sheet ? `&sheet=${sheet}` : '';

    const resp = await fetch(`/${indexFile}.json?limit=${pageSize}&offset=${offset}${sheetParam}`);
    const json = await resp.json();

    const newIndex = {
      complete: (json.limit + json.offset) === json.total,
      offset: json.offset + pageSize,
      promise: null,
      data: [...window.index[idxKey].data, ...json.data],
    };

    return newIndex;
  };

  window.index = window.index || {};
  window.index[idxKey] = window.index[idxKey] || {
    data: [],
    offset: 0,
    complete: false,
    promise: null,
  };

  if (window.index[idxKey].complete) {
    return window.index[idxKey];
  }

  if (window.index[idxKey].promise) {
    return window.index[idxKey].promise;
  }

  window.index[idxKey].promise = handleIndex(window.index[idxKey].offset);
  const newIndex = await (window.index[idxKey].promise);
  window.index[idxKey] = newIndex;

  return newIndex;
}
