/* eslint-disable no-plusplus */
/* eslint-disable no-use-before-define */
/* eslint-disable prefer-const */
/* eslint-disable no-shadow */
import { getMetadata, decorateIcons, decorateButtons } from '../../scripts/lib-franklin.js';
/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */

function createLoginModal() {
  const loginModal = document.querySelector('nav > div:nth-child(4)');
  loginModal.classList.add('login-modal');

  const triangle = document.createElement('div');
  triangle.className = 'triangle';
  loginModal.appendChild(triangle);

  const divider = document.createElement('div');
  divider.className = 'divider';
  loginModal.appendChild(divider);

  decorateButtons(nav);

  //const loginButtons = loginModal.querySelectorAll('p');
  //loginButtons.forEach(button => button.classList.add('login-buttons'));
}

function handleLoginClick() {
  const loginModal = document.querySelector('nav > div:nth-child(4)');
  loginModal.classList.toggle('show');
}

function appendUlToP() {
  let divs = document.querySelectorAll('.mega-menu > div');

  divs.forEach((div) => {
    let uls = div.querySelectorAll('ul');
    uls.forEach((ul) => {
      let p = ul.previousElementSibling;

      let span = document.createElement('div');

      Array.from(ul.children).forEach((li) => {
        span.textContent += ` ${li.textContent}`;
      });

      p.appendChild(span);

      ul.remove();
    });
  });
}

function createTags(links) {
  links.forEach((link) => {
    if (link.textContent.includes('[new]')) {
      link.textContent = link.textContent.replace('[new]', '');
      let span = document.createElement('span');
      span.textContent = 'NEW';
      span.id = 'new';
      link.parentNode.insertBefore(span, link.nextSibling);
    } else if (link.textContent.includes('[evolved]')) {
      link.textContent = link.textContent.replace('[evolved]', '');
      let span = document.createElement('span');
      span.textContent = 'EVOLVED';
      span.id = 'evolved';
      span.style.backgroundColor = '#14b0a7';
      link.parentNode.insertBefore(span, link.nextSibling);
    }
  });
}

function wrapDivsInMegaMenu() {
  const nav = document.getElementById('nav');
  const divs = Array.from(nav.children).filter((node) => node.tagName.toLowerCase() === 'div');
  const navSectionsIndex = divs.findIndex((div) => div.classList.contains('nav-sections'));
  const megaMenuDiv = document.createElement('div');
  megaMenuDiv.className = 'mega-menu';

  const otherOptionsDiv = document.createElement('div');
  otherOptionsDiv.className = 'other-options';

  const bottomLinks = document.createElement('div');
  bottomLinks.className = 'bottom-links';

  megaMenuDiv.appendChild(divs[navSectionsIndex + 1].cloneNode(true));
  nav.removeChild(divs[navSectionsIndex + 1]);

  for (let i = navSectionsIndex + 2; i < 8; i++) {
    otherOptionsDiv.appendChild(divs[i].cloneNode(true));
    nav.removeChild(divs[i]);
  }

  for (let i = 8; i < divs.length; i++) {
    bottomLinks.appendChild(divs[i].cloneNode(true));
    nav.removeChild(divs[i]);
  }

  nav.appendChild(megaMenuDiv);
  megaMenuDiv.appendChild(otherOptionsDiv);
  megaMenuDiv.appendChild(bottomLinks);

  // Move first child of otherOptionsDiv to megaMenuDiv
  if (otherOptionsDiv.firstElementChild) {
    megaMenuDiv.insertBefore(otherOptionsDiv.firstElementChild, otherOptionsDiv);
  }

  // Move first child of bottomLinks to otherOptionsDiv
  if (bottomLinks.firstElementChild) {
    otherOptionsDiv.appendChild(bottomLinks.firstElementChild);
  }

  const loginModal = document.querySelector('.mega-menu > div:first-child');
  nav.appendChild(loginModal);
}

function buildMegaMenu() {
  wrapDivsInMegaMenu();
  appendUlToP();
  let links = document.querySelectorAll('p > a');
  createTags(links);
}

async function renderDesktopHeader(block, nav) {
  const navSections = nav.querySelector('.nav-sections');
  const navBrandLinks = nav.querySelectorAll('.nav-brand a');

  if (navSections) {
    const navParagraphs = navSections.querySelectorAll('p');
    navParagraphs.forEach((navParagraph) => {
      const divider = document.createElement('div');
      divider.className = 'nav-divider';
      navSections.insertBefore(divider, navParagraph);

      if (navParagraph.textContent.trim() === 'Login') {
        const loginLink = document.createElement('a');
        loginLink.href = '';
        loginLink.textContent = 'Login';
        navParagraph.innerHTML = '';
        navParagraph.appendChild(loginLink);
        loginLink.addEventListener('click', handleLoginClick);
        loginLink.addEventListener('click', (e) => e.preventDefault());
      }
    });
  }

  if (navBrandLinks && navBrandLinks.length > 0) {
    const forHomeLink = Array.from(navBrandLinks).find((link) => link.innerHTML === 'For Home');
    if (forHomeLink) {
      const homeButtonBorder = document.createElement('div');
      homeButtonBorder.className = 'home-button-border';
      forHomeLink.parentNode.appendChild(homeButtonBorder);
    }
  }

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);

  buildMegaMenu();

  const homeSolutions = document.createElement('p');
  const homeSolutionsLink = document.createElement('a');
  homeSolutionsLink.textContent = 'Home Solutions';
  homeSolutions.appendChild(homeSolutionsLink);
  const headerWrapper = document.querySelector('.header-wrapper');
  headerWrapper.appendChild(homeSolutions);

  const megaMenu = document.querySelector('.mega-menu');
  let hideTimeout = null;

  homeSolutionsLink.addEventListener('mouseenter', () => {
    clearTimeout(hideTimeout);
    megaMenu.style.opacity = '1';
    homeSolutionsLink.style.color = '#FFF';
  });

  homeSolutionsLink.addEventListener('mouseleave', () => {
    hideTimeout = setTimeout(() => {
      megaMenu.style.opacity = '0';
      homeSolutionsLink.style.color = '#dedede';
    }, 500);
  });

  megaMenu.addEventListener('mouseenter', () => {
    clearTimeout(hideTimeout);
  });

  megaMenu.addEventListener('mouseleave', () => {
    megaMenu.style.opacity = '0';
    homeSolutionsLink.style.color = '#dedede';
  });
  createLoginModal();
  removeButtonContainerClass();
}

// MOBILE HEADER //

function handleMenuClick() {
  this.classList.toggle('change');

  const headerWrapper = document.querySelector('.header-wrapper');
  headerWrapper.classList.toggle('expanded');

  const optionsWrapper = document.querySelector('.options-wrapper');
  setTimeout(() => {
    optionsWrapper.classList.toggle('show');
  }, 100);

  // Select the first child of mega-menu and all div children of other-options
  const megaMenuFirstChild = document.querySelector('.mega-menu').firstElementChild;

  const otherOptionsChildren = Array.from(document.querySelector('.other-options').children);
  const navDivs = [megaMenuFirstChild].concat(otherOptionsChildren);
  let menuOptions = [];

  // Iterate over each div
  for (let i = 0; i < navDivs.length; i++) {
    let menuOption = {};
    let div = navDivs[i];

    // Find the h2 within this div and assign its innerHTML to the title of menuOption
    let h2 = div.querySelector('h2');
    if (h2) {
      menuOption.title = h2.innerHTML;

      // Find all a tags within this div
      let links = div.querySelectorAll('a');
      if (links.length > 0) {
        menuOption.subMenu = [];

        links.forEach((link) => {
          let submenuItem = {};
          // Clone the link element
          let cloneLink = link.cloneNode(true);
          submenuItem.name = cloneLink.textContent;
          submenuItem.url = cloneLink.href;

          createTags([cloneLink]);

          submenuItem.updatedLinkHTML = cloneLink.outerHTML;

          menuOption.subMenu.push(submenuItem);
        });
      }
      menuOptions.push(menuOption);
    } else {
      // If there is no h2 in the div, remove the div from the DOM
      div.parentNode.removeChild(div);
    }
  }

  let originalMenuHTML;

  function generateSubMenu(option) {
    return `<div class='sub-menu-title' data-option='${option.title}'>${option.title}</div>${option.subMenu.map((subMenuItem) => `<a href='${subMenuItem.url}'>${subMenuItem.updatedLinkHTML}</a>`).join('')}`;
  }

  const menuOptionsHTML = menuOptions.map((option) => `<div class='menu-option' data-option='${option.title}'>${option.title}</div>`).join('');

  originalMenuHTML = menuOptionsHTML;

  optionsWrapper.innerHTML = menuOptionsHTML;

  function handleMenuOptionClick() {
    const optionTitle = this.dataset.option;
    const selectedOption = menuOptions.find((opt) => opt.title === optionTitle);
    optionsWrapper.innerHTML = generateSubMenu(selectedOption);

    const subMenuTitle = document.querySelector('.sub-menu-title');
    if (subMenuTitle) {
      subMenuTitle.addEventListener('click', handleSubMenuTitleClick);
    }
  }

  function attachMenuOptionClickEvents() {
    document.querySelectorAll('.menu-option').forEach((menuOption) => {
      menuOption.addEventListener('click', handleMenuOptionClick);
    });
  }

  function handleSubMenuTitleClick() {
    optionsWrapper.innerHTML = originalMenuHTML;
    attachMenuOptionClickEvents();
  }

  attachMenuOptionClickEvents();
}

async function renderMobileHeader(nav) {
  const headerBlock = document.querySelector('.header.block');

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);

  const wrapperDiv = document.createElement('div');
  wrapperDiv.classList.add('menu-wrapper');
  wrapperDiv.addEventListener('click', handleMenuClick);

  // Create three span elements (bars)
  for (let i = 0; i < 3; i++) {
    const barSpan = document.createElement('span');
    barSpan.classList.add('menu-bar');
    wrapperDiv.appendChild(barSpan);
  }

  const optionsWrapper = document.createElement('div');
  optionsWrapper.className = 'options-wrapper';

  // Append nav (with the remaining first two divs) and optionsWrapper to headerBlock
  headerBlock.appendChild(nav);
  headerBlock.appendChild(wrapperDiv);
  headerBlock.appendChild(optionsWrapper);
}

export default async function decorate(block) {
  // fetch nav content
  const navPath = getMetadata('nav') || '/nav';
  const resp = await fetch(`${navPath}.plain.html`);

  if (resp.ok) {
    const html = await resp.text();

    const nav = document.createElement('nav');
    nav.id = 'nav';
    nav.innerHTML = html;

    const classes = ['brand', 'sections'];
    classes.forEach((c, i) => {
      const section = nav.children[i];
      if (section) section.classList.add(`nav-${c}`);
    });

    // decorate the navigation with the appropriate icons
    decorateIcons(nav);
    // decorateButtons(nav);

    const bitdefenderLogo = document.createElement('img');
    bitdefenderLogo.src = 'https://www.bitdefender.com/content/dam/bitdefender/splitter-homepage/black_company_logo.svg';
    bitdefenderLogo.alt = 'Bitdefender Logo';

    const logoLink = document.createElement('a');
    logoLink.href = 'https://www.bitdefender.com/';
    logoLink.appendChild(bitdefenderLogo);

    const headerWrapper = document.querySelector('.header-wrapper');
    headerWrapper.appendChild(logoLink);

    renderMobileHeader(nav);
    renderDesktopHeader(block, nav);
  }
}
