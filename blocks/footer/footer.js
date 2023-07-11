import { readBlockConfig, decorateIcons, getMetadata } from '../../scripts/lib-franklin.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  // fetch footer content
  const footerPath = getMetadata('footer') || '/footer';
  const resp = await fetch(`${footerPath}.plain.html`, window.location.pathname.endsWith('/footer') ? { cache: 'reload' } : {});

  if (resp.ok) {
    const html = await resp.text();

    // decorate footer DOM
    const footer = document.createElement('div');
    footer.classList.add('footer-container');
    footer.innerHTML = html;
    const footerHeader = footer.querySelector('div');
    footerHeader.classList.add('footer-header');
    wrapImgsInLinks(footerHeader);
    wrapUnorderedListInDiv(footerHeader, 'ul-wrapper');
    const footerHeaderLinks = footerHeader.querySelectorAll('a');
    footerHeaderLinks.forEach(link => link.classList.add('footer-header-link'));
    decorateIcons(footer);
    block.append(footer);
  }
}

function wrapImgsInLinks(container) {
  const pictures = container.querySelectorAll('picture');
  pictures.forEach((pic) => {
    const link = pic.nextElementSibling;
    if (link && link.tagName === 'A' && link.href) {
      link.innerHTML = pic.outerHTML;
      pic.replaceWith(link);
    }
  });
}

function wrapUnorderedListInDiv(container, className) {
  const unorderedLists = container.querySelectorAll('ul');
  unorderedLists.forEach(ul => {
    const div = document.createElement('div');
    div.innerHTML = ul.outerHTML;
    div.classList.add(className);
    ul.replaceWith(div);
  });
}
