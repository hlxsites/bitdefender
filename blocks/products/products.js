import { createNanoBlock, renderNanoBlocks, createNanoBlockWithPostProcessing, fetchProduct } from '../../scripts/utils/utils.js';

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
      oldPriceElement.innerText = `${product.price} ${product.currency_label}`;
      priceElement.innerHTML = `${product.discount.discount_value} ${product.currency_label} <em>${label}</em>`;
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err);
    });

  return priceRoot;
});

function renderProductPrice(product) {
  if (!product.discount) {
    return `<strong>${product.price} ${product.currency_label}</strong>`;
  // eslint-disable-next-line no-else-return
  } else {
    const discount = product.price - product.discount.discounted_price;
    return `<strong>${product.discount.discount_value} ${product.currency_label}</strong>
            <span class="old-price">Old Price <del>${product.price} ${product.currency_label}</del></span>
            <span class="discount">Save ${discount.toFixed(2)} ${product.currency_label}</span>`;
  }
}

createNanoBlockWithPostProcessing('featured', (text) => {
  const root = document.createElement('div');
  root.classList.add('featured');
  root.innerText = text;
  return root;
}, (element) => {
  const productCard = element.closest('.product-card');
  productCard.classList.add('featured');
});

createNanoBlock('lowestPrice', (code, variant) => {
  const root = document.createElement('p');

  fetchProduct(code, variant).then((product) => {
    // eslint-disable-next-line max-len
    const price = ((product.discount ? product.discount.discount_value : product.price) / 12).toFixed(2);
    root.innerHTML = `Start today for as low as  ${price} ${product.currency_label}/mo`;
  });

  return root;
});

createNanoBlock('plans', (code, variants, label, defaultSelection) => {
  const root = document.createElement('div');
  const ul = document.createElement('ul');
  root.appendChild(ul);
  ul.classList.add('variant-selector');
  ul.innerHTML = `<p>${label}</p>`;

  const price = document.createElement('div');
  price.classList.add('price');
  price.innerHTML = 'loading...';
  price.addEventListener('variantSelectionChanged', (e) => {
    price.innerHTML = renderProductPrice(e.detail.product);
  });
  root.appendChild(price);

  // eslint-disable-next-line max-len
  const promises = (Array.isArray(variants) ? variants : [variants]).map((variant) => fetchProduct(code, variant));

  Promise.all(promises).then((products) => products.forEach((product) => {
    const tmpDiv = document.createElement('div');

    tmpDiv.innerHTML = `
    <li>
      <span>${product.variation.dimension_value}</span>
    </li>`;

    const li = tmpDiv.children[0];

    li.addEventListener('click', () => {
      ul.querySelector('.active')?.classList.remove('active');
      li.classList.add('active');

      [...root.children].forEach((e) => {
        e.dispatchEvent(new CustomEvent('variantSelectionChanged', { detail: { product, code } }));
      });
      [...root.parentNode.children].forEach((e) => {
        e.dispatchEvent(new CustomEvent('variantSelectionChanged', { detail: { product, code } }));
      });
    });

    // activate default selection
    if (product.variation.variation_name === defaultSelection) {
      li.click();
    }

    ul.appendChild(li);
  })).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
  });

  return root;
});

createNanoBlock('highlightSavings', () => {
  const root = document.createElement('div');
  root.classList.add('highlight');
  root.addEventListener('variantSelectionChanged', (e) => {
    const { detail: { product } } = e;
    if (product.discount) {
      const discount = Math.round((1 - (product.discount.discounted_price) / product.price) * 100);
      root.innerHTML = `<span class='highlight'>Save ${discount}%</span>`;
      root.style.display = 'block';
    } else {
      root.style.display = 'none';
    }
  });
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

  // listen to variantSelectionChanged and update button accordingly
  block.querySelectorAll('.button-container').forEach((b) => {
    b.addEventListener('variantSelectionChanged', (e) => {
      e.target.querySelector('a').href = `https://www.bitdefender.com/site/Store/buy/${e.detail.code}/${e.detail.product.variation.dimension_value}/${e.detail.product.variation.years}/`;
    });
  });

  renderNanoBlocks(block.parentNode.parentNode);
}
