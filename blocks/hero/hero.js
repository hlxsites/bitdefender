// Description: Hero block
import {
  createTag,
  createNanoBlock,
  renderNanoBlocks,
  fetchProduct,
} from '../../scripts/utils/utils.js';

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
async function buildHeroBlock(element) {
  const h1 = element.querySelector('h1');
  const picture = element.querySelector('picture');
  const pictureParent = picture ? picture.parentNode : false;
  // eslint-disable-next-line no-bitwise
  if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
    const section = document.querySelector('div.hero');
    const subSection = document.querySelector('div.hero div');
    subSection.classList.add('hero-content');
    // get number of children in hero-content
    const numberOfChildren = subSection.childElementCount;
    // iterate though children and add numbered class to each child
    for (let i = 0; i < numberOfChildren; i += 1) {
      subSection.children[i].classList.add(`hero-content-${i}`);
    }

    const breadcrumb = createTag('div', { class: 'breadcrumb' });
    subSection.querySelector('.hero-content-0').prepend(breadcrumb);

    import('../../scripts/breadcrumbs.js');

    const pictureEl = document.createElement('div');
    pictureEl.classList.add('hero-picture');
    pictureEl.append(picture);

    section.prepend(pictureEl);

    pictureParent.remove();
  }
}

/**
 * Decorates discount bubble div
 */
function decorateDiscountBubble() {
  // search in hero block for p tag that contains a tag with class button only
  if (document.querySelectorAll('.hero p.button-container a.button')) {
    // Example:  <p><a href="example.com">Text</a> <em>50% Discount</em></p>
    const linksList = document.querySelectorAll('.hero p.button-container a.button');
    // iterate through all linksList
    linksList.forEach((link) => {
      // check if next element is em tag
      if (link.nextElementSibling?.tagName === 'EM') {
        const divBubble = document.createElement('div');
        divBubble.classList.add('discount-bubble');
        const textArray = link.nextElementSibling.textContent.trim().split(' ');

        textArray.forEach((text) => {
          const span = document.createElement('span');
          span.classList.add(`discount-bubble-${textArray.indexOf(text)}`);
          span.innerHTML = text;
          divBubble.append(span);
        });

        link.parentNode.appendChild(divBubble);
        link.classList.add('discount-bubble-container');
        link.nextElementSibling.remove();
      }
    });
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
 * decorates hero block
 * @param {Element} block The hero block element
 */
export default async function decorate(block) {
  await buildHeroBlock(block);

  // get div class hero-content
  const elementHeroContent = block.querySelector('.hero div.hero-content div');

  if (elementHeroContent !== null) {
    // find pattern for discount bubble
    // <p class="button-container"><a class="button primary" href="example.com">Text</a></p>
    // <p><em>50% Discount</em></p>
    decorateDiscountBubble();

    // Select  <ul> elements that contain a <picture> tag
    const ulsWithPicture = Array.from(document.querySelectorAll('ul')).filter((ul) => ul.querySelector('picture'));

    // Apply a CSS class to each selected <ul> element
    ulsWithPicture.forEach((ul) => ul.classList.add('hero-awards'));
  }
  renderNanoBlocks(block);

  // move discount bubble inside the button
  const bubble = block.querySelector('.discount-bubble');
  if (bubble) {
    bubble.parentElement.querySelector('.button-container').append(bubble);
  }
}
