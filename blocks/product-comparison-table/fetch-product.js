const FETCH_URL = 'https://www.bitdefender.com/site/Store/ajax';

export const PRODUCTS = {
  'Bitdefender Mobile Security': 'mobile',
  'Bitdefender Total Security': 'tsmd',
  'Bitdefender Internet Security': 'is',
  'Bitdefender Antivirus Plus': 'av',
};

/**
 * Fetches a product from the Bitdefender store.
 * @param code The product code
 * @param variant The product variant
 * @returns {Promise<*>}
 */
export default async function fetchProduct(code = 'av', variant = '1u-1y') {
  const data = new FormData();
  data.append(
    'data',
    JSON.stringify({
      ev: 1,
      product_id: code,
      config: {
        extra_params: {
          pid: null,
        },
      },
    })
  );

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
