// Description: Hero block
import {
  createTag,
  createNanoBlock,
  renderNanoBlocks,
  fetchProduct,
} from '../../scripts/utils/utils.js';
import { trackProduct } from '../../scripts/scripts.js';
import { ProductCard } from '../products/products.js';
/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} element The container element
 */
function buildHeroBlock(element) {
  const h1 = element.querySelector('h1');
  const picture = element.querySelector('picture');
  const pictureParent = picture ? picture.parentNode : false;
  // eslint-disable-next-line no-bitwise
  if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
    const section = document.querySelector('div.hero');
    const subSection = document.querySelector('div.hero div');
    subSection.classList.add('hero-content');

    const breadcrumb = createTag('div', { class: 'breadcrumb' });
    document.querySelector('div.hero div div:first-child').prepend(breadcrumb);

    const pictureEl = document.createElement('div');
    pictureEl.classList.add('hero-picture');
    pictureEl.append(picture);

    section.prepend(pictureEl);

    pictureParent.remove();
  }
}

createNanoBlock('discount', (code, variant) => {
  const root = document.createElement('div');
  root.classList.add('discount-bubble');
  root.innerHTML = `
    <span class="discount-bubble-0">--%</span>
    <span class="discount-bubble-1">Discount</span>
  `;

  fetchProduct(code, variant)
    .then((product) => {
      if (product.discount) {
        const discount = Math.round(
          (1 - (product.discount.discounted_price) / product.price) * 100,
        );
        root.querySelector('.discount-bubble-0').textContent = `${discount}%`;
      } else {
        // eslint-disable-next-line no-console
        console.error('no discount available');
      }
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err);
    });
  return root;
});

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
    `<strong>${mv.model.basePrice}</strong>`,
  );

  const priceElt = root.querySelector('strong');

  mv.subscribe(() => {
    if (monthly.toLowerCase() === 'monthly') {
      if (mv.model.discountedPrice) {
        priceElt.innerHTML = `${text} ${mv.model.discountedMonthlyPrice} ${mv.model.currency} <sup>/mo</sup>`;
      } else {
        priceElt.innerHTML = `${text} ${mv.model.monthlyBasePrice} ${mv.model.currency} <sup>/mo</sup>`;
      }
    } else if (mv.model.discountedPrice) {
      priceElt.innerHTML = `${text} ${mv.model.discountedPrice} ${mv.model.currency}`;
    } else {
      priceElt.innerHTML = `${text} ${mv.model.basePrice} ${mv.model.currency}`;
    }

    trackProduct(mv.model);
  });

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
    `<span class='old-price'>${text} <del>${mv.model.basePrice ?? ''} ${mv.model.currency ?? ''}</del>`,
  );

  const oldPriceElt = root.querySelector('span');

  mv.subscribe(() => {
    if (mv.model.discountedPrice) {
      oldPriceElt.innerHTML = monthly.toLowerCase() === 'monthly'
        ? `${text} <del>${mv.model.monthlyBasePrice} ${mv.model.currency}<sup>/mo</sup></del>`
        : `${text} <del>${mv.model.basePrice} ${mv.model.currency}</del>`;
      oldPriceElt.style.visibility = 'visible';
    } else {
      oldPriceElt.style.visibility = 'hidden';
    }
  });

  return root;
}
createNanoBlock('price', renderPrice);
createNanoBlock('oldPrice', renderOldPrice);

/**
 * decorates hero block
 * @param {Element} block The hero block element
 */
export default async function decorate(block) {
  buildHeroBlock(block);
  // Eager load images to improve LCP
  [...block.querySelectorAll('img')].forEach((el) => el.setAttribute('loading', 'eager'));

  // get div class hero-content
  const elementHeroContent = block.querySelector('.hero div.hero-content div');

  if (elementHeroContent !== null) {
    // Select  <ul> elements that contain a <picture> tag
    const ulsWithPicture = Array.from(document.querySelectorAll('ul')).filter((ul) => ul.querySelector('picture'));

    // Apply a CSS class to each selected <ul> element
    ulsWithPicture.forEach((ul) => ul.classList.add('hero-awards'));

    [...block.children].forEach((row) => {
      if (row.classList.contains('hero-content')) {
        [...(row.children)].forEach((col) => {
          // col.classList.add('product-card');
          // block.appendChild(col);
          // checl if the column has a hero class name

          const mv = new ProductCard(col);
          renderNanoBlocks(col, mv);

          // get the parent node of the em
          const emParent = row.querySelector('.price.nanoblock em');
          emParent.prepend(' / ');

          // get the parent node of the strong
          const strongParent = row.querySelector('.price.nanoblock strong').parentNode;

          if (strongParent) {
            emParent.parentElement.remove();
            strongParent.appendChild(emParent);
          }

          // listen to ProductCard change and update the buttons pointing to the store url
          mv.subscribe((card) => {
            col.querySelectorAll('.button-container a').forEach((link) => {
              if (link && link.href.startsWith('https://www.bitdefender.com.au/site/Store/buy')) {
                link.href = card.url;
              }
            });
          });
        });
      }
      // row.remove();
    });

    renderNanoBlocks(block);

    // move discount bubble inside the closest button
    const bubble = block.querySelector('.discount-bubble');
    if (bubble) {
      let sibling = bubble.previousElementSibling;

      while (sibling) {
        if (sibling.matches('.button-container')) {
          sibling.append(bubble);
          break;
        }
        sibling = sibling.previousElementSibling;
      }
    }
  }
}
