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

async function renderDesktopHeader(block) {
  // fetch nav content
  const navPath = getMetadata('nav') || '/nav';
  const resp = await fetch(`${navPath}.plain.html`);

  if (resp.ok) {
    const html = await resp.text();

    // decorate nav DOM
    const nav = document.createElement('nav');
    nav.id = 'nav';
    nav.innerHTML = html;

    const classes = ['brand', 'sections', 'tools'];
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

        // Update "Login" nav section to match HTML structure
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
}

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

function handleMenuClick() {
  this.classList.toggle('change');

  const headerWrapper = document.querySelector('.header-wrapper');
  headerWrapper.classList.toggle('expanded');
}

function renderMobileHeader() {
  const bitdefenderLogo = document.createElement('img');
  bitdefenderLogo.src = 'https://www.bitdefender.com/content/dam/bitdefender/splitter-homepage/black_company_logo.svg';
  bitdefenderLogo.alt = 'Bitdefender Logo';

  const logoLink = document.createElement('a');
  logoLink.href = 'https://www.bitdefender.com/';
  logoLink.appendChild(bitdefenderLogo);

  const headerBlock = document.querySelector('.header.block');
  headerBlock.appendChild(logoLink);

  const wrapperDiv = document.createElement('div');
  wrapperDiv.classList.add('menu-wrapper');
  wrapperDiv.addEventListener('click', handleMenuClick);

  // Create three span elements (bars)
  for (let i = 0; i < 3; i++) {
    const barSpan = document.createElement('span');
    barSpan.classList.add('menu-bar');
    wrapperDiv.appendChild(barSpan);
  }
  headerBlock.appendChild(wrapperDiv);
}

export default async function decorate(block) {
  const mediaQuery = window.matchMedia('(max-width: 1000px)');
  if (mediaQuery.matches) {
    renderMobileHeader();
  } else {
    renderDesktopHeader(block);
  }
}
