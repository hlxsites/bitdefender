import getMockData from './product-mock-data.js';

const fakeData = getMockData();
const pricePlaceholder = '<price>';

function handleExpanableRowClick(rows, expandableRowIndex, evt) {
  evt.currentTarget.classList.toggle('expanded');

  [...rows].forEach((row, index) => {
    if (parseInt(row.getAttribute('expandable-row-index'), 10) === expandableRowIndex) {
      row.classList.toggle('hidden');
      row.classList.remove('not-visible');
    } else if (row.hasAttribute('expandable-row-index') && !row.classList.contains('hidden')) {
      row.classList.add('hidden');
      row.classList.add('not-visible');
    } else if (row.classList.contains('expanded') && index !== expandableRowIndex) {
      row.classList.remove('expanded');
    }
  })
}

function markHiddenRowsUnderExpandableRows(rows, expandableRowsIndexes) {
  if (!expandableRowsIndexes || expandableRowsIndexes.length === 0) {
    return;
  }
  let lastExpandableRow = 0;
  rows.forEach((row, rowIndex) => {
    const index = expandableRowsIndexes.indexOf(rowIndex);
    if (index != -1 || rowIndex === 0) {
      lastExpandableRow = expandableRowsIndexes[index];
      return;
    }

    row.classList.add('hidden');
    row.classList.add('not-visible');
    row.setAttribute('expandable-row-index', lastExpandableRow);
  });
}

function addArrowAndEventToExpandableRows(rows) {
  rows.forEach((row, index) => {
    if (row.classList.contains('expandable-row')
      && row.nextElementSibling !== null
      && !row.nextElementSibling.classList.contains('expandable-row')) {
      row.classList.add('expandable-arrow');
      row.addEventListener('click', handleExpanableRowClick.bind(null, rows, index));
    }
  });
}

function addClassesForExpandableRows(rows) {
  const expandableRowsIndexes = [];

  rows.forEach((row, index) => {
    const italicStyleElements = row.querySelectorAll('h5');
    if (italicStyleElements.length === 0 || row.classList.contains('product-comparison-header')) {
      return;
    }
    
    row.classList.add('expandable-row');
    expandableRowsIndexes.push(index);
  });

  addArrowAndEventToExpandableRows(rows);
  markHiddenRowsUnderExpandableRows(rows, expandableRowsIndexes);
}

function setExpandableRows(block) {
  const rows = block.querySelectorAll('div[role="row"]');
  addClassesForExpandableRows(rows);
  markHiddenRowsUnderExpandableRows(rows);

}

function addAccesibilityRoles(block) {
  block.setAttribute('role', 'table');

  block.querySelectorAll('div')
    .forEach((div) => {
      if (div.childElementCount > 1 && div.parentElement.getAttribute('role') === 'table') {
        div.setAttribute('role', 'row');
      } else if (!div.hasAttribute('role')) {
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

export default function decorate(block) {
  addAccesibilityRoles(block);
  replaceTableTextToProperCheckmars(block);
  setExpandableRows(block);
  setActiveColumn(block);
  buildTableHeader(block);
  extractTextFromStrongTagToParent(block);
}
