import getMockData from './product-mock-data.js';

const fakeData = getMockData();

function addAccesibilityRoles(block) {
  block.setAttribute('role', 'table');

  block.querySelectorAll('div')
    .forEach((div) => {
      if (div.children.length > 1) {
        div.setAttribute('role', 'row');
      } else if (div.children.length <= 1 && !div.hasAttribute('role')) {
        div.setAttribute('role', 'cell');
      }
    });

  const header = block.querySelector('div > div');
  [...header.children].forEach((headerColumns) => {
    headerColumns.setAttribute('role', 'columnheader');
  });
}

function replaceTableTextToProperCheckmars(block) {
  block.querySelectorAll('div')
    .forEach(async (div) => {
      if (div.textContent.match(/^yes/i)) {
        div.textContent = '';
        const iconWrapper = document.createElement('div');
        const icon = document.createElement('div');
        icon.classList.add('yes-check');
        iconWrapper.appendChild(icon);
        div.appendChild(iconWrapper);
      } else if (div.textContent.match(/^no/i)) {
        div.textContent = '';
        const iconWrapper = document.createElement('div');
        const icon = document.createElement('div');
        icon.classList.add('no-check');
        iconWrapper.appendChild(icon);
        div.appendChild(iconWrapper);
      }
    });
}

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
    oldPriceContainer.innerHTML = `<p>Old Price <del>${productVariationPrice} ${priceLabel}</del></p>`;
    priceContainer.appendChild(oldPriceContainer);
  }

  const currentPriceContainer = document.createElement('div');
  currentPriceContainer.classList.add('current-price-container');
  currentPriceContainer.innerHTML = `<p>${productVariationDiscountPrice ?? productVariationPrice} ${priceLabel}</p>`;
  priceContainer.appendChild(currentPriceContainer);

  elementToReplace.replaceWith(priceContainer);
}

function replacePricePlaceholderWithActualPrices(headerColumns) {
  const pricePlaceholder = '<price>';
  let productName = '';
  let numberOfDevices = 0;
  [...headerColumns.children].forEach((paragraph) => {
    if (paragraph.tagName === 'H4') {
      productName = paragraph.textContent;
    }
    if (paragraph.tagName === 'P' && paragraph.textContent.includes('Devices')) {
      [numberOfDevices] = paragraph.textContent.split(' ');
    }
    if (paragraph.textContent.match(pricePlaceholder)) {
      buildPriceContainer(productName, numberOfDevices, paragraph);
    }
  });
}

function buildTableHeader(block) {
  const header = block.querySelector('div > div');
  header.classList.add('product-comparison-header');

  [...header.children].forEach((headerColumns) => {
    const strongTagStartRegex = /<strong>/g;
    const strongTagEndRegex = /<\/strong>/g;
    const result = headerColumns.innerHTML.replace(strongTagStartRegex, '');
    headerColumns.innerHTML = result.replace(strongTagEndRegex, '');
    const buttonSection = headerColumns.querySelector('p.button-container');

    if (buttonSection) {
      const paragraphBefore = buttonSection.previousElementSibling;
      paragraphBefore?.classList.add('per-year-statement');
      const paragraphAfter = buttonSection.nextElementSibling;
      paragraphAfter?.classList.add('product-comparison-header-subtitle');
      paragraphAfter?.nextElementSibling.classList.add('product-comparison-header-subtitle');
    }

    replacePricePlaceholderWithActualPrices(headerColumns);
  });
}

function setActiveColumn(block) {
  const columnHeaders = block.querySelectorAll('div[role="columnheader"]');
  const tableActiveColumn = [...columnHeaders]
    .findIndex((header) => header.innerHTML.includes('<strong>'));

  if (tableActiveColumn <= 0) {
    return;
  }

  const rows = block.querySelectorAll('div[role="row"]');
  [...rows].forEach((row) => row.children[tableActiveColumn].classList.add('active'));
}

export default function decorate(block) {
  addAccesibilityRoles(block);
  replaceTableTextToProperCheckmars(block);
  setActiveColumn(block);
  buildTableHeader(block);
}
