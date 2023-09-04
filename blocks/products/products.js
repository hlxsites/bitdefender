import {
  createNanoBlock,
  renderNanoBlocks,
  fetchProduct,
  createTag,
} from '../../scripts/utils/utils.js';

import { trackProduct } from '../../scripts/scripts.js';


// todo change to represent the multiple cards
class ProductCard {
  constructor(root) {
    this.root = root;
    this.listeners = [];
    this.model = {
      code: undefined,
      variant: undefined,
      price: '--.--',
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

  async fetchProductVariant(productCode, variantCode) {
    const product = await fetchProduct(productCode, variantCode);

    const variant = {
      productCode,
      variantCode,
      price: product.price,
      discountedPrice: product.discount?.discounted_price,
      discount: product.discount
        ? Math.round((product.price - product.discount.discounted_price ) * 100) / 100
        : undefined,
      discountRate: product.discount
        ? Math.round((1 - (product.discount.discount_value) / product.price) * 100)
        : undefined,
      currency: product.currency_label,
      url: `https://www.bitdefender.com/site/Store/buy/${productCode}/${product.variation.dimension_value}/${product.variation.years}/`,
    };

    this.model = variant;

    this.notify();
  }
}

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
      mv.fetchProductVariant(code, variant);
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
 * Render a product price nanoblock
 * @param code Product code
 * @param variant Product variant
 * @param label Label
 * @returns Root node of the nanoblock
 */
function renderOldPrice(mv, text = '',  monthly='') {
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
        ? `${text} <del>${Math.round(mv.model.price / 12)} ${mv.model.currency}<sup>/mo</sup></del>`
        : `${text} <del>${mv.model.price} ${mv.model.currency}</del>`;
      oldPriceElt.style.visibility = 'visible';
    } else {
      oldPriceElt.style.visibility = 'hidden';
    }
  });

  return root;
}

/**
 * Render a product price nanoblock
 * @param code Product code
 * @param variant Product variant
 * @param label Label
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
    const price = mv.model.discountedPrice ? mv.model.discountedPrice : mv.model.price;
    priceElt.innerHTML = monthly.toLowerCase() === 'monthly'
      ? `${text} ${Math.round(price / 12)} ${mv.model.currency}<sup>/mo</sup>`
      : `${text} ${price} ${mv.model.currency}`;
  });

  return root;
}

/**
 * Renders the green section on top of the product card highlighting the potential savings
 * @returns the root node of the highilight block
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
 * Render a Featured nanoblock
 * @param text Text of the featured nanoblock
 * @returns Root node of the feature nanoblock
 */
function renderFeatured(mv, text) {
  const root = document.createElement('div');
  root.classList.add('featured');
  root.innerText = text;
  return root;
}

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
 * Render the lowest product price
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

createNanoBlock('plans', renderPlanSelector);
createNanoBlock('price', renderPrice);
createNanoBlock('oldPrice', renderOldPrice);
createNanoBlock('featured', renderFeatured);
createNanoBlock('featuredSavings', renderFeaturedSavings);
createNanoBlock('highlightSavings', renderHighlightSavings);
createNanoBlock('highlight', renderHighlight);
createNanoBlock('lowestPrice', renderLowestPrice);

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
