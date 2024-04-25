import {
  getMetadata, decorateIcons, decorateButtons, decorateTags,
} from '../../scripts/lib-franklin.js';

import { adobeMcAppendVisitorId } from '../../scripts/utils/utils.js';

import { decorateBlockWithRegionId, decorateLinkWithLinkTrackingId, getDomain } from '../../scripts/scripts.js';

function createLoginModal() {
  const loginModal = document.querySelector('nav > div:nth-child(4)');
  loginModal.classList.add('login-modal');

  const triangle = document.createElement('div');
  triangle.className = 'triangle';
  loginModal.appendChild(triangle);

  const divider = document.createElement('div');
  divider.className = 'divider';
  loginModal.appendChild(divider);
}

function handleLoginClick() {
  const loginModal = document.querySelector('.login-modal');
  if (loginModal.classList.contains('show')) {
    loginModal.classList.remove('show');
  } else {
    loginModal.style.display = 'flex';
    setTimeout(() => {
      loginModal.classList.add('show');
    }, 0); // Small delay to ensure that the modal is rendered before adding the transition
  }

  const loginButton = document.querySelector('.nav-sections p:last-child');
  loginButton.classList.toggle('clicked');
}

function appendUlToP() {
  const divs = document.querySelectorAll('.mega-menu-websites > div');

  divs.forEach((div) => {
    const uls = div.querySelectorAll('ul');
    uls.forEach((ul) => {
      const p = ul.previousElementSibling;

      const span = document.createElement('div');

      Array.from(ul.children).forEach((li) => {
        span.textContent += ` ${li.textContent}`;
        span.textContent = span.textContent.slice(1);
      });

      p.appendChild(span);

      ul.remove();
    });
  });
}

function wrapDivsInMegaMenu() {
  const nav = document.getElementById('nav');
  const divs = Array.from(nav.children).filter((node) => node.tagName.toLowerCase() === 'div');
  const navSectionsIndex = divs.findIndex((div) => div.classList.contains('nav-sections'));
  const megaMenuDiv = document.createElement('div');
  megaMenuDiv.className = 'mega-menu-websites';
  decorateBlockWithRegionId(megaMenuDiv, 'Main Menu|Home Solutions');

  const otherOptionsDiv = document.createElement('div');
  otherOptionsDiv.className = 'other-options';

  const bottomLinks = document.createElement('div');
  bottomLinks.className = 'bottom-links';

  megaMenuDiv.appendChild(divs[navSectionsIndex + 1].cloneNode(true));
  nav.removeChild(divs[navSectionsIndex + 1]);

  for (let i = navSectionsIndex + 2; i < 8; i += 1) {
    otherOptionsDiv.appendChild(divs[i].cloneNode(true));
    nav.removeChild(divs[i]);
  }

  for (let i = 8; i < divs.length; i += 1) {
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

  const loginModal = document.querySelector('.mega-menu-websites > div:first-child');
  nav.appendChild(loginModal);
}

function addDescriptionToHref() {
  const descriptions = document.querySelectorAll('header .button-container > div');

  descriptions.forEach((description) => {
    const a = description.parentNode.querySelector('a');
    a.appendChild(description);
  }, this);
}

function removeButtonClasses() {
  const bottomLinks = document.querySelector('.bottom-links');
  const bottomLinksParagraphs = bottomLinks.querySelectorAll('p');
  const bottomLinksSpans = bottomLinks.querySelectorAll('span');
  const bottomLinksLinks = bottomLinks.querySelectorAll('a');

  bottomLinksParagraphs.forEach((paragraph) => {
    paragraph.classList.remove('button-container');
  });

  bottomLinksSpans.forEach((span) => {
    span.classList.remove('button-text');
  });

  bottomLinksLinks.forEach((link) => {
    link.classList.remove('button');
  });
}

function buildMegaMenu() {
  wrapDivsInMegaMenu();
  appendUlToP();
  removeButtonClasses();
  addDescriptionToHref();
}

function renderDesktopHeader(block, nav) {
  const navSections = nav.querySelector('.nav-sections');
  const navBrand = nav.querySelector('.nav-brand');
  const navBrandLinks = nav.querySelectorAll('.nav-brand a');

  if (navSections) {
    decorateBlockWithRegionId(navSections, 'Main Menu|General Links');
    const loginLink = document.querySelector('.nav-sections p:last-child');
    loginLink.addEventListener('click', (e) => {
      e.preventDefault();
      handleLoginClick();
    });
  }

  if (navBrand && navBrandLinks && navBrandLinks.length > 0) {
    decorateBlockWithRegionId(navBrand, 'Main Menu|Brands');
    const forHomeLink = Array.from(navBrandLinks)[0];
    if (forHomeLink) {
      forHomeLink.classList.add('active');
    }
  }

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);

  buildMegaMenu();

  const homeSolutions = document.createElement('p');
  const homeSolutionText = document.querySelector('.bottom-links > div:last-child > p');
  homeSolutions.innerHTML = homeSolutionText.innerHTML;
  homeSolutions.classList.add('home-solutions-link-default');
  const headerWrapper = document.querySelector('.header-wrapper');
  headerWrapper.appendChild(homeSolutions);

  const bottomLinks = document.querySelector('.bottom-links');
  bottomLinks.removeChild(bottomLinks.lastElementChild);

  const megaMenu = document.querySelector('.mega-menu-websites');
  let isOverHomeSolutions = false;
  let isOverMegaMenu = false;

  const showMegaMenu = () => {
    megaMenu.style.display = 'flex';
    setTimeout(() => {
      megaMenu.classList.add('mega-menu-websites-show');
    }, 10);
  };

  const hideMegaMenu = () => {
    if (!isOverHomeSolutions && !isOverMegaMenu) {
      megaMenu.classList.remove('mega-menu-websites-show');
      homeSolutions.classList.remove('home-solutions-link-hover');
    }
  };

  homeSolutions.addEventListener('mouseenter', () => {
    isOverHomeSolutions = true;
    showMegaMenu();
    homeSolutions.classList.add('home-solutions-link-hover');
  });

  homeSolutions.addEventListener('mouseleave', () => {
    isOverHomeSolutions = false;
    setTimeout(hideMegaMenu, 0); // avoid menu to close when moving mouse to menu.
  });

  megaMenu.addEventListener('mouseenter', () => {
    isOverMegaMenu = true;
  });

  megaMenu.addEventListener('mouseleave', () => {
    isOverMegaMenu = false;
    hideMegaMenu();
    homeSolutions.classList.remove('home-solutions-link-hover');
  });

  createLoginModal();
}

// MOBILE HEADER //

function handleMenuClick() {
  this.classList.toggle('change');

  const headerWrapper = document.querySelector('.header-wrapper');
  headerWrapper.classList.toggle('expanded');
  document.body.classList.toggle('no-scroll');

  let hasToggled = false;

  const optionsWrapper = document.querySelector('.options-wrapper');
  setTimeout(() => {
    optionsWrapper.classList.toggle('show');
  }, 100);

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1000 && !hasToggled && headerWrapper.classList.contains('expanded')) {
      headerWrapper.classList.toggle('expanded');
      this.classList.toggle('change');
      optionsWrapper.classList.toggle('show');
      hasToggled = true;
    } else if (window.innerWidth <= 1000) {
      hasToggled = false;
    }
  });

  // Select the first child of mega-menu and all div children of other-options
  const megaMenuFirstChild = document.querySelector('.mega-menu-websites').firstElementChild;

  const otherOptionsChildren = Array.from(document.querySelector('.other-options').children);
  const navDivs = [megaMenuFirstChild].concat(otherOptionsChildren);
  const menuOptions = [];

  // Iterate over each div
  for (let i = 0; i < navDivs.length; i += 1) {
    const menuOption = {};
    const div = navDivs[i];

    // Find the h2 within this div and assign its innerHTML to the title of menuOption
    const h2 = div.querySelector('h2');
    if (h2) {
      menuOption.title = h2.childNodes[0].textContent.trim();

      // find all links that are not children of h2
      const links = div.querySelectorAll('a:not(h2 a)');

      // Find all a tags within this div
      if (links.length > 0) {
        menuOption.subMenu = [];

        links.forEach((link) => {
          const submenuItem = {};
          // Clone the link element
          const cloneLink = link.cloneNode(true);
          submenuItem.name = cloneLink.textContent;
          submenuItem.url = cloneLink.href;

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

  // eslint-disable-next-line prefer-const
  originalMenuHTML = menuOptionsHTML;

  optionsWrapper.innerHTML = menuOptionsHTML;

  function handleMenuOptionClick() {
    const optionTitle = this.dataset.option;
    const selectedOption = menuOptions.find((opt) => opt.title === optionTitle);
    optionsWrapper.innerHTML = generateSubMenu(selectedOption);

    const subMenuTitle = document.querySelector('.sub-menu-title');
    if (subMenuTitle) {
      // eslint-disable-next-line no-use-before-define
      subMenuTitle.addEventListener('click', handleSubMenuTitleClick);
    }
    const optionWrapperShow = document.querySelector('.options-wrapper.show');
    optionWrapperShow.style.height = 'auto';

    const optionWrapperShowDivs = optionWrapperShow.querySelectorAll('div:not(.sub-menu-title)');

    optionWrapperShowDivs.forEach((div) => {
      div.parentNode.removeChild(div);
    });
  }

  function attachMenuOptionClickEvents() {
    document.querySelectorAll('.menu-option').forEach((menuOption) => {
      menuOption.addEventListener('click', handleMenuOptionClick);
    });
    const optionWrapperShow = document.querySelector('.options-wrapper.show');
    if (optionWrapperShow) {
      optionWrapperShow.style.height = '100vh';
    }
  }

  function handleSubMenuTitleClick() {
    optionsWrapper.innerHTML = originalMenuHTML;
    attachMenuOptionClickEvents();
  }

  attachMenuOptionClickEvents();
}

function renderMobileHeader(nav) {
  const headerBlock = document.querySelector('.header.block');

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);

  const wrapperDiv = document.createElement('div');
  wrapperDiv.classList.add('menu-wrapper');
  wrapperDiv.addEventListener('click', handleMenuClick);

  // Create three span elements (bars)
  for (let i = 0; i < 3; i += 1) {
    const barSpan = document.createElement('span');
    barSpan.classList.add('menu-bar');
    wrapperDiv.appendChild(barSpan);
  }

  const optionsWrapper = document.createElement('div');
  optionsWrapper.className = 'options-wrapper';

  headerBlock.appendChild(nav);
  headerBlock.appendChild(wrapperDiv);
  headerBlock.appendChild(optionsWrapper);
}

async function runDefaultHeaderLogic(block) {
  const hero = document.querySelector('.hero');

  if (hero && hero.classList.contains('black-background')) {
    const header = document.querySelector('header');
    header.classList.add('black-background');
  }

  const headerBlock = document.querySelector('.header.block');
  headerBlock.removeChild(headerBlock.firstElementChild);

  // fetch nav content
  const navPath = getMetadata('nav') || '/nav';
  const resp = await fetch(`${navPath}.plain.html`);

  if (resp.ok) {
    const html = await resp.text();

    if (html.includes('aem-banner')) {
      let domain = getDomain();
      if (domain === 'en-us') {
        domain = 'en';
      } else {
        domain = domain.split('-').join('_');
      }
      const aemHeaderFetch = await fetch(`https://www.bitdefender.com/content/experience-fragments/bitdefender/language_master/${domain}/header-navigation/mega-menu/master/jcr:content/root/mega_menu.styled.html`);
      if (!aemHeaderFetch.ok) {
        return;
      }
      const aemHeaderHtml = await aemHeaderFetch.text();

      const nav = document.createElement('div');
      const shadowRoot = nav.attachShadow({ mode: 'open' });

      const contentDiv = document.createElement('div');
      contentDiv.classList.add('mega-menu');
      contentDiv.innerHTML = aemHeaderHtml;
      shadowRoot.appendChild(contentDiv);

      const cssFile = shadowRoot.querySelector('link[rel="stylesheet"]');
      if (cssFile) {
        cssFile.href = '/_src/scripts/vendor/mega-menu/mega-menu.css';
      }

      const newScriptFile = document.createElement('script');
      newScriptFile.src = '/_src/scripts/vendor/mega-menu/mega-menu.js';

      const shadowRootScriptTag = shadowRoot.querySelector('script');
      if (shadowRootScriptTag) {
        shadowRootScriptTag.replaceWith(newScriptFile);
      }

      const navHeader = shadowRoot.querySelector('header');
      if (navHeader) {
        navHeader.style.height = 'auto';
      }

      const body = document.querySelector('body');
      body.style.maxWidth = 'initial';

      const header = document.querySelector('header');
      if (header) {
        header.remove();
      }

      document.querySelector('body').prepend(nav);
      adobeMcAppendVisitorId(shadowRoot);
      return;
    }

    const nav = document.createElement('nav');
    nav.id = 'nav';
    nav.innerHTML = html;

    const classes = ['brand', 'sections'];
    classes.forEach((c, i) => {
      const section = nav.children[i];
      if (section) section.classList.add(`nav-${c}`);
    });

    decorateButtons(nav);
    renderMobileHeader(nav);
    renderDesktopHeader(block, nav);
    decorateIcons(nav);
    decorateTags(nav);

    // Select the parent elements
    const bottomLinks = document.querySelector('.bottom-links');
    const header = document.querySelector('header');

    const thirdChild = bottomLinks.children[2];

    bottomLinks.removeChild(thirdChild);

    thirdChild.classList.add('logo');

    const container = document.createElement('div');
    container.classList.add('logo-container');
    decorateBlockWithRegionId(container, 'Main Menu|Logo Container');
    container.appendChild(thirdChild);

    if (header.querySelector('p.home-solutions-link-default')) {
      container.appendChild(header.querySelector('p.home-solutions-link-default'));
    }
    header.appendChild(container);
  }

  // assign an aria-label to the a tag inside of .logo
  const logoLink = document.querySelector('.logo a');
  logoLink.setAttribute('aria-label', 'Logo');
  decorateLinkWithLinkTrackingId(logoLink, 'Bitdefender Logo');

  const secondSpan = document.querySelector('.header-wrapper > div > p span:nth-child(2)');
  if (secondSpan) {
    secondSpan.parentNode.removeChild(secondSpan);
  }

  const header = document.getElementsByClassName('header-wrapper')[0];

  window.addEventListener('scroll', () => {
    if (window.innerWidth > 990) {
      if (window.scrollY > 0) {
        header.style.display = 'none';
        const loginModal = document.querySelector('nav > div:nth-child(4)');
        loginModal.classList.remove('show');
      } else {
        header.style.display = 'block';
      }
    }
  });
}

function runLandingPageHeaderLogic(block) {
  block.classList.add('default-content-wrapper');
  block.innerHTML = `
    <a href="https://bitdefender.com/"><span class="icon logo-white"><svg xmlns="http://www.w3.org/2000/svg" width="160" height="25" viewBox="0 0 762.506 117.679"><path fill="#FFF" d="M304.277 43.069c-20.436 0-35.322 14.24-35.322 35.527 0 21.277 15.645 35.507 38.267 35.507 6.607 0 12.793-1.149 18.056-3.345l9.644-16.076-1.282-.688c-8.29 4.339-17.009 6.576-24.889 6.576-11.665 0-21.749-5.93-22.888-16.066h51.583v-4.647c-.002-23.543-14.282-36.788-33.169-36.788zm-18.415 28.757c1.272-9.736 7.468-16.065 17.481-16.065 10.577 0 17.061 6.196 17.194 16.065h-34.675zm369.806-28.757c-20.457 0-35.332 14.24-35.332 35.527 0 21.277 15.655 35.507 38.276 35.507 6.597 0 12.782-1.149 18.035-3.345l9.654-16.076-1.272-.688c-8.289 4.339-17.02 6.576-24.909 6.576-11.654 0-21.729-5.93-22.867-16.066h51.572c2.247-26.507-12.003-41.435-33.157-41.435zm-18.415 28.757c1.251-9.736 7.469-16.065 17.461-16.065 10.577 0 17.071 6.196 17.204 16.065h-34.665zM419.319 43.069c-20.426 0-35.309 14.24-35.309 35.527 0 21.277 15.643 35.507 38.253 35.507 6.627 0 12.804-1.149 18.076-3.345l9.623-16.076-1.282-.688c-8.279 4.339-16.999 6.576-24.878 6.576-11.665 0-21.75-5.93-22.878-16.066h51.583c2.237-26.507-12.013-41.435-33.188-41.435zm-18.394 28.757c1.262-9.736 7.469-16.065 17.461-16.065 10.577 0 17.071 6.196 17.204 16.065h-34.665zM69.867 59.843v-.288C80.157 56.458 87.195 49 87.195 37.714c0-18.179-15.512-25.083-30.562-25.083H20.162v-.01H5.646v1.488l5.119 4.35c6.146 5.007 6.945 5.981 6.945 10.505v83.458h35.958c18.867 0 37.764-6.771 37.764-28.479 0-12.815-9.038-22.694-21.565-24.1zM35.479 27.855h14.65c9.91 0 12.978 1.364 15.983 4.216 2.278 2.165 3.324 5.14 3.334 8.607 0 3.221-1.108 6.104-3.458 8.341-2.934 2.811-6.956 4.196-14.312 4.196H35.479v-25.36zm16.343 69.341H35.479V68.44h17.05c14.373 0 21.144 3.662 21.144 14.096 0 13.111-12.7 14.66-21.851 14.66zm73.188-75.404c0 5.776-4.801 10.146-10.998 10.146-6.207 0-10.71-4.801-10.71-10.146 0-5.366 4.503-10.157 10.71-10.157 6.196.001 10.998 4.371 10.998 10.157zm-28.418 22.98h26.017v67.648h-16.928V59.197h-.01c0-5.601-.308-6.494-6.381-11.182l-2.698-2.134v-1.109zm134.64-35.085l5.293 3.417c4.832 3.067 5.561 4.544 5.561 8.843V53.36h-.421c-3.519-4.36-10.29-10.29-22.97-10.29-19.318 0-32.706 15.502-32.706 35.527 0 20.005 12.557 35.507 33.414 35.507 9.438 0 18.323-3.663 23.257-11.829h.277l1.774 10.146h14.291V8.445h-27.771v1.242zm-8.453 89.202c-12.403 0-19.882-9.726-19.882-20.292 0-10.577 7.479-20.303 19.882-20.303 12.414 0 19.882 9.726 19.882 20.303 0 10.567-7.469 20.292-19.882 20.292zm359.27-89.202l2.35 1.57c8.155 5.15 9.161 6.648 9.161 15.46V53.36h-.421c-3.539-4.36-10.3-10.29-22.97-10.29-19.318 0-32.706 15.502-32.706 35.527 0 20.005 12.547 35.507 33.394 35.507 9.448 0 18.333-3.663 23.257-11.829h.277l1.795 10.146h14.271V8.445H582.05v1.242zm-7.808 89.202c-12.393 0-19.871-9.726-19.871-20.292 0-10.577 7.479-20.303 19.871-20.303 12.403 0 19.872 9.726 19.872 20.303 0 10.567-7.468 20.292-19.872 20.292zm168.803-54.834v16.353c-2.821-.708-5.488-1.272-8.176-1.272-15.923 0-18.18 13.388-18.18 17.061v36.225h-16.906V62.429c0-8.515-.452-9.787-7.336-14.147l-4.236-2.801-.052-.749h28.53v10.752h.298c3.652-7.756 11.121-12.414 20.005-12.414 2.113-.001 4.083.43 6.053.985zm-375.551.43H383.2V58.92h-15.707v53.501h-16.979V64.757c0-5.673-1.139-6.915-7.869-12.239l-8.617-7.007v-1.026h16.486V32.144c0-18.363 11.972-30.008 37.894-24.837l3.919 14.321-.81.667c-13.54-5.324-24.024-1.929-24.024 9.9v12.29zm160.295 25.217v42.719h-16.917V74.78c0-7.458-1.888-16.486-13.736-16.486-11.132 0-15.502 8.177-15.502 17.194v36.933h-16.896V62.429c0-8.515-.462-9.787-7.346-14.147l-4.236-2.801v-.749h13.213v.041h14.425v10.3h.276c5.571-8.279 14.035-12.003 21.523-12.003 15.984-.001 25.196 10.946 25.196 26.632zM180.747 98.828l.554.349-8.392 13.449c-13.788 3.734-29.279-.246-29.279-22.354V59.135l-.021 3.714c0-4.36-.708-4.145-10.197-11.962l-6.135-5.304v-.811h16.425l6.176-19.605h10.731v19.605h18.086v14.363h-18.086V89.8c0 12.218 8.35 12.495 20.138 9.028zM750.995 6.414c1.426.595 2.667 1.426 3.724 2.488 1.047 1.067 1.878 2.308 2.473 3.739.605 1.437.903 2.975.903 4.612 0 1.662-.298 3.206-.903 4.622-.595 1.426-1.426 2.662-2.473 3.713-1.057 1.052-2.298 1.878-3.724 2.473-1.437.6-2.985.903-4.647.903s-3.211-.303-4.637-.903c-1.427-.595-2.678-1.421-3.725-2.473-1.057-1.051-1.877-2.288-2.482-3.713-.595-1.416-.893-2.96-.893-4.622 0-1.637.298-3.175.893-4.612.605-1.431 1.426-2.672 2.482-3.739 1.047-1.062 2.298-1.893 3.725-2.488 1.426-.6 2.975-.903 4.637-.903s3.211.303 4.647.903zm-8.607 1.565c-1.211.523-2.257 1.236-3.14 2.139-.882.908-1.579 1.97-2.072 3.185-.492 1.226-.738 2.539-.738 3.95 0 1.41.246 2.724.738 3.944.493 1.226 1.19 2.288 2.072 3.186.883.913 1.929 1.626 3.14 2.154 1.211.523 2.534.785 3.96.785 1.405 0 2.719-.262 3.939-.785 1.2-.528 2.247-1.241 3.14-2.154.882-.897 1.569-1.959 2.072-3.186.513-1.221.77-2.534.77-3.944 0-1.411-.257-2.724-.77-3.95-.503-1.215-1.19-2.277-2.072-3.185-.893-.903-1.939-1.616-3.14-2.139-1.221-.533-2.534-.795-3.939-.795-1.426 0-2.749.261-3.96.795zm-.298 16.06V10.466h5.202c1.549 0 2.656.318 3.364.964.708.641 1.057 1.575 1.057 2.791 0 .59-.092 1.108-.267 1.549-.174.441-.421.815-.738 1.123-.318.303-.677.544-1.088.724-.42.174-.852.313-1.313.39l4.042 6.032h-1.96l-3.816-6.032h-2.811v6.032h-1.672zm5.376-7.499c.492-.031.944-.118 1.313-.267.379-.149.688-.385.923-.708.226-.328.339-.769.339-1.344 0-.482-.093-.872-.267-1.165-.175-.297-.421-.533-.718-.713-.309-.174-.646-.303-1.037-.359-.379-.066-.779-.097-1.189-.097h-3.067v4.704h2.205c.503 0 1.006-.015 1.498-.051z"></path></svg></span></a>
  `;
}

/**
 * applies header factory based on header variation
 * @param {String} headerMetadata The header variation: landingpage' or none
 * @param {Element} header The header element
 */
function applyHeaderFactorySetup(headerMetadata, header) {
  switch (headerMetadata) {
    case 'landingpage':
      runLandingPageHeaderLogic(header);
      break;
    default:
      runDefaultHeaderLogic(header);
      break;
  }
}

export default async function decorate(block) {
  const headerMetadata = getMetadata('header-type');
  block.parentNode.classList.add(headerMetadata || 'default');

  applyHeaderFactorySetup(headerMetadata, block);
}
