// Description: Hero block

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
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

    // get number of children in hero-content
    const numberOfChildren = subSection.childElementCount;
    // iterate though children and add numbered class to each child
    for (let i = 0; i < numberOfChildren; i += 1) {
      subSection.children[i].classList.add(`hero-content-${i}`);
    }

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
  // Example: <p><a href="example.com">Text</a> 50% Discount</p>
  const p = document.querySelector('p.button-container');
  // find next p tag that contains a em element
  const emElement = p.nextElementSibling.querySelector('em');
  // check if em Element exists
  if (emElement !== null) {
    const div = document.createElement('div');
    div.classList.add('discount-bubble');
    const textArray = emElement.textContent.trim().split(' ');

    textArray.forEach((text) => {
      const span = document.createElement('span');
      span.classList.add(`discount-bubble-${textArray.indexOf(text)}`);
      span.innerHTML = text;
      div.append(span);
    });

    p.append(div);
    emElement.remove();
  }
}

/**
 * decorates hero block
 * @param {Element} block The hero block element
 */
export default async function decorate(block) {
  buildHeroBlock(block);
  // get div class hero-content
  const elementHeroContent = block.querySelector('.hero div.hero-content div');

  if (elementHeroContent !== null) {
    // add div for breadcrumb
    const breadcrumb = document.createElement('div');
    breadcrumb.classList.add('breadcrumb');
    breadcrumb.innerHTML = '<a href="/">Home</a> / <a href="#.html">Solutions</a> /';

    elementHeroContent.insertBefore(breadcrumb, elementHeroContent.firstChild);

    // find pattern for discount bubble
    // <p class="button-container"><a class="button primary" href="example.com">Text</a></p>
    // <p><em>50% Discount</em></p>
    decorateDiscountBubble();

    // find ul tag that contains picture tag
    const elementPicture = elementHeroContent.querySelector('ul:has(picture)');

    if (elementPicture !== null) {
      elementPicture.classList.add('hero-awards');
    }
  }
}
