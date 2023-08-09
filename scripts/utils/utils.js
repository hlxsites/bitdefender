// eslint-disable-next-line import/prefer-default-export
export function createTag(tag, attributes, html) {
  const el = document.createElement(tag);
  if (html) {
    if (html instanceof HTMLElement
        || html instanceof SVGElement
        || html instanceof DocumentFragment) {
      el.append(html);
    } else if (Array.isArray(html)) {
      el.append(...html);
    } else {
      el.insertAdjacentHTML('beforeend', html);
    }
  }
  if (attributes) {
    Object.entries(attributes).forEach(([key, val]) => {
      el.setAttribute(key, val);
    });
  }
  return el;
}

/**
 * Results returned from {@link fetchIndex} come from a derived Excel sheet that is constructed
 * with the FILTER function. This FILTER function has the unwanted side effect of returning '0' in
 * cells that are empty in the original sheet.
 *
 * This function replaces those '0' values with empty cells again.
 *
 * @see fetchIndex
 * @param {Object} data - the data returned from the fetchIndex function.
 */
export function fixExcelFilterZeroes(data) {
  data.forEach((line) => {
    Object.keys(line).forEach((k) => {
      line[k] = line[k] === '0' ? '' : line[k];
    });
  });
}

export async function fetchIndex(indexFile, sheet, pageSize = 500) {
  const idxKey = indexFile.concat(sheet || '');

  const handleIndex = async (offset) => {
    const sheetParam = sheet ? `&sheet=${sheet}` : '';

    const resp = await fetch(`/${indexFile}.json?limit=${pageSize}&offset=${offset}${sheetParam}`);
    const json = await resp.json();

    const newIndex = {
      complete: (json.limit + json.offset) === json.total,
      offset: json.offset + pageSize,
      promise: null,
      data: [...window.index[idxKey].data, ...json.data],
    };

    return newIndex;
  };

  window.index = window.index || {};
  window.index[idxKey] = window.index[idxKey] || {
    data: [],
    offset: 0,
    complete: false,
    promise: null,
  };

  if (window.index[idxKey].complete) {
    return window.index[idxKey];
  }

  if (window.index[idxKey].promise) {
    return window.index[idxKey].promise;
  }

  window.index[idxKey].promise = handleIndex(window.index[idxKey].offset);
  const newIndex = await (window.index[idxKey].promise);
  window.index[idxKey] = newIndex;

  return newIndex;
}
