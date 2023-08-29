import {
  createNanoBlock,
  renderNanoBlocks,
  fetchProduct,
  createTag,
} from '../../scripts/utils/utils.js';

/**
 * Custom event representing a change in the slected variant (plans)
 */
const VARIANT_SELECTION_CHANGED = 'variantSelectionChanged';

/**
 * Render a product price nanoblock
 * @param code Product code
 * @param variant Product variant
 * @param label Label
 * @returns Root node of the nanoblock
 */
function renderPrice(code, variant, label) {
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
      if (product.discount) {
        // eslint-disable-next-line camelcase
        oldPriceElement.innerText = `${product.price} ${product.currency_label}`;
        priceElement.innerHTML = `${product.discount.discount_value} ${product.currency_label} <em>${label}</em>`;
      } else {
        priceElement.innerHTML = `${product.price} ${product.currency_label} <em>${label}</em>`;
      }
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err);
    });

  return priceRoot;
}

/**
 * Render a product price
 * @param product Product representation as returned by the product information db
 * @returns an HTML string
 */
function renderProductPrice(product) {
  if (!product.discount) {
    return `<strong>${product.price} ${product.currency_label}</strong>`;
  // eslint-disable-next-line no-else-return
  } else {
    const productDiscount = product.price - product.discount.discounted_price;
    return `<strong>${product.discount.discount_value} ${product.currency_label}</strong>
            <span class="old-price">Old Price <del>${product.price} ${product.currency_label}</del></span>
            <span class="discount">Save ${productDiscount.toFixed(2)} ${product.currency_label}</span>`;
  }
}

/**
 * Render a Featured nanoblock
 * @param text Text of the featured nanoblock
 * @returns Root node of the feature nanoblock
 */
function renderFeatured(text) {
  const root = document.createElement('div');
  root.classList.add('featured');
  root.innerText = text;
  return root;
}

/**
 * Render the lowest product price
 * @param code Product code
 * @param variant Product variant
 * @returns root node of the nanoblock
 */
function renderLowestPrice(code, variant) {
  const root = document.createElement('p');

  fetchProduct(code, variant).then((product) => {
    // eslint-disable-next-line max-len
    const price = ((product.discount ? product.discount.discount_value : product.price) / 12).toFixed(2);
    root.innerHTML = `Start today for as low as  ${price} ${product.currency_label}/mo`;
  });

  return root;
}

/**
 * Renders the plans selector, display the price and potential discount
 * corresponding to the selected plan.
 * @param code Product code
 * @param variants List of product variants (ex. 1u-1y)
 * @param label Label of the variant selector
 * @param defaultSelection Default variant
 * @returns Root node of the plan nanoblock
 */
function renderPlans(code, variants, label, defaultSelection) {
  const root = document.createElement('div');
  const ul = document.createElement('ul');
  root.appendChild(ul);
  ul.classList.add('variant-selector');
  ul.innerHTML = `<p>${label}</p>`;

  const price = document.createElement('div');
  price.classList.add('price');
  price.innerHTML = 'loading...';

  price.addEventListener(VARIANT_SELECTION_CHANGED, (e) => {
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
        e.dispatchEvent(new CustomEvent(VARIANT_SELECTION_CHANGED, { detail: { product, code } }));
      });
      [...root.parentNode.children].forEach((e) => {
        e.dispatchEvent(new CustomEvent(VARIANT_SELECTION_CHANGED, { detail: { product, code } }));
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
}

/**
 * Calculates a discount
 */
function discount(product) {
  return Math.round((1 - (product.discount.discounted_price) / product.price) * 100);
}

/**
 * Renders the green section on top of the product card highlighting the potential savings
 * @returns the root node of the highilight block
 */
function renderHighlightSavings(code, variant) {
  const root = createTag(
    'div',
    {
      class: 'highlight',
    },
    '<span class="highlight">Save --%</span>',
  );

  function renderSavings(product) {
    if (product.discount) {
      root.querySelector('.highlight').innerText = `Save ${discount(product)}%`;
      root.style.display = 'block';
    } else {
      root.style.display = 'none';
    }
  }

  // render the highlight if author provides the product code and variant
  if (code !== undefined && variant !== undefined) {
    fetchProduct(code, variant).then((product) => renderSavings(product));
  }

  // update the potential saving when variant selection changed
  root.addEventListener(VARIANT_SELECTION_CHANGED, (e) => {
    renderSavings(e.detail.product);
  });
  return root;
}

createNanoBlock('price', renderPrice);
createNanoBlock('lowestPrice', renderLowestPrice);
createNanoBlock('featured', renderFeatured);
createNanoBlock('plans', renderPlans);
createNanoBlock('highlightSavings', renderHighlightSavings);

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
    b.addEventListener(VARIANT_SELECTION_CHANGED, (e) => {
      e.target.querySelector('a').href = `https://www.bitdefender.com/site/Store/buy/${e.detail.code}/${e.detail.product.variation.dimension_value}/${e.detail.product.variation.years}/`;
    });
  });

  // section's content default contains a nanoblock
  renderNanoBlocks(block.parentNode.parentNode);

  // style the product card if the author has added a featured card inside
  [...block.querySelectorAll('.product-card .featured')].forEach((featured) => {
    featured.closest('.product-card').classList.add('featured');
  });

  // add class to avoid using :has selector
  block.querySelectorAll('.product-card li').forEach((li) => {
    if (li.querySelector('del')) {
      li.classList.add('with-del');
    } else {
      li.classList.remove('with-del');
    }
  });

  block.querySelectorAll('.product-card ul').forEach((ul) => {
    if (ul.previousElementSibling?.tagName === 'P') {
      ul.previousElementSibling.classList.add('ul-header-text');
    }
  });
}
