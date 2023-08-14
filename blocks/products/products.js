import { createNanoBlock, renderNanoBlocks, fetchProduct } from '../../scripts/utils/utils.js';

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

function renderProductPrice(product) {
  return `<strong>${product.price} ${product.currency_iso}</strong>`;
}

function renderProductPriceWithDiscount(product) {
  const discount = product.price - product.discount.discounted_price;
  return `<strong>${product.discount.discounted_price} ${product.currency_iso}</strong>
          <span>Old Price <del>${product.price} ${product.currency_iso}</del></span>
          <span class="discount">Save ${discount.toFixed(2)} ${product.currency_iso}</span>
          `;
}

createNanoBlock('prices', (code, variants, label) => {
  const root = document.createElement('ul');
  root.classList.add('prices');

  const promises = variants.map((variant) => fetchProduct(code, variant));

  Promise.all(promises).then((products) => products.forEach((product) => {
    const tmpDiv = document.createElement('div');
    tmpDiv.innerHTML = `
    <li>
      <span>${product.variation.dimension_value}</span>
      <div class="price">      
        ${product.discount ? renderProductPriceWithDiscount(product) : renderProductPrice(product)}          
        <em>${label}</em>
        <p class="button-container"><a href="https://www.bitdefender.com.au/site/Store/buy/is/${product.variation.dimension_value}/${product.variation.years}/?CART=1&CARD=2&SHORT_FORM=1" class="button">Buy Now</a></p>
        <p>GST included</br>
        See <a href="#tos">Terms of Use</a> below.</p>
      </div>
    </li>`;
    const li = tmpDiv.children[0];
    li.addEventListener('click', () => {
      root.querySelector('.active').classList.remove('active');
      li.classList.add('active');
    });

    // activate first element
    if (root.childElementCount === 0) {
      li.classList.add('active');
    }

    root.appendChild(li);
  })).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
  });
  return root;
});

createNanoBlock('featured', (text) => {
  const root = document.createElement('div');
  root.classList.add('featured');
  root.innerText = text;
  return root;
});

createNanoBlock('savings', () => {
  const root = document.createElement('div');
  root.classList.add('savings');
  root.innerText = 'Save ???%';
  return root;
});

export default function decorate(block) {
  [...block.children].forEach((row) => {
    [...(row.children)].forEach((col) => {
      col.classList.add('product-card');
      block.appendChild(col);
    });
    row.remove();
  });
  renderNanoBlocks(block);
}
