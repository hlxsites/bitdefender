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
export default async function decorate(block) {
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

    decorateIcons(nav);
    const navWrapper = document.createElement('div');
    navWrapper.className = 'nav-wrapper';
    navWrapper.append(nav);
    block.append(navWrapper);
  }
}

function handleLoginClick() {
  const loginParagraph = document.querySelector('.nav-sections p:last-child');
  const bottomBorder = document.querySelector('.login-button-border');
  const loginModal = document.querySelector('.login-modal');
  if (loginModal) {
    document.body.removeChild(loginModal);
    loginParagraph.removeChild(bottomBorder);
  } else {
    const bottomBorder = document.createElement('div');
    bottomBorder.className = 'login-button-border';
    loginParagraph.appendChild(bottomBorder);

    const loginModal = document.createElement('div');
    loginModal.className = 'login-modal';
    document.body.appendChild(loginModal);

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

    const bitdefenderCentral = document.createElement('a');
    bitdefenderCentral.innerHTML = 'Bitdefender Central';
    bitdefenderCentral.href = 'https://login.bitdefender.com/central/login.html';
    loginButtons.appendChild(bitdefenderCentral);

    const gravityZoneCloudControlCenter = document.createElement('a');
    gravityZoneCloudControlCenter.innerHTML = 'GravityZone Cloud Control Center';
    gravityZoneCloudControlCenter.href = 'https://gravityzone.bitdefender.com';
    loginButtons.appendChild(gravityZoneCloudControlCenter);

    const MDRPortal = document.createElement('a');
    MDRPortal.innerHTML = 'MDR Portal';
    MDRPortal.href = 'https://auth.mdr.bitdefender.com/';
    loginButtons.appendChild(MDRPortal);
  }
}
