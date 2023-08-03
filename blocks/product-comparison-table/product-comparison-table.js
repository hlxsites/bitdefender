import getMockData from './product-mock-data.js';

const fakeData = getMockData();

function buildPriceContainer(productName, numberOfDevices, elementToReplace) {
  const priceContainer = document.createElement('div');
  priceContainer.classList.add('product-comparison-price');

  const productData = fakeData
    .filter((product) => product.data.product.product_name === productName);
  if (productData.length === 0) {
    return;
  }
  const variationPrice = productData[0].data.product.variations[numberOfDevices][1];
  const productVariationPrice = variationPrice.price;
  const productVariationDiscountPrice = variationPrice.discount.discounted_price;
  const priceLabel = variationPrice.currency_label;

  if (productVariationDiscountPrice) {
    const oldPriceContainer = document.createElement('div');
    oldPriceContainer.classList.add('old-price-container');
    oldPriceContainer.innerHTML = `<p>Old Price <span class='price-strike-through'>${productVariationPrice} ${priceLabel}</span></p>`;
    priceContainer.appendChild(oldPriceContainer);
  }

  const currentPriceContainer = document.createElement('div');
  currentPriceContainer.classList.add('current-price-container');
  currentPriceContainer.innerHTML = `<p>${productVariationDiscountPrice ?? productVariationPrice} ${priceLabel}</p>`;
  priceContainer.appendChild(currentPriceContainer);

  elementToReplace.replaceWith(priceContainer);;
}

export default function decorate(block) {
  block.setAttribute('role', 'table');

  block.querySelectorAll('div')
    .forEach(async (div) => {
      if (div.children.length > 1) {
        div.setAttribute('role', 'row');
      } else if (div.children.length <= 1 && !div.hasAttribute('role')) {
        div.setAttribute('role', 'cell');
      }
      if (div.firstElementChild?.tagName === 'STRONG'
        || div.firstElementChild?.firstElementChild?.tagName === 'STRONG') {
        div.classList.add('active');
      }
      if (div.textContent.match(/^[yY]es/)) {
        div.textContent = '';
        const iconWrapper = document.createElement('div');
        const icon = document.createElement('div');
        icon.classList.add('yes-check');
        iconWrapper.appendChild(icon);
        div.appendChild(iconWrapper);
      } else if (div.textContent.match(/^[nN]o/)) {
        div.textContent = '';
        const iconWrapper = document.createElement('div');
        const icon = document.createElement('div');
        icon.classList.add('no-check');
        iconWrapper.appendChild(icon);
        div.appendChild(iconWrapper);
      }
    });

  const header = block.querySelector('div > div');
  header.classList.add('product-comparison-header');

  for (const childrenHeader of header.children) {
    childrenHeader.setAttribute('role', 'columnheader');
    const strongTagStartRegex = /<strong>/g;
    const strongTagEndRegex = /<\/strong>/g;
    const result = childrenHeader.innerHTML.replace(strongTagStartRegex, '');
    childrenHeader.innerHTML = result.replace(strongTagEndRegex, '');
    const buttonSection = childrenHeader.querySelector('p.button-container');

    if (buttonSection) {
      const paragraphBefore = buttonSection.previousElementSibling;
      paragraphBefore?.classList.add('per-year-statement');
      const paragraphAfter = buttonSection.nextElementSibling;
      paragraphAfter?.classList.add('product-comparison-header-subtitle');
      paragraphAfter?.nextElementSibling.classList.add('product-comparison-header-subtitle');
    }

    const pricePlaceholder = '<price>';
    let productName = '';
    let numberOfDevices = 0;
    for (const paragraph of childrenHeader.children) {
      if (paragraph.tagName === 'H4') {
        productName = paragraph.textContent;
      }
      if (paragraph.tagName === 'P' && paragraph.textContent.includes('Devices')) {
        numberOfDevices = paragraph.textContent.split(' ')[0];
      }
      if (paragraph.textContent.match(pricePlaceholder)) {
        buildPriceContainer(productName, numberOfDevices, paragraph);
      }
    }
  }
}
