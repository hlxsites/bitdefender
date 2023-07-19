/*
 * Copyright 2023 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* global WebImporter */
/* eslint-disable no-console, class-methods-use-this */

const createMetadata = (main, document) => {
  const meta = {};

  const title = document.querySelector('title');
  if (title) {
    meta.Title = title.textContent.replace(/[\n\t]/gm, '');
  }

  const desc = document.querySelector('[property="og:description"]');
  if (desc) {
    meta.Description = desc.content;
  }

  const img = document.querySelector('[property="og:image"]');
  if (img && img.content) {
    const el = document.createElement('img');
    el.src = img.content;
    meta.Image = el;
  }

  const block = WebImporter.Blocks.getMetadataBlock(document, meta);
  main.append(block);

  return meta;
};

const createSectionMetadata = (top, text, img, document) => {
  const table = [['Section Metadata']];
  if (text.length > 0) {
    const style = ['Style'];
    style.push(text);
    table.push(style);
  }
  if (img) {
    table.push(['background-image', img]);
  }
  if (table.length > 1) {
    top.append(WebImporter.DOMUtils.createTable(table, document));
  }
};

function createLink(href, text, prefix, document) {
  if (href) {
    const link = document.createElement('a');
    link.href = new URL(prefix).origin + href;
    link.innerHTML = text.innerHTML;
    return link;
  }
  return '';
}

export default {
  REQUIRED_STYLES: ['display', 'background-image', 'width', 'background-color', 'color', 'font-size', 'font-weight', 'text-transform', 'letter-spacing', 'opacity'],
  preprocess: ({
    // eslint-disable-next-line no-unused-vars
    document, _, html, params,
  }) => {
    const toggleElem = document.querySelector('.elementor-toggle');
    if (toggleElem) {
      let { style: { width } } = toggleElem;
      width = parseInt(width.substr(0, width.length - 2), 10);
      if (width < 700) {
        params.narrowCollapsible = true;
      }
    }
  },
  /**
     * Apply DOM operations to the provided document and return
     * the root element to be then transformed to Markdown.
     * @param {HTMLDocument} document The document
     * @param {string} url The url of the page imported
     * @param {string} html The raw html (the document is cleaned up during preprocessing)
     * @param {object} params Object containing some parameters given by the import process.
     * @returns {HTMLElement} The root element to be transformed
     */
  transformDOM: ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => {
    // define the main element: the one that will be transformed to Markdown
    const main = document.body;

    // use helper method to remove header, footer, etc.
    WebImporter.DOMUtils.remove(main, [
      'header',
      'footer',
      'noscript',
      'defs',
      'svg',
      '#onetrust-consent-sdk',
    ]);

    // cards
    // ---cards-genai-start---
    main.querySelectorAll('.d-grid.grid-template-2-column.gap-4.mt-4').forEach((cards) => {
      const cardCells = [
        ['Cards'],
      ];
      cards.querySelectorAll('.card').forEach((card) => {
        const cardData = [card.querySelector('.image-element-0 img, .image-element-1 img'), [card.querySelector('h3'), card.querySelector('h4'), card.querySelector('.description-devices p'), card.querySelector('.description ul')]];
        cardCells.push(cardData);
      });

      const cardsBlock = WebImporter.DOMUtils.createTable(cardCells, document);
      cards.replaceWith(cardsBlock);
    });

    main.querySelectorAll('.product-compare-bar .compare-progress-bar .column-wrapper .we-col-two').forEach((card) => {
      const cardCells = [
        ['Cards'],
      ];
      const cardData = [card.querySelector('.icon img'), [card.querySelector('h3.h4'), card.querySelector('.content-wrap p'), card.querySelector('.progress-bar')]];
      cardCells.push(cardData);

      const cardsBlock = WebImporter.DOMUtils.createTable(cardCells, document);
      card.replaceWith(cardsBlock);
    });
    // ---cards-genai-end---

    // create the metadata block and append it to the main element
    createMetadata(main, document);

    return main;
  },

  /**
     * Return a path that describes the document being transformed (file name, nesting...).
     * The path is then used to create the corresponding Word document.
     * @param {HTMLDocument} document The document
     * @param {string} url The url of the page imported
     * @param {string} html The raw html (the document is cleaned up during preprocessing)
     * @param {object} params Object containing some parameters given by the import process.
     * @return {string} The path
     */
  generateDocumentPath: ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => WebImporter.FileUtils.sanitizePath(new URL(url).pathname.replace(/\.html$/, '').replace(/\/$/, '')),
};
