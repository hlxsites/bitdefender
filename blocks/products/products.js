import { createNanoBlock, renderNanoBlocks } from '../../scripts/nano-blocks.js';
import fetchProduct from '../../scripts/fetch-product.js';

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
