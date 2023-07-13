/* eslint-disable no-plusplus */
/* eslint-disable no-use-before-define */
/* eslint-disable prefer-const */
/* eslint-disable no-shadow */
import { getMetadata, decorateIcons } from '../../scripts/lib-franklin.js';
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

function createLoginButton(text, href) {
  const aTag = document.createElement('a');
  aTag.href = href;

  const pTag = document.createElement('p');
  pTag.textContent = text;
  aTag.appendChild(pTag);

  const imgTag = document.createElement('img');
  imgTag.src = '../../icons/arrow-right.svg';
  imgTag.alt = 'Arrow Right';
  aTag.appendChild(imgTag);

  return aTag;
}

function handleLoginClick() {
  const loginParagraph = document.querySelector('.nav-sections p:last-child');
  const bottomBorder = document.querySelector('.login-button-border');
  const loginModal = document.querySelector('.login-modal');

  if (loginModal) {
    loginModal.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(loginModal);
      loginParagraph.removeChild(bottomBorder);
    }, 300);
  } else {
    const bottomBorder = document.createElement('div');
    bottomBorder.className = 'login-button-border';
    loginParagraph.appendChild(bottomBorder);

    const loginModal = document.createElement('div');
    loginModal.className = 'login-modal';
    document.body.appendChild(loginModal);
    setTimeout(() => loginModal.classList.add('show'), 0);

    const triangle = document.createElement('div');
    triangle.className = 'triangle';
    loginModal.appendChild(triangle);

    const yourAccount = document.createElement('span');
    yourAccount.className = 'your-account';
    yourAccount.textContent = 'Your Account';
    loginModal.appendChild(yourAccount);

    const divider = document.createElement('div');
    divider.className = 'divider';
    loginModal.appendChild(divider);

    const loginButtons = document.createElement('div');
    loginButtons.className = 'login-buttons';
    loginModal.appendChild(loginButtons);

    const bitdefenderCentral = createLoginButton(
      'Bitdefender Central',
      'https://login.bitdefender.com/central/login.html',
    );
    loginButtons.appendChild(bitdefenderCentral);

    const gravityZoneCloudControlCenter = createLoginButton(
      'GravityZone CLOUD Control Center',
      'https://gravityzone.bitdefender.com',
    );
    loginButtons.appendChild(gravityZoneCloudControlCenter);

    const MDRPortal = createLoginButton(
      'MDR Portal',
      'https://auth.mdr.bitdefender.com/',
    );
    loginButtons.appendChild(MDRPortal);
  }
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

function createTags() {
  let links = document.querySelectorAll('p > a');

  links.forEach((link) => {
    if (link.textContent.includes('(new)')) {
      link.textContent = link.textContent.replace('(new)', '');
      let span = document.createElement('span');
      span.textContent = 'NEW';
      link.appendChild(span);
    } else if (link.textContent.includes('(evolved)')) {
      link.textContent = link.textContent.replace('(evolved)', '');
      let span = document.createElement('span');
      span.textContent = 'EVOLVED';
      span.style.backgroundColor = '#14b0a7';
      link.appendChild(span);
    }
  });
}

function wrapDivsInMegaMenu() {
  console.log('wrapDivsInMegaMenu');
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
}

function buildMegaMenu() {
  wrapDivsInMegaMenu();
  appendUlToP();
  createTags();
}

async function renderDesktopHeader(block) {
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

    decorateIcons(nav);
    const navWrapper = document.createElement('div');
    navWrapper.className = 'nav-wrapper';
    navWrapper.append(nav);
    block.append(navWrapper);
  }
  buildMegaMenu();

  const homeSolutions = document.createElement('p');
  const homeSolutionsLink = document.createElement('a');
  homeSolutionsLink.href = '';
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

  // Find all the direct div children of the nav element
  const navDivs = document.querySelectorAll('#nav > div');
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

          if (submenuItem.name.includes('(new)')) {
            submenuItem.name = submenuItem.name.replace('(new)', '');
            let span = document.createElement('span');
            span.textContent = 'NEW';
            cloneLink.textContent = submenuItem.name;
            cloneLink.appendChild(span);
          } else if (submenuItem.name.includes('(evolved)')) {
            submenuItem.name = submenuItem.name.replace('(evolved)', '');
            let span = document.createElement('span');
            span.textContent = 'EVOLVED';
            span.style.backgroundColor = '#14b0a7';
            cloneLink.textContent = submenuItem.name;
            cloneLink.appendChild(span);
          }

          submenuItem.updatedLinkHTML = cloneLink.innerHTML;

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
    return `<div class='sub-menu-title' data-option='${option.title}'>${option.title}</div>${
      option.subMenu.map((subMenuItem) => `<a href='${subMenuItem.url}'>${subMenuItem.updatedLinkHTML}</a>`).join('')}`;
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

async function renderMobileHeader() {
  const headerBlock = document.querySelector('.header.block');

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
}

export default async function decorate(block) {
  const bitdefenderLogo = document.createElement('img');
  bitdefenderLogo.src = 'https://www.bitdefender.com/content/dam/bitdefender/splitter-homepage/black_company_logo.svg';
  bitdefenderLogo.alt = 'Bitdefender Logo';

  const logoLink = document.createElement('a');
  logoLink.href = 'https://www.bitdefender.com/';
  logoLink.appendChild(bitdefenderLogo);

  const headerWrapper = document.querySelector('.header-wrapper');
  headerWrapper.appendChild(logoLink);

  const mediaQuery = window.matchMedia('(max-width: 1000px)');

  function checkMediaQuery() {
    if (mediaQuery.matches) {
      // eslint-disable-next-line no-restricted-globals
      location.reload();
    }
  }

  mediaQuery.addEventListener('change', checkMediaQuery);

  if (mediaQuery.matches) {
    renderMobileHeader();
  } else {
    renderDesktopHeader(block);
  }
}
