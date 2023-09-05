import {
  createNanoBlock,
  renderNanoBlocks,
  fetchProduct,
  createTag,
} from '../../scripts/utils/utils.js';

import { trackProduct } from '../../scripts/scripts.js';

/**
 * Utility function to round prices and percentages
 * @param  value value to round
 * @returns rounded value
 */
function customRound(value) {
  const numValue = parseFloat(value);

  if (Number.isNaN(numValue)) {
    return value;
  }

  // Convert to a fixed number of decimal places then back to a number to deal with precision issues
  const roundedValue = Number(numValue.toFixed(2));

  // If it's a whole number, return it as an integer
  return (roundedValue % 1 === 0) ? Math.round(roundedValue) : roundedValue;
}

/**
 * Represents the current state of a product card.
 * The state is exposed by the _model_ attribute.
 * Views can react to state change by subscribing with a listener
 * This class is also repsonsible for fetching the product variants
 * from the remote service and presenting them to the view.
 */
class ProductCard {
  constructor(root) {
    this.root = root;
    this.listeners = [];
    this.model = {
      code: undefined,
      variant: undefined,
      price: '--.--',
      monthlyPrice: '--.--',
      discountedPrice: '--.--',
      discount: '--.--',
      discountRate: '--',
      currency: '---',
      url: '#',
    };
  }

  notify() {
    this.listeners.forEach((listener) => listener(this.model));
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  /**
   * Fetch a product variant from the remote service and update the model state
   * @param productCode
   * @param variantCode
   */
  async selectProductVariant(productCode, variantCode) {
    const product = await fetchProduct(productCode, variantCode);

    const variant = {
      productCode,
      variantCode,
      price: product.price,
      monthlyPrice: customRound(product.price / 12),
      discountedPrice: product.discount?.discounted_price,
      discountedMonthlyPrice: product.discount
        ? customRound(product.discount.discounted_price / 12)
        : undefined,
      discount: product.discount
        ? customRound((product.price - product.discount.discounted_price) * 100) / 100
        : undefined,
      discountRate: product.discount
        ? customRound((1 - (product.discount.discount_value) / product.price) * 100)
        : undefined,
      currency: product.currency_label,
      url: `https://www.bitdefender.com/site/Store/buy/${productCode}/${product.variation.dimension_value}/${product.variation.years}/`,
    };

    this.model = variant;

    this.notify();
  }
}

/**
 * Nanoblock representing the plan selectors.
 * If only one plan is declared, the plan selector will not be visible.
 * @param mv The modelview holding the state of the view
 * @param plans The list of plans to display [ labelToDisplay, productCode, variantId, ... ]
 * @param defaultSelection The default selection.
 * @returns Root node of the nanoblock
 */
function renderPlanSelector(mv, plans, defaultSelection) {
  // TODO: Remove unecessary div
  const root = document.createElement('div');
  const ul = document.createElement('ul');
  ul.classList.add('plan-selector');
  root.appendChild(ul);

  mv.subscribe(() => {
    const { model: { productCode: code, variantCode: variant } } = mv;

    ul.querySelector('.active')?.classList.remove('active');
    const li = ul.querySelector(`[data-product-code="${code}"][data-product-variant="${variant}"]`);
    li.classList.add('active');
  });

  for (let idx = 0; idx < plans.length - 2; idx += 3) {
    const label = plans[idx];
    const code = plans[idx + 1];
    const variant = plans[idx + 2];

    const li = createTag(
      'li',
      {
        'data-product-code': code,
        'data-product-variant': variant,
      },
      `<span>${label}</span>`,
    );

    if (plans.length === 3) {
      ul.style.display = 'none';
    }

    li.addEventListener('click', () => {
      mv.selectProductVariant(code, variant);
    });

    // activate default selection
    if (label === defaultSelection) {
      li.click();
    }

    ul.appendChild(li);
  }

  return root;
}

/**
 * Nanoblock representing the old product price
 * @param mv The modelview holding the state of the view
 * @param text The text located before the price
 * @param monthly Show the monthly price if equal to 'monthly'
 * @returns Root node of the nanoblock
 */
function renderOldPrice(mv, text = '', monthly = '') {
  // TODO simplify CSS
  const root = createTag(
    'div',
    {
      class: 'price',
    },
    `<span class='old-price'>${text} <del>${mv.model.price} ${mv.model.currency}</del>`,
  );

  const oldPriceElt = root.querySelector('span');

  mv.subscribe(() => {
    // TODO : Adjust trackproduct
    // trackProduct(product);
    if (mv.model.discountedPrice) {
      oldPriceElt.innerHTML = monthly.toLowerCase() === 'monthly'
        ? `${text} <del>${mv.model.monthlyPrice} ${mv.model.currency}<sup>/mo</sup></del>`
        : `${text} <del>${mv.model.price} ${mv.model.currency}</del>`;
      oldPriceElt.style.visibility = 'visible';
    } else {
      oldPriceElt.style.visibility = 'hidden';
    }
  });

  return root;
}

/**
 * Nanoblock representing the new product price
 * @param mv The modelview holding the state of the view
 * @param text The text located before the price
 * @param monthly Show the monthly price if equal to 'monthly'
 * @returns Root node of the nanoblock
 */
function renderPrice(mv, text = '', monthly = '') {
  // TODO simplify CSS
  const root = createTag(
    'div',
    {
      class: 'price',
    },
    `<strong>${mv.model.price}</strong>`,
  );

  const priceElt = root.querySelector('strong');

  mv.subscribe(() => {
    // TODO : Adjust trackproduct
    // trackProduct(product);
    if (monthly.toLowerCase() === 'monthly') {
      if (mv.model.discountedPrice) {
        priceElt.innerHTML = `${text} ${mv.model.discountedMonthlyPrice} ${mv.model.currency} <sup>/mo</sup>`;
      } else {
        priceElt.innerHTML = `${text} ${mv.model.monthlyPrice} ${mv.model.currency} <sup>/mo</sup>`;
      }
    } else if (mv.model.discountedPrice) {
      priceElt.innerHTML = `${text} ${mv.model.discountedPrice} ${mv.model.currency}`;
    } else {
      priceElt.innerHTML = `${text} ${mv.model.price} ${mv.model.currency}`;
    }
  });

  return root;
}

/**
 * Renders the green section on top of the product card highlighting the potential savings
 * @param mv The modelview holding the state of the view
 * @param text Text to display
 * @param percent Show the saving in percentage if equals to `percent`
 * @returns Root node of the nanoblock
 */
function renderHighlightSavings(mv, text = 'Save', percent = '') {
  const root = createTag(
    'div',
    {
      class: 'highlight',
      style: 'display=none',
    },
    '<span></span>',
  );

  mv.subscribe(() => {
    if (mv.model.discountRate) {
      root.querySelector('span').innerText = (percent.toLowerCase() === 'percent')
        ? `${text} ${mv.model.discountRate}%`
        : `${text} ${mv.model.discount} ${mv.model.currency}`;
      root.style.visibility = 'visible';
    } else {
      root.style.visibility = 'hidden';
    }
  });

  return root;
}

/**
 * Nanoblock representing a text to highlight in the product card
 * @param mv The modelview holding the state of the view
 * @param text Text to display
 * @returns Root node of the nanoblock
 */
function renderHighlight(mv, text) {
  return createTag(
    'div',
    {
      class: 'highlight',
      style: 'visibility=hidden',
    },
    `<span>${text}</span>`,
  );
}

/**
 * Nanoblock representing a text to Featured
 * @param mv The modelview holding the state of the view
 * @param text Text of the featured nanoblock
 * @returns Root node of the nanoblock
 */
function renderFeatured(mv, text) {
  const root = document.createElement('div');
  root.classList.add('featured');
  root.innerText = text;
  return root;
}

/**
 * Nanoblock representing a text to Featured and the corresponding savings
 * @param mv The modelview holding the state of the view
 * @param text Text of the featured nanoblock
 * @param percent Show the saving in percentage if equals to `percent`
 * @returns Root node of the nanoblock
 */
function renderFeaturedSavings(mv, text = 'Save', percent = '') {
  const root = createTag(
    'div',
    {
      class: 'featured',
      style: 'visibility=hidden',
    },
    `<span>${text}</span>`,
  );

  mv.subscribe(() => {
    if (mv.model.discountRate) {
      root.innerText = (percent.toLowerCase() === 'percent')
        ? `${text} ${mv.model.discountRate}%`
        : `${text} ${mv.model.discount} ${mv.model.currency}`;
      root.style.visibility = 'visible';
    } else {
      root.style.visibility = 'hidden';
    }
  });

  return root;
}

/**
 * Nanoblock representing the lowest product price
 * @param code Product code
 * @param variant Product variant
 * @returns root node of the nanoblock
 */
function renderLowestPrice(code, variant) {
  const root = document.createElement('p');

  fetchProduct(code, variant).then((product) => {
    trackProduct(product);
    // eslint-disable-next-line max-len
    const price = customRound((product.discount ? product.discount.discount_value : product.price) / 12);
    root.innerHTML = `Start today for as low as  ${price} ${product.currency_label}/mo`;
  });

  return root;
}

/**
 * Nanoblock representing the price conditions below the Price
 * @param mv The modelview holding the state of the view
 * @param text Conditions
 * @returns Root node of the nanoblock
 */
function renderPriceCondition(mv, text) {
  return createTag(
    'div',
    {
      class: 'price',
    },
    `<em>${text}</em>`,
  );
}

// declare nanoblocks
createNanoBlock('plans', renderPlanSelector);
createNanoBlock('price', renderPrice);
createNanoBlock('oldPrice', renderOldPrice);
createNanoBlock('priceCondition', renderPriceCondition);
createNanoBlock('featured', renderFeatured);
createNanoBlock('featuredSavings', renderFeaturedSavings);
createNanoBlock('highlightSavings', renderHighlightSavings);
createNanoBlock('highlight', renderHighlight);
createNanoBlock('lowestPrice', renderLowestPrice);

/**
 * Main decorate function
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    [...(row.children)].forEach((col) => {
      col.classList.add('product-card');
      block.appendChild(col);

      const mv = new ProductCard(col);

      renderNanoBlocks(col, mv);

      // listen to ProductCard change and update button accordingly
      col.querySelectorAll('.button-container').forEach((b) => {
        mv.subscribe((card) => {
          b.querySelector('a').href = card.url;
        });
      });
    });
    row.remove();
  });

  // render nanoblocks in section's content default wrapper
  const defaultContent = block.parentNode.parentNode.querySelector('.default-content-wrapper');
  if (defaultContent) {
    renderNanoBlocks(defaultContent);
  }

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
