import getMockData from './product-mock-data.js';
import { createNanoBlock, renderNanoBlocks, fetchProduct } from '../../scripts/utils/utils.js';


const fakeData = getMockData();
const pricePlaceholder = '<price>';

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

function extractTextFromStrongTagToParent(element) {
  if (element.children.length > 0) {
    [...element.children].forEach((children) => {
      extractTextFromStrongTagToParent(children);
    });
  }

  if (element.tagName === 'STRONG' && !element.innerHTML.match(pricePlaceholder)) {
    element.parentElement.innerHTML = element.textContent;
  }
}

function buildTableHeader(block) {
  const header = block.querySelector('div > div');
  header.classList.add('product-comparison-header');

  [...header.children].forEach((headerColumn) => {
    replacePricePlaceholderWithActualPrices(headerColumn);
    const buttonSection = headerColumn.querySelector('p.button-container');

    if (buttonSection) {
      const paragraphBefore = buttonSection.previousElementSibling;
      paragraphBefore?.classList.add('per-year-statement');
      const paragraphAfter = buttonSection.nextElementSibling;
      paragraphAfter?.classList.add('product-comparison-header-subtitle');
      paragraphAfter?.nextElementSibling.classList.add('product-comparison-header-subtitle');
    }
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

createNanoBlock('price-Comparison', (code, variant, label) => {
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
      // eslint-disable-next-line camelcase
      const { price, discount: { discounted_price: discounted }, currency_iso: currency } = product;
      oldPriceElement.innerText = `${price} ${currency}`;
      priceElement.innerHTML = `${discounted} ${currency} <em>${label}</em>`;
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err);
    });

  return priceRoot;
});


export default function decorate(block) {
  addAccesibilityRoles(block);
  replaceTableTextToProperCheckmars(block);
  setActiveColumn(block);
  buildTableHeader(block);
  extractTextFromStrongTagToParent(block);
  renderNanoBlocks(block);
}
