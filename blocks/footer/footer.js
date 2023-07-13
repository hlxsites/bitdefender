import { decorateIcons, getMetadata } from '../../scripts/lib-franklin.js';

function createMobileViewFor(container, nextTo, expandable) {
  const mobileViewDiv = document.createElement('div');
  mobileViewDiv.classList.add('mobile-device-view');
  mobileViewDiv.innerHTML = container.outerHTML;
  const mobileContainer = mobileViewDiv.querySelector('div');
  mobileContainer.classList = ['mobile-container'];
  if (nextTo) {
    nextTo.after(mobileViewDiv);
  } else {
    container.after(mobileViewDiv);
  }
  const title = mobileViewDiv.querySelector('.section-title');
  title.classList.add('mobile-view-section-title');

  if (expandable) {
    title.classList.add('selection-arrow');
    title.classList.add('no-padding');

    title.addEventListener('click', () => {
      if (mobileViewDiv.classList.contains('active')) {
        mobileViewDiv.classList.remove('active');
      } else {
        mobileViewDiv.classList.add('active');
      }
    });
  } else {
    mobileViewDiv.classList.add('active');
    mobileContainer.classList.add('no-border');
  }

  return nextTo ? nextTo.nextElementSibling : container.nextElementSibling;
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

function wrapUnorderedListInDiv(container, divClassName) {
  const unorderedLists = container.querySelectorAll('ul');
  unorderedLists.forEach((ul) => {
    const div = document.createElement('div');
    div.innerHTML = ul.outerHTML;
    div.classList.add(divClassName);
    ul.replaceWith(div);
  });
}

function wrapParagraphAndULInDiv(container) {
  const paragraphs = container.querySelectorAll('p');
  paragraphs.forEach((p) => {
    const unorderedList = p.nextElementSibling;
    const div = document.createElement('div');
    div.innerHTML = `${p.outerHTML}${unorderedList.outerHTML}`;
    p.replaceWith(div);
    unorderedList.remove();
  });
}

function wrapParagraphInADiv(container, divClassName) {
  const paragraph = container.querySelector('p');
  const div = document.createElement('div');
  div.innerHTML = paragraph.outerHTML;
  div.classList.add(divClassName);
  paragraph.replaceWith(div);
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
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
    footerHeaderLinks.forEach((link) => link.classList.add('footer-header-link'));

    const followAndQuickLinksSection = footerHeader.nextElementSibling;
    followAndQuickLinksSection.classList.add('quick-list-section-container');
    followAndQuickLinksSection.querySelectorAll('p')
      .forEach((paragraph) => paragraph.classList.add('section-title'));
    wrapParagraphAndULInDiv(followAndQuickLinksSection);
    const followAndQuickLinksSectionChildrens = followAndQuickLinksSection.querySelectorAll('div');
    const followBitdefender = followAndQuickLinksSectionChildrens[0];
    const quickLinksSection = followAndQuickLinksSectionChildrens[1];
    const quickLinksMovileView = createMobileViewFor(
      quickLinksSection,
      followAndQuickLinksSection,
      true
    );
    const mobileViewTitle = quickLinksMovileView.querySelector('p');
    mobileViewTitle.classList.add('section-title');
    mobileViewTitle.classList.add('mobile-view-title');

    const chooseYourCountrySection = quickLinksMovileView.nextElementSibling;
    chooseYourCountrySection.classList.add('choose-your-country-language-section');
    chooseYourCountrySection.querySelector('p').classList.add('section-title');
    const chooseYourCountrySectionMobileView = createMobileViewFor(
      chooseYourCountrySection,
      undefined,
      true
    );
    const followBitdefenerMobileView = createMobileViewFor(
      followBitdefender,
      chooseYourCountrySectionMobileView
    );
    followBitdefenerMobileView.querySelector('.mobile-container')
      .classList.add('follow-bitdefender-mobile-section');

    const trustedSection = followBitdefenerMobileView.nextElementSibling;
    trustedSection.classList.add('trusted-section');

    const copyrightSection = trustedSection.nextElementSibling;
    copyrightSection.classList.add('copyright-section');
    wrapUnorderedListInDiv(copyrightSection, 'copyright-ul-wrapper');
    wrapParagraphInADiv(copyrightSection, 'copyright-section-p-wrapper');

    decorateIcons(footer);
    block.append(footer);
  }
}
