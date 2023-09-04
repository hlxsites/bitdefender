import {
  createNanoBlock,
  renderNanoBlocks,
  fetchProduct,
  createTag,
} from '../../scripts/utils/utils.js';

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
      discountedPrice: product.discount?.discount_value,
      discount: product.discount
        ? (product.price - product.discount.discountedPrice).toFixed(2)
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

function renderPlanSelector(plans, defaultSelection, mv) {
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

function renderPrice(mv) {
  const root = createTag(
    'span',
    {},
    `${mv.model.price}`,
  );

  mv.subscribe(() => {
    root.innerHTML = `${mv.model.price}`;
  });

  return root;
}

createNanoBlock('plans', renderPlanSelector);
createNanoBlock('price', renderPrice);

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
}
