import {
  createNanoBlock,
  renderNanoBlocks,
  fetchProduct,
  fetchProductVariant,
  findProductVariant,
  createTag,
} from '../../scripts/utils/utils.js';

import { trackProduct } from '../../scripts/scripts.js';

/**
 * Custom event representing a change in the slected variant (plans)
 */
const VARIANT_SELECTION_CHANGED = 'variantSelectionChanged';

/**
 * Calculates a discount
 */
 function discount(price, discountedPrice) {
  return (price - discountedPrice).toFixed(2);
}

/**
 * Calculates a discount rate
 */
function discountRate(price, discountedPrice) {
  return Math.round((1 - (discountedPrice) / price) * 100);
}

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

  fetchProductVariant(code, variant)
    .then((product) => {
      trackProduct(product);

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
function renderProductPrice(price, discountedPrice, currency) {
  if (!discountedPrice) {
    return `<strong>${discountedPrice} ${currency}</strong>`;
  // eslint-disable-next-line no-else-return
  } else {
    return `<strong>${discountedPrice} ${currency}</strong>
            <span class="old-price">Old Price <del>${price} ${currency}</del></span>
            <span class="discount">Save ${discount(price, discountedPrice)} ${currency}</span>`;
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

  fetchProductVariant(code, variant).then((product) => {
    trackProduct(product);
    // eslint-disable-next-line max-len
    const price = ((product.discount ? product.discount.discount_value : product.price) / 12).toFixed(2);
    root.innerHTML = `Start today for as low as  ${price} ${product.currency_label}/mo`;
  });

  return root;
}

function renderPlansSelection(promises, label, defaultSelection) {
  const root = createTag(
    'div',
    {},
    `<ul class="plan-selector">
       <p>${label}</p>
     </ul>
     <div class="price">loading...</div>`,
  );

  const priceElt = root.querySelector('.price');
  const ulElt = root.querySelector('ul');

  priceElt.addEventListener(VARIANT_SELECTION_CHANGED, (e) => {
    const { price, discountedPrice, currency } = e.detail.plan;
    price.innerHTML = renderProductPrice(price, discountedPrice, currency);
  });
  root.appendChild(priceElt);

  // eslint-disable-next-line max-len
  // const promises = (Array.isArray(codes) ? codes : [codes]).map((code) => fetchProduct(code));

  Promise.all(promises).then((variants) => variants.forEach((variant) => {
    const liElt = createTag(
      'li',
      {},
      `<span>${variant.label}</span>`,
    );

    liElt.addEventListener('click', () => {
      ulElt.querySelector('.active')?.classList.remove('active');
      liElt.classList.add('active');

      [...root.children].forEach((e) => {
        e.dispatchEvent(
          new CustomEvent(VARIANT_SELECTION_CHANGED, { detail: { variant } }),
        );
      });
      [...root.parentNode.children].forEach((e) => {
        e.dispatchEvent(
          new CustomEvent(VARIANT_SELECTION_CHANGED, { detail: { variant } }),
        );
      });
    });

    // activate default selection
    if (variant.productAlias === defaultSelection) {
      liElt.click();
    }

    ulElt.appendChild(liElt);
  })).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
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
  const promises = (Array.isArray(variants) ? variants : [variants]).map((variant) => fetchProductVariant(code, variant));

  Promise.all(promises).then((products) => products.forEach((product) => {
    trackProduct(product);
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

/**
 * Renders the plans selector, display the price and potential discount
 * corresponding to the selected plan.
 * @param code List of product codes
 * @param variant List of product variants (ex. 1u-1y)
 * @param label Label of the variant selector
 * @param defaultSelection Default variant
 * @returns Root node of the plan nanoblock
 */
function renderYearlyMonthly(codes, variant, label, defaultSelection) {
  return renderPlansSelection(
    (Array.isArray(codes) ? codes : [codes]).map((code) => fetchProductVariant(code, variant)),
    // return {
    //   label: code.endsWith('m') ? 'Monthly' : 'Yearly',
    //   price: productVariant.price,
    //   discountedPrice: productVariant.discount.discount_value,
    //   currency: productVariant.currency_label,
    // };
    label,
    defaultSelection,
  );

  // const root = document.createElement('div');
  // const ul = document.createElement('ul');
  // root.appendChild(ul);
  // ul.classList.add('variant-selector');
  // ul.innerHTML = `<p>${label}</p>`;

  // const price = document.createElement('div');
  // price.classList.add('price');
  // price.innerHTML = 'loading...';

  // price.addEventListener(VARIANT_SELECTION_CHANGED, (e) => {
  //   price.innerHTML = renderProductPrice(e.detail.variant);
  // });
  // root.appendChild(price);

  // // eslint-disable-next-line max-len
  // const promises = (Array.isArray(codes) ? codes : [codes]).map((code) => fetchProduct(code));

  // Promise.all(promises).then((products) => products.forEach((product) => {
  //   const tmpDiv = document.createElement('div');

  //   const code = product.product_alias;
  //   const productVariant = findProductVariant(product, variant);

  //   tmpDiv.innerHTML = `
  //   <li>
  //     <span>${code.endsWith('m') ? 'Monthly' : 'Yearly'}</span>
  //   </li>`;

  //   const li = tmpDiv.children[0];

  //   li.addEventListener('click', () => {
  //     ul.querySelector('.active')?.classList.remove('active');
  //     li.classList.add('active');

  //     [...root.children].forEach((e) => {
  //       e.dispatchEvent(
  //         new CustomEvent(VARIANT_SELECTION_CHANGED, { detail: { productVariant, code } }),
  //       );
  //     });
  //     [...root.parentNode.children].forEach((e) => {
  //       e.dispatchEvent(
  //         new CustomEvent(VARIANT_SELECTION_CHANGED, { detail: { productVariant, code } }),
  //       );
  //     });
  //   });

  //   // activate default selection
  //   if (product.product_alias === defaultSelection) {
  //     li.click();
  //   }

  //   ul.appendChild(li);
  // })).catch((error) => {
  //   // eslint-disable-next-line no-console
  //   console.error(error);
  // });

  // return root;
}

createNanoBlock('price', renderPrice);
createNanoBlock('lowestPrice', renderLowestPrice);
createNanoBlock('featured', renderFeatured);
createNanoBlock('plans', renderPlans);
createNanoBlock('yearlyMonthly', renderYearlyMonthly);
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
