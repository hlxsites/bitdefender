import { createNanoBlock, renderNanoBlocks, fetchProduct } from '../../scripts/utils/utils.js';

createNanoBlock('price-comparison', (code, variant, label) => {
  const priceRoot = document.createElement('div');
  priceRoot.classList.add('product-comparison-price');
  const oldPriceElement = document.createElement('p');
  priceRoot.appendChild(oldPriceElement);
  oldPriceElement.innerText = '-';
  oldPriceElement.classList.add('old-price-container');
  const priceElement = document.createElement('strong');
  priceRoot.appendChild(priceElement);
  priceElement.innerText = '-';
  priceElement.classList.add('current-price-container');
  const priceAppliedOnTime = document.createElement('p');
  priceRoot.appendChild(priceAppliedOnTime);

  fetchProduct(code, variant)
    .then((product) => {
      // eslint-disable-next-line camelcase
      const { price, discount: { discounted_price: discounted }, currency_iso: currency } = product;
      oldPriceElement.innerHTML = `Old Price <del>${price} ${currency}</del>`;
      priceElement.innerHTML = `${discounted} ${currency}`;
      priceAppliedOnTime.innerHTML = label;
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err);
    });

  return priceRoot;
});

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
  });
}

function markHiddenRowsUnderExpandableRows(rows, expandableRowsIndexes) {
  if (!expandableRowsIndexes || expandableRowsIndexes.length === 0) {
    return;
  }
  let lastExpandableRow = 0;
  rows.forEach((row, rowIndex) => {
    const index = expandableRowsIndexes.indexOf(rowIndex);
    if (index !== -1 || rowIndex === 0) {
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
      row.children[0].addEventListener('click', handleExpanableRowClick.bind(null, rows, index));
    }
  });
}

function addClassesForExpandableRows(rows) {
  const expandableRowsIndexes = [];

  rows.forEach((row, index) => {
    const expandableRowMarker = row.querySelectorAll('h5');
    if (expandableRowMarker.length === 0 || row.classList.contains('product-comparison-header')) {
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

function extractTextFromStrongTagToParent(element) {
  if (element.children.length > 0) {
    [...element.children].forEach((children) => {
      extractTextFromStrongTagToParent(children);
    });
  }

  if (element.tagName === 'STRONG') {
    element.parentElement.innerHTML = element.textContent;
  }
}

function buildTableHeader(block) {
  const header = block.querySelector('div > div');
  header.classList.add('product-comparison-header');

  [...header.children].forEach((headerColumn) => {
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
  renderNanoBlocks(block);
}
