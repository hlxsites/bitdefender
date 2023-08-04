import { createNanoBlock, renderNanoBlocks } from '../../scripts/nano-blocks.js';

const FETCH_URL = 'https://www.bitdefender.com/site/Store/ajax';

/**
 * Fetches a product from the Bitdefender store.
 * @param code The product code
 * @param variant The product variant
 * @returns {Promise<*>}
 */
async function fetchProduct(code = 'av', variant = '1u-1y') {
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

createNanoBlock('price', (code, variant, label) => {
  const priceRoot = document.createElement('div');
  priceRoot.classList.add('price');
  const oldPriceElement = document.createElement('del');
  priceRoot.appendChild(oldPriceElement);
  oldPriceElement.innerText = '-';
  const priceElement = document.createElement('strong');
  priceRoot.appendChild(priceElement);
  priceElement.innerText = '-';

  fetchProduct(code, variant)
    .then((product) => {
      // eslint-disable-next-line camelcase
      const { price, discount: { discounted_price: discounted }, currency_iso: currency } = product;
      oldPriceElement.innerText = `${price} ${currency}`;
      priceElement.innerHTML = `${discounted} ${currency} <em>${label}</em>`;
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err);
    });

  return priceRoot;
});

createNanoBlock('featured', (text) => {
  const root = document.createElement('div');
  root.classList.add('featured');
  root.innerText = text;
  return root;
});

export default function decorate(block) {
  if (!block.querySelectorAll('img').length) {
    block.classList.add('col-3');
  }
  [...block.children].forEach((row) => {
    [...(row.children)].forEach((col) => {
      col.classList.add('product-card');
      block.appendChild(col);
    });
    row.remove();
  });
  renderNanoBlocks(block);
}
