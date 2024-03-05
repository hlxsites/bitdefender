import {
  getMetadata, decorateIcons, decorateButtons, decorateTags,
} from '../../scripts/lib-franklin.js';

import { decorateBlockWithRegionId, decorateLinkWithLinkTrackingId } from '../../scripts/scripts.js';

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

export default async function decorate(block) {
  const hero = document.querySelector('.hero');
  const isErrorPage = window.isErrorPage || false;

  // Check if the page isn't an error page and if the hero doesn't exist
  // if (!hero && !isErrorPage) return;

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
      // const aemHeaderFetch = await fetch('https://www.bitdefender.com/content/experience-fragments/bitdefender/language_master/en/header-navigation/mega-menu/master/jcr:content/root/mega_menu.styled.html');
      // const aemHeaderHtml = await aemHeaderFetch.text();

      const aemHeaderHtml = `
        

    
<link rel="stylesheet" href="/etc.clientlibs/bitdefender/clientlibs/clientlib-megamenu.lc-c38d5ed305f314402e05b99e8ea68485-lc.min.css" type="text/css">





    
<script src="/etc.clientlibs/bitdefender/clientlibs/clientlib-megamenu.lc-b2fb86f86118ebc8359382ef204f2b35-lc.min.js"></script>




<header class="mega-menu__container mega-menu--no-active">
    <div class="we-container mega-menu__content">
        
        <div id="Main Menu">
            <!-- using onclick forced by Adobe way of analytics implementation -->
            <a class="mega-menu__logo" onclick="s_objectID='Bitdefender Logo';" href="/">
                

<div data-cmp-src="/adobe/dynamicmedia/deliver/dm-aid--ff62d212-3a6d-4993-841c-7458d12cdf2f/bitdefender-blue-logo-png.png?preferwebp=true&amp;quality=85&amp;width={width}" id="image-ee6d8b255f" data-cmp-data-layer="{&#34;image-ee6d8b255f&#34;:{&#34;@type&#34;:&#34;core/wcm/components/image/v3/image&#34;,&#34;repo:modifyDate&#34;:&#34;2024-02-07T11:09:21Z&#34;,&#34;image&#34;:{&#34;repo:id&#34;:&#34;ff62d212-3a6d-4993-841c-7458d12cdf2f&#34;,&#34;repo:modifyDate&#34;:&#34;2023-12-13T15:35:53Z&#34;,&#34;@type&#34;:&#34;image/png&#34;,&#34;repo:path&#34;:&#34;/content/dam/bitdefender/bitdefender-blue-logo-png.png&#34;,&#34;xdm:tags&#34;:[&#34;properties:orientation/landscape&#34;]}}}" data-cmp-hook-image="imageV3" class="cmp-image" itemscope itemtype="http://schema.org/ImageObject">
    
        <img src="/adobe/dynamicmedia/deliver/dm-aid--ff62d212-3a6d-4993-841c-7458d12cdf2f/bitdefender-blue-logo-png.png?preferwebp=true&quality=85" srcset="/adobe/dynamicmedia/deliver/dm-aid--ff62d212-3a6d-4993-841c-7458d12cdf2f/bitdefender-blue-logo-png.png?preferwebp=true&amp;quality=85&amp;width=320 320w,/adobe/dynamicmedia/deliver/dm-aid--ff62d212-3a6d-4993-841c-7458d12cdf2f/bitdefender-blue-logo-png.png?preferwebp=true&amp;quality=85&amp;width=360 360w,/adobe/dynamicmedia/deliver/dm-aid--ff62d212-3a6d-4993-841c-7458d12cdf2f/bitdefender-blue-logo-png.png?preferwebp=true&amp;quality=85&amp;width=420 420w,/adobe/dynamicmedia/deliver/dm-aid--ff62d212-3a6d-4993-841c-7458d12cdf2f/bitdefender-blue-logo-png.png?preferwebp=true&amp;quality=85&amp;width=768 768w,/adobe/dynamicmedia/deliver/dm-aid--ff62d212-3a6d-4993-841c-7458d12cdf2f/bitdefender-blue-logo-png.png?preferwebp=true&amp;quality=85&amp;width=1024 1024w,/adobe/dynamicmedia/deliver/dm-aid--ff62d212-3a6d-4993-841c-7458d12cdf2f/bitdefender-blue-logo-png.png?preferwebp=true&amp;quality=85&amp;width=1300 1300w,/adobe/dynamicmedia/deliver/dm-aid--ff62d212-3a6d-4993-841c-7458d12cdf2f/bitdefender-blue-logo-png.png?preferwebp=true&amp;quality=85&amp;width=1920 1920w" loading="lazy" class="cmp-image__image" itemprop="contentUrl" width="190" height="28" alt="Bitdefender Cybersecurity"/>
    
    
    
</div>

    


            </a>
        </div>

        
        <div class="mega-menu__button-wrap">
            <div class="mega-menu__button">
                <span class="mega-menu__button-bar"></span>
                <span class="mega-menu__button-bar"></span>
                <span class="mega-menu__button-bar"></span>
            </div>
        </div>

        
        <div id="Main Menu" class="mega-menu__left-container">
            <nav aria-label="primary" class="mega-menu__left">
                <ul class="mega-menu__first-level">
                    
                        
                        <li class="mega-menu__item  ">
                            
                            <!-- using onclick forced by Adobe way of analytics implementation -->
                            <a onclick="s_objectID='For Home';" href="/solutions.html" class="mega-menu__link">
                                <span class="mega-menu__link-text">For Home</span>
                            </a>

                            
                            <div id="Main Menu|For Home" class="mega-menu__second-level element-0">
                                <div class="we-container mega-menu__second-level-content">
                                    <div class="mega-menu__back-button"></div>
                                    <ul class="mega-menu__list">

                                        <li class="mega-menu__l2-item ">
                                            
                                            <!-- using onclick forced by Adobe way of analytics implementation -->
                                            <a class="mega-menu__l2-link">
                                                <span class="mega-menu__l2-link-text">All-in-one plans</span>
                                            </a>

                                            
                                            <div id="Main Menu|For Home|All-in-One Plans" class="mega-menu__third-level element-0-0 container">
                                                <div class="we-container mega-menu__third-level-content">
                                                    <div class="mega-menu__back-button-l2"></div>
                                                    
                                                    

                                                    <div class="mega-menu__row">
                                                        <div class="mega-menu__col">

                                                            
                                                            

    
    
    
    <div id="container-67f0f87042" class="cmp-container">
        
        <div class="navigation"><div class="navigation__container ">

    <div class="navigation__heading">
        
        <div class="navigation__header-link"><span class="navigation__header-text">All-in-One Plans</span></div>
        
    </div>

    <div id="All-in-One Plans" class="navigation__links">
        <ul class="navigation__list">
            
                <li class="navigation__item link-0">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Ultimate Security';" href="/solutions/ultimate-security.html" class="navigation__link">
                        Ultimate Security
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-1">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Premium Security';" href="/solutions/premium-security.html" class="navigation__link">
                        Premium Security
                    </a>
                    
                </li>
            
        </ul>
        
    </div>
</div>
</div>

        
    </div>


                                                        </div>
                                                    
                                                        <div class="mega-menu__col">

                                                            
                                                            

    
    
    
    <div id="container-cfc149f0f4" class="cmp-container">
        
        <div class="navigation"><div class="navigation__container ">

    <div class="navigation__heading">
        
        <div class="navigation__header-link"><span class="navigation__header-text">Device Security</span></div>
        
    </div>

    <div id="Device Security" class="navigation__links">
        <ul class="navigation__list">
            
                <li class="navigation__item link-0">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Total Security';" href="/solutions/total-security.html" class="navigation__link">
                        Total Security
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-1">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Internet Security';" href="/solutions/internet-security.html" class="navigation__link">
                        Internet Security
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-2">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Antivirus Plus';" href="/solutions/antivirus.html" class="navigation__link">
                        Antivirus Plus
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-3">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Antivirus for Mac';" href="/solutions/antivirus-for-mac.html" class="navigation__link">
                        Antivirus for Mac
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-4">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Mobile Security for Android';" href="/solutions/mobile-security-android.html" class="navigation__link">
                        Mobile Security for Android
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-5">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Mobile Security for iOS';" href="/solutions/mobile-security-ios.html" class="navigation__link">
                        Mobile Security for iOS
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-6">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Family Pack';" href="/solutions/family-pack.html" class="navigation__link">
                        Family Pack
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-7">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Small Office Security';" href="/solutions/small-office-security.html" class="navigation__link">
                        Small Office Security
                    </a>
                    
                </li>
            
        </ul>
        <div class="navigation__view-all">
            View All
        </div>
    </div>
</div>
</div>
<div class="navigation"><div class="navigation__container ">

    <div class="navigation__heading">
        <a onclick="s_objectID='Compare';" href="/solutions/antivirus-comparison.html" class="navigation__header-link">
           <span class="navigation__header-text">
            Compare
           </span>
        </a>
        
        
    </div>

    <div id="Compare" class="navigation__links">
        
        
    </div>
</div>
</div>

        
    </div>


                                                        </div>
                                                    
                                                        <div class="mega-menu__col">

                                                            
                                                            

    
    
    
    <div id="container-e4ac1d34e9" class="cmp-container">
        
        <div class="navigation"><div class="navigation__container ">

    <div class="navigation__heading">
        
        <div class="navigation__header-link"><span class="navigation__header-text">Try Bitdefender</span></div>
        
    </div>

    <div id="Try Bitdefender" class="navigation__links">
        <ul class="navigation__list">
            
                <li class="navigation__item link-0">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Scamio - Scam Detector';" href="/solutions/scamio.html" class="navigation__link">
                        Scamio - Scam Detector
                    </a>
                    <em class="navigation__tag">AI Powered</em>
                </li>
            
        
            
                <li class="navigation__item link-1">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Antivirus Free';" href="/solutions/free.html" class="navigation__link">
                        Antivirus Free
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-2">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Antivirus Free for Android';" href="/solutions/antivirus-free-for-android.html" class="navigation__link">
                        Antivirus Free for Android
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-3">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Trial Downloads';" href="/Downloads.html" class="navigation__link">
                        Trial Downloads
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-4">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Free Tools';" href="/toolbox.html" class="navigation__link">
                        Free Tools
                    </a>
                    
                </li>
            
        </ul>
        <div class="navigation__view-all">
            View All
        </div>
    </div>
</div>
</div>

        
    </div>


                                                        </div>
                                                    
                                                        <div class="mega-menu__col">

                                                            
                                                            

    
    
    
    <div id="container-2977b45f72" class="cmp-container">
        
        <div class="navigation"><div class="navigation__container ">

    <div class="navigation__heading">
        
        <div class="navigation__header-link"><span class="navigation__header-text">Existing Customers</span></div>
        
    </div>

    <div id="Existing Customers" class="navigation__links">
        <ul class="navigation__list">
            
                <li class="navigation__item link-0">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Renew';" href="/renewal.html" class="navigation__link">
                        Renew
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-1">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Support';" href="https://www.bitdefender.com/consumer/support/" class="navigation__link">
                        Support
                    </a>
                    
                </li>
            
        </ul>
        
    </div>
</div>
</div>
<div class="navigation"><div class="navigation__container ">

    <div class="navigation__heading">
        
        <div class="navigation__header-link"><span class="navigation__header-text">Quick Links</span></div>
        
    </div>

    <div id="Quick Links" class="navigation__links">
        <ul class="navigation__list">
            
                <li class="navigation__item link-0">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Join Our Community';" href="https://community.bitdefender.com/en/" class="navigation__link">
                        Join Our Community
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-1">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Smart Home Cybersecurity';" href="/smart-home.html" class="navigation__link">
                        Smart Home Cybersecurity
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-2">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Cyberpedia';" href="https://www.bitdefender.com/cyberpedia/" class="navigation__link">
                        Cyberpedia
                    </a>
                    
                </li>
            
        </ul>
        
    </div>
</div>
</div>

        
    </div>


                                                        </div>
                                                    </div>

                                                    

                                                    <div class="mega-menu__quick-links-mobile"></div>
                                                </div>
                                            </div>
                                        </li>
                                    

                                        <li class="mega-menu__l2-item ">
                                            
                                            <!-- using onclick forced by Adobe way of analytics implementation -->
                                            <a class="mega-menu__l2-link">
                                                <span class="mega-menu__l2-link-text">Privacy &amp; Identity Protection</span>
                                            </a>

                                            
                                            <div id="Main Menu|For Home|Privacy &amp; Identity Protection" class="mega-menu__third-level element-0-1 container">
                                                <div class="we-container mega-menu__third-level-content">
                                                    <div class="mega-menu__back-button-l2"></div>
                                                    
                                                    

                                                    <div class="mega-menu__row">
                                                        <div class="mega-menu__col">

                                                            
                                                            

    
    
    
    <div id="container-55c31ac853" class="cmp-container">
        
        <div class="navigation"><div class="navigation__container ">

    <div class="navigation__heading">
        
        <div class="navigation__header-link"><span class="navigation__header-text">Privacy</span></div>
        
    </div>

    <div id="Privacy" class="navigation__links">
        <ul class="navigation__list">
            
                <li class="navigation__item link-0">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Premium VPN';" href="/solutions/vpn.html" class="navigation__link">
                        Premium VPN
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-1">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Password Manager';" href="/solutions/password-manager.html" class="navigation__link">
                        Password Manager
                    </a>
                    
                </li>
            
        </ul>
        
    </div>
</div>
</div>

        
    </div>


                                                        </div>
                                                    
                                                        <div class="mega-menu__col">

                                                            
                                                            

    
    
    
    <div id="container-a6a310c113" class="cmp-container">
        
        <div class="navigation"><div class="navigation__container ">

    <div class="navigation__heading">
        
        <div class="navigation__header-link"><span class="navigation__header-text">Identity Protection</span></div>
        
    </div>

    <div id="Identity Protection" class="navigation__links">
        <ul class="navigation__list">
            
                <li class="navigation__item link-0">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Digital Identity Protection';" href="/solutions/digital-identity-protection.html" class="navigation__link">
                        Digital Identity Protection
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-1">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Identity Theft Protection';" href="/solutions/identity-theft-protection.html" class="navigation__link">
                        Identity Theft Protection
                    </a>
                    
                </li>
            
        </ul>
        
    </div>
</div>
</div>

        
    </div>


                                                        </div>
                                                    
                                                        
                                                    
                                                        
                                                    </div>

                                                    

                                                    <div class="mega-menu__quick-links-mobile"></div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>

                                    
                                    
                                </div>
                            </div>
                        </li>
                    
                        
                        <li class="mega-menu__item  ">
                            
                            <!-- using onclick forced by Adobe way of analytics implementation -->
                            <a onclick="s_objectID='For Business';" href="/business.html" class="mega-menu__link">
                                <span class="mega-menu__link-text">For Business</span>
                            </a>

                            
                            <div id="Main Menu|For Business" class="mega-menu__second-level element-1">
                                <div class="we-container mega-menu__second-level-content">
                                    <div class="mega-menu__back-button"></div>
                                    <ul class="mega-menu__list">

                                        <li class="mega-menu__l2-item ">
                                            
                                            <!-- using onclick forced by Adobe way of analytics implementation -->
                                            <a onclick="s_objectID='GravityZone Platform';" href="/business/gravityzone-platform.html" class="mega-menu__l2-link">
                                                <span class="mega-menu__l2-link-text">Platform</span>
                                            </a>

                                            
                                            <div id="Main Menu|For Business|Platform" class="mega-menu__third-level element-1-0 container">
                                                <div class="we-container mega-menu__third-level-content">
                                                    <div class="mega-menu__back-button-l2"></div>
                                                    
                                                    <div class="mega-menu__category-links">
                                                        <!-- using onclick forced by Adobe way of analytics implementation -->
                                                        <a onclick="s_objectID='GravityZone Platform';" href="/business/gravityzone-platform.html" class="mega-menu__category-link">
                                                            GravityZone Platform
                                                        </a>
                                                    </div>

                                                    <div class="mega-menu__row">
                                                        <div class="mega-menu__col">

                                                            
                                                            

    
    
    
    <div id="container-f7ef289567" class="cmp-container">
        
        <div class="navigation"><div class="navigation__container ">

    <div class="navigation__heading">
        <a onclick="s_objectID='GravityZone Packages';" href="/business/products/security-packages.html" class="navigation__header-link">
           <span class="navigation__header-text">
            GravityZone Packages
           </span>
        </a>
        
        
    </div>

    <div id="GravityZone Packages" class="navigation__links">
        <ul class="navigation__list">
            
                <li class="navigation__item link-0">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Small Business Security';" href="/business/products/gravityzone-small-business-security.html" class="navigation__link">
                        Small Business Security
                    </a>
                    <em class="navigation__tag">Buy Online</em>
                </li>
            
        
            
                <li class="navigation__item link-1">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Business Security';" href="/business/smb-products/business-security.html" class="navigation__link">
                        Business Security
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-2">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Business Security Premium';" href="/business/products/gravityzone-premium-security.html" class="navigation__link">
                        Business Security Premium
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-3">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Business Security Enterprise';" href="/business/products/gravityzone-enterprise-security.html" class="navigation__link">
                        Business Security Enterprise
                    </a>
                    
                </li>
            
        </ul>
        <div class="navigation__view-all">
            View All
        </div>
    </div>
</div>
</div>

        
    </div>


                                                        </div>
                                                    
                                                        <div class="mega-menu__col">

                                                            
                                                            

    
    
    
    <div id="container-e55ae6e34e" class="cmp-container">
        
        <div class="navigation"><div class="navigation__container ">

    <div class="navigation__heading">
        <a onclick="s_objectID='GravityZone Products';" href="/business/products/security-products.html" class="navigation__header-link">
           <span class="navigation__header-text">
            GravityZone Products
           </span>
        </a>
        
        
    </div>

    <div id="GravityZone Products" class="navigation__links">
        <ul class="navigation__list">
            
                <li class="navigation__item link-0">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Security for Mobile';" href="/business/gravityzone-addons/security-for-mobile.html" class="navigation__link">
                        Security for Mobile
                    </a>
                    <em class="navigation__tag">NEW</em>
                </li>
            
        
            
                <li class="navigation__item link-1">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Endpoint Detection and Response (EDR)';" href="/business/enterprise-products/endpoint-detection-response.html" class="navigation__link">
                        Endpoint Detection and Response (EDR)
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-2">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Extended Detection and Response (XDR)';" href="/business/products/gravityzone-xdr.html" class="navigation__link">
                        Extended Detection and Response (XDR)
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-3">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Security for Containers (Linux)';" href="/business/products/container-security.html" class="navigation__link">
                        Security for Containers (Linux)
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-4">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Cloud and Server Security';" href="/business/products/cloud-server-security.html" class="navigation__link">
                        Cloud and Server Security
                    </a>
                    
                </li>
            
        </ul>
        <div class="navigation__view-all">
            View All
        </div>
    </div>
</div>
</div>

        
    </div>


                                                        </div>
                                                    
                                                        <div class="mega-menu__col">

                                                            
                                                            

    
    
    
    <div id="container-d298c99ab7" class="cmp-container">
        
        <div class="navigation"><div class="navigation__container ">

    <div class="navigation__heading">
        
        <div class="navigation__header-link"><span class="navigation__header-text">GravityZone Add-ons</span></div>
        
    </div>

    <div id="GravityZone Add-ons" class="navigation__links">
        <ul class="navigation__list">
            
                <li class="navigation__item link-0">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Security for Email';" href="/business/gravityzone-addons/email-security.html" class="navigation__link">
                        Security for Email
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-1">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Security for Storage';" href="/business/enterprise-products/security-for-storage.html" class="navigation__link">
                        Security for Storage
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-2">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Integrity Monitoring';" href="/business/products/gravityzone-integrity-monitoring.html" class="navigation__link">
                        Integrity Monitoring
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-3">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Patch Management';" href="/business/gravityzone-addons/patch-management.html" class="navigation__link">
                        Patch Management
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-4">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Full Disk Encryption';" href="/business/gravityzone-addons/full-disk-encryption.html" class="navigation__link">
                        Full Disk Encryption
                    </a>
                    
                </li>
            
        </ul>
        <div class="navigation__view-all">
            View All
        </div>
    </div>
</div>
</div>

        
    </div>


                                                        </div>
                                                    
                                                        <div class="mega-menu__col">

                                                            
                                                            

    
    
    
    <div id="container-596e022e89" class="cmp-container">
        
        <div class="navigation"><div class="navigation__container navigation__quick-links">

    <div class="navigation__heading">
        
        <div class="navigation__header-link"><span class="navigation__header-text">Quick Links</span></div>
        
    </div>

    <div id="Quick Links" class="navigation__links">
        <ul class="navigation__list">
            
                <li class="navigation__item link-0">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Best Deals';" href="/business/deals.html" class="navigation__link">
                        Best Deals
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-1">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Free Trials';" href="/business/products/free-trials.html" class="navigation__link">
                        Free Trials
                    </a>
                    <em class="navigation__tag">Try Now</em>
                </li>
            
        
            
                <li class="navigation__item link-2">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Compare Solutions';" href="/business/compare.html" class="navigation__link">
                        Compare Solutions
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-3">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='All Products';" href="/business/all-products.html" class="navigation__link">
                        All Products
                    </a>
                    
                </li>
            
        </ul>
        <div class="navigation__view-all">
            View All
        </div>
    </div>
</div>
</div>

        
    </div>


                                                        </div>
                                                    </div>

                                                    <div class="mega-menu__row mega-menu__row-bottom">

                                                        
                                                        <div class="mega-menu__col-bottom mega-menu__col">

    
    
    
    <div id="container-43be4f03d3" class="cmp-container">
        
        <div class="navigation"><div class="navigation__container ">

    <div class="navigation__heading">
        <a onclick="s_objectID='GravityZone for Managed Service Providers';" href="/business/products/managed-service-providers-security.html" class="navigation__header-link">
           <span class="navigation__header-text">
            GravityZone for Managed Service Providers
           </span>
        </a>
        
        
    </div>

    <div id="GravityZone for Managed Service Providers" class="navigation__links">
        <ul class="navigation__list">
            
                <li class="navigation__item link-0">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Security Solutions for MSPs';" href="/business/service-providers-products/cloud-security-msp.html" class="navigation__link">
                        Security Solutions for MSPs
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-1">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Managed Detection and Response Services for MSPs';" href="/business/products/mdr-for-msp.html" class="navigation__link">
                        Managed Detection and Response Services for MSPs
                    </a>
                    
                </li>
            
        </ul>
        
    </div>
</div>
</div>

        
    </div>

</div>
                                                    

                                                        
                                                        <div class="mega-menu__col-bottom ">

    
    
    
    <div id="container-0986af5db0" class="cmp-container">
        
        <div class="navigation"><div class="navigation__container ">

    <div class="navigation__heading">
        
        <div class="navigation__header-link"><span class="navigation__header-text">Threat Intelligence Solutions</span></div>
        
    </div>

    <div id="Threat Intelligence Solutions" class="navigation__links">
        <ul class="navigation__list">
            
                <li class="navigation__item link-0">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Advanced Threat Intelligence';" href="/business/products/advanced-threat-intelligence.html" class="navigation__link">
                        Advanced Threat Intelligence
                    </a>
                    
                </li>
            
        </ul>
        
    </div>
</div>
</div>

        
    </div>

</div>
                                                    </div>

                                                    <div class="mega-menu__quick-links-mobile"></div>
                                                </div>
                                            </div>
                                        </li>
                                    

                                        <li class="mega-menu__l2-item ">
                                            
                                            <!-- using onclick forced by Adobe way of analytics implementation -->
                                            <a class="mega-menu__l2-link">
                                                <span class="mega-menu__l2-link-text">Services</span>
                                            </a>

                                            
                                            <div id="Main Menu|For Business|Services" class="mega-menu__third-level element-1-1 container">
                                                <div class="we-container mega-menu__third-level-content">
                                                    <div class="mega-menu__back-button-l2"></div>
                                                    
                                                    

                                                    <div class="mega-menu__row">
                                                        <div class="mega-menu__col">

                                                            
                                                            

    
    
    
    <div id="container-34c1bcf562" class="cmp-container">
        
        <div class="navigation"><div class="navigation__container ">

    <div class="navigation__heading">
        <a onclick="s_objectID='Security Services';" href="/business/services/managed-services.html" class="navigation__header-link">
           <span class="navigation__header-text">
            Security Services
           </span>
        </a>
        
        
    </div>

    <div id="Security Services" class="navigation__links">
        <ul class="navigation__list">
            
                <li class="navigation__item link-0">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Managed Detection and Response';" href="/business/enterprise-products/managed-detection-response-service.html" class="navigation__link">
                        Managed Detection and Response
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-1">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Managed Detection and Response for MSPs';" href="/business/products/mdr-for-msp.html" class="navigation__link">
                        Managed Detection and Response for MSPs
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-2">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Offensive Security Services';" href="/business/products/offensive-services.html" class="navigation__link">
                        Offensive Security Services
                    </a>
                    <em class="navigation__tag">New</em>
                </li>
            
        </ul>
        
    </div>
</div>
</div>

        
    </div>


                                                        </div>
                                                    
                                                        <div class="mega-menu__col">

                                                            
                                                            

    
    
    
    <div id="container-3c86a0390e" class="cmp-container">
        
        <div class="navigation"><div class="navigation__container ">

    <div class="navigation__heading">
        <a onclick="s_objectID='Support Services';" href="/business/services/support.html" class="navigation__header-link">
           <span class="navigation__header-text">
            Support Services
           </span>
        </a>
        
        
    </div>

    <div id="Support Services" class="navigation__links">
        <ul class="navigation__list">
            
                <li class="navigation__item link-0">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Support Documentation';" href="https://www.bitdefender.com/business/support/?lang=en" class="navigation__link">
                        Support Documentation
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-1">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Premium Support';" href="/business/services/enterprise-premium-support.html" class="navigation__link">
                        Premium Support
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-2">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Professional Services';" href="/business/services/enterprise-professional-services.html" class="navigation__link">
                        Professional Services
                    </a>
                    
                </li>
            
        </ul>
        
    </div>
</div>
</div>

        
    </div>


                                                        </div>
                                                    
                                                        <div class="mega-menu__col">

                                                            
                                                            

    
    
    
    <div id="container-7ac9426aa9" class="cmp-container">
        
        <div class="navigation"><div class="navigation__container ">

    <div class="navigation__heading">
        
        <div class="navigation__header-link"><span class="navigation__header-text">Quick Links</span></div>
        
    </div>

    <div id="Quick Links" class="navigation__links">
        <ul class="navigation__list">
            
                <li class="navigation__item link-0">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Inquiry';" href="/business/products/inquire.html" class="navigation__link">
                        Inquiry
                    </a>
                    
                </li>
            
        </ul>
        
    </div>
</div>
</div>

        
    </div>


                                                        </div>
                                                    
                                                        
                                                    </div>

                                                    

                                                    <div class="mega-menu__quick-links-mobile"></div>
                                                </div>
                                            </div>
                                        </li>
                                    

                                        <li class="mega-menu__l2-item ">
                                            
                                            <!-- using onclick forced by Adobe way of analytics implementation -->
                                            <a class="mega-menu__l2-link">
                                                <span class="mega-menu__l2-link-text">Why Bitdefender</span>
                                            </a>

                                            
                                            <div id="Main Menu|For Business|Why Bitdefender" class="mega-menu__third-level element-1-2 container">
                                                <div class="we-container mega-menu__third-level-content">
                                                    <div class="mega-menu__back-button-l2"></div>
                                                    
                                                    

                                                    <div class="mega-menu__row">
                                                        <div class="mega-menu__col">

                                                            
                                                            

    
    
    
    <div id="container-42012ad8d9" class="cmp-container">
        
        <div class="navigation"><div class="navigation__container ">

    <div class="navigation__heading">
        
        <div class="navigation__header-link"><span class="navigation__header-text">The Bitdefender Difference</span></div>
        
    </div>

    <div id="The Bitdefender Difference" class="navigation__links">
        <ul class="navigation__list">
            
                <li class="navigation__item link-0">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Customer Success Stories';" href="/business/our-customers.html" class="navigation__link">
                        Customer Success Stories
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-1">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Industry Recognition and Awards';" href="/business/awards.html" class="navigation__link">
                        Industry Recognition and Awards
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-2">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Technology Alliances';" href="/business/technology-alliances.html" class="navigation__link">
                        Technology Alliances
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-3">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Certifications';" href="/business/certifications.html" class="navigation__link">
                        Certifications
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-4">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Bitdefender Labs and Research';" href="/business/research.html" class="navigation__link">
                        Bitdefender Labs and Research
                    </a>
                    
                </li>
            
        </ul>
        <div class="navigation__view-all">
            
        </div>
    </div>
</div>
</div>

        
    </div>


                                                        </div>
                                                    
                                                        <div class="mega-menu__col">

                                                            
                                                            

    
    
    
    <div id="container-d78ac6c9ca" class="cmp-container">
        
        <div class="navigation"><div class="navigation__container ">

    <div class="navigation__heading">
        
        <div class="navigation__header-link"><span class="navigation__header-text">Solutions</span></div>
        
    </div>

    <div id="Solutions" class="navigation__links">
        <ul class="navigation__list">
            
                <li class="navigation__item link-0">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Enable Cyber Resilience';" href="/business/solutions/cyber-resilience.html" class="navigation__link">
                        Enable Cyber Resilience
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-1">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Improve Cybersecurity Compliance';" href="/business/solutions/cybersecurity-compliance.html" class="navigation__link">
                        Improve Cybersecurity Compliance
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-2">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Provide Managed Security Services';" href="/business/solutions/managed-security-services.html" class="navigation__link">
                        Provide Managed Security Services
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-3">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Security Cloud Workloads';" href="/business/solutions/cloud-workload-protection.html" class="navigation__link">
                        Security Cloud Workloads
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-4">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Secure Datacenters';" href="/business/solutions/data-center-security.html" class="navigation__link">
                        Secure Datacenters
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-5">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Secure Endpoints';" href="/business/solutions/endpoint-security.html" class="navigation__link">
                        Secure Endpoints
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-6">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Secure Small to Medium Business';" href="/business/solutions/small-medium-business-cybersecurity.html" class="navigation__link">
                        Secure Small to Medium Business
                    </a>
                    
                </li>
            
        </ul>
        <div class="navigation__view-all">
            
        </div>
    </div>
</div>
</div>

        
    </div>


                                                        </div>
                                                    
                                                        <div class="mega-menu__col">

                                                            
                                                            

    
    
    
    <div id="container-ff6dcf4e7b" class="cmp-container">
        
        <div class="navigation"><div class="navigation__container ">

    <div class="navigation__heading">
        
        <div class="navigation__header-link"><span class="navigation__header-text">Industries</span></div>
        
    </div>

    <div id="Industries" class="navigation__links">
        <ul class="navigation__list">
            
                <li class="navigation__item link-0">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Education';" href="/business/industry-solutions/education-cybersecurity.html" class="navigation__link">
                        Education
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-1">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Energy and Utilities';" href="/business/industry-solutions/energy-utilities-cybersecurity.html" class="navigation__link">
                        Energy and Utilities
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-2">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Financial Services';" href="/business/industry-solutions/financial-services-cybersecurity.html" class="navigation__link">
                        Financial Services
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-3">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Healthcare';" href="/business/industry-solutions/healthcare-cybersecurity.html" class="navigation__link">
                        Healthcare
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-4">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Manufacturing';" href="/business/industry-solutions/manufacturing-cybersecurity.html" class="navigation__link">
                        Manufacturing
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-5">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Public Sector';" href="/business/industry-solutions/public-sector-cybersecurity.html" class="navigation__link">
                        Public Sector
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-6">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Technology';" href="/business/industry-solutions/technology.html" class="navigation__link">
                        Technology
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-7">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Telecommunications';" href="/business/industry-solutions/telecommunications-cybersecurity.html" class="navigation__link">
                        Telecommunications
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-8">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Retail';" href="/business/industry-solutions/retail-cybersecurity.html" class="navigation__link">
                        Retail
                    </a>
                    
                </li>
            
        </ul>
        <div class="navigation__view-all">
            
        </div>
    </div>
</div>
</div>

        
    </div>


                                                        </div>
                                                    
                                                        
                                                    </div>

                                                    

                                                    <div class="mega-menu__quick-links-mobile"></div>
                                                </div>
                                            </div>
                                        </li>
                                    

                                        <li class="mega-menu__l2-item ">
                                            
                                            <!-- using onclick forced by Adobe way of analytics implementation -->
                                            <a class="mega-menu__l2-link">
                                                <span class="mega-menu__l2-link-text">Resources</span>
                                            </a>

                                            
                                            <div id="Main Menu|For Business|Resources" class="mega-menu__third-level element-1-3 container">
                                                <div class="we-container mega-menu__third-level-content">
                                                    <div class="mega-menu__back-button-l2"></div>
                                                    
                                                    

                                                    <div class="mega-menu__row">
                                                        <div class="mega-menu__col">

                                                            
                                                            

    
    
    
    <div id="container-a64c4f34e5" class="cmp-container">
        
        <div class="navigation"><div class="navigation__container ">

    <div class="navigation__heading">
        <a onclick="s_objectID='Resources';" href="/business/resource-library.html" class="navigation__header-link">
           <span class="navigation__header-text">
            Resources
           </span>
        </a>
        
        
    </div>

    <div id="Resources" class="navigation__links">
        <ul class="navigation__list">
            
                <li class="navigation__item link-0">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Case Studies';" href="https://www.bitdefender.com/business/resource-library.html?type=Case-Study" class="navigation__link">
                        Case Studies
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-1">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Whitepapers';" href="https://www.bitdefender.com/business/resource-library.html?type=Whitepaper" class="navigation__link">
                        Whitepapers
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-2">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Webinars';" href="/business/webinars.html" class="navigation__link">
                        Webinars
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-3">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Industry Reports';" href="https://www.bitdefender.com/business/resource-library.html?type=Industry-Reports" class="navigation__link">
                        Industry Reports
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-4">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Events';" href="/business/events.html" class="navigation__link">
                        Events
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-5">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Research Reports';" href="/business/research.html" class="navigation__link">
                        Research Reports
                    </a>
                    
                </li>
            
        </ul>
        <div class="navigation__view-all">
            
        </div>
    </div>
</div>
</div>

        
    </div>


                                                        </div>
                                                    
                                                        <div class="mega-menu__col">

                                                            
                                                            

    
    
    
    <div id="container-b18aced3d6" class="cmp-container">
        
        <div class="navigation"><div class="navigation__container ">

    <div class="navigation__heading">
        <a onclick="s_objectID='Business Insights Blog';" href="https://www.bitdefender.com/blog/businessinsights/" class="navigation__header-link">
           <span class="navigation__header-text">
            Business Insights Blog
           </span>
        </a>
        
        
    </div>

    <div id="Business Insights Blog" class="navigation__links">
        <ul class="navigation__list">
            
                <li class="navigation__item link-0">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='2024 Cybersecurity Outlook';" href="https://www.bitdefender.com/blog/businessinsights/2024-cybersecurity-outlook-navigating-the-geopolitical-landscape/" class="navigation__link">
                        2024 Cybersecurity Outlook
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-1">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='2024 Cybersecurity Predictions for AI';" href="https://www.bitdefender.com/blog/businessinsights/2024-cybersecurity-predictions-for-ai-a-technical-deep-dive/" class="navigation__link">
                        2024 Cybersecurity Predictions for AI
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-2">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='2024 Ransomware Trends';" href="https://www.bitdefender.com/blog/businessinsights/2024-cybersecurity-forecast-ransomwares-new-tactics-and-targets/" class="navigation__link">
                        2024 Ransomware Trends
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-3">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Cyber Threat Landscape Review | Jan.2024';" href="https://www.bitdefender.com/blog/businessinsights/bitdefender-threat-debrief-january-2024/" class="navigation__link">
                        Cyber Threat Landscape Review | Jan.2024
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-4">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Introducing CSPM';" href="https://www.bitdefender.com/blog/businessinsights/introducing-cloud-security-posture-management-the-key-to-configuration-control/" class="navigation__link">
                        Introducing CSPM
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-5">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='The essential role of CSPM';" href="https://www.bitdefender.com/blog/businessinsights/establishing-a-foundation-the-essential-role-of-cspm-in-cloud-security-maturit/" class="navigation__link">
                        The essential role of CSPM
                    </a>
                    
                </li>
            
        </ul>
        <div class="navigation__view-all">
            
        </div>
    </div>
</div>
</div>

        
    </div>


                                                        </div>
                                                    
                                                        <div class="mega-menu__col">

                                                            
                                                            

    
    
    
    <div id="container-91ed1d4928" class="cmp-container">
        
        <div class="navigation"><div class="navigation__container ">

    <div class="navigation__heading">
        <a onclick="s_objectID='InfoZone';" href="/business/infozone.html" class="navigation__header-link">
           <span class="navigation__header-text">
            InfoZone
           </span>
        </a>
        
        
    </div>

    <div id="InfoZone" class="navigation__links">
        <ul class="navigation__list">
            
                <li class="navigation__item link-0">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='What is Ransomware?';" href="/business/infozone/what-is-ransomware.html" class="navigation__link">
                        What is Ransomware?
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-1">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='What is Phishing?';" href="/business/infozone/what-is-phishing.html" class="navigation__link">
                        What is Phishing?
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-2">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='What is Malware?';" href="/business/infozone/what-is-malware.html" class="navigation__link">
                        What is Malware?
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-3">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='What is Endpoint Security?';" rel="nofollow" href="/business/infozone/what-is-endpoint-security.html" class="navigation__link">
                        What is Endpoint Security?
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-4">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='What is EDR?';" href="/business/infozone/what-is-edr.html" class="navigation__link">
                        What is EDR?
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-5">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='What is XDR?';" href="/business/infozone/what-is-xdr.html" class="navigation__link">
                        What is XDR?
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-6">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='What is MDR?';" href="/business/infozone/what-is-mdr.html" class="navigation__link">
                        What is MDR?
                    </a>
                    
                </li>
            
        </ul>
        <div class="navigation__view-all">
            
        </div>
    </div>
</div>
</div>

        
    </div>


                                                        </div>
                                                    
                                                        <div class="mega-menu__col">

                                                            
                                                            

    
    
    
    <div id="container-e6db4a49e0" class="cmp-container">
        
        <div class="navigation"><div class="navigation__container ">

    <div class="navigation__heading">
        <a onclick="s_objectID='TechZone';" href="https://techzone.bitdefender.com/index.html?lang=en" class="navigation__header-link">
           <span class="navigation__header-text">
            TechZone
           </span>
        </a>
        
        
    </div>

    <div id="TechZone" class="navigation__links">
        <ul class="navigation__list">
            
                <li class="navigation__item link-0">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='GravityZone Platform';" href="https://techzone.bitdefender.com/en/gravityzone-platform.html" class="navigation__link">
                        GravityZone Platform
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-1">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Multi-layered Security';" href="https://techzone.bitdefender.com/en/gravityzone-platform/multi-layered-security.html" class="navigation__link">
                        Multi-layered Security
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-2">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Security Layers';" href="https://techzone.bitdefender.com/en/security-layers.html" class="navigation__link">
                        Security Layers
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-3">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='EDR, XDR, MDR Overview';" href="https://techzone.bitdefender.com/en/security-layers/detection/edr-xdr-and-mdr-overview.html" class="navigation__link">
                        EDR, XDR, MDR Overview
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-4">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='XDR Sensors';" href="https://techzone.bitdefender.com/en/security-layers/detection/sensors.html" class="navigation__link">
                        XDR Sensors
                    </a>
                    
                </li>
            
        </ul>
        <div class="navigation__view-all">
            
        </div>
    </div>
</div>
</div>

        
    </div>


                                                        </div>
                                                    </div>

                                                    

                                                    <div class="mega-menu__quick-links-mobile"></div>
                                                </div>
                                            </div>
                                        </li>
                                    

                                        <li class="mega-menu__l2-item ">
                                            
                                            <!-- using onclick forced by Adobe way of analytics implementation -->
                                            <a onclick="s_objectID='About';" href="/business/about-business-solution-group.html" class="mega-menu__l2-link">
                                                <span class="mega-menu__l2-link-text">About</span>
                                            </a>

                                            
                                            <div id="Main Menu|For Business|About" class="mega-menu__third-level element-1-4 container">
                                                <div class="we-container mega-menu__third-level-content">
                                                    <div class="mega-menu__back-button-l2"></div>
                                                    
                                                    

                                                    <div class="mega-menu__row">
                                                        <div class="mega-menu__col">

                                                            
                                                            

    
    
    
    <div id="container-d16e07d2cf" class="cmp-container">
        
        <div class="navigation"><div class="navigation__container ">

    

    <div class="navigation__links">
        <ul class="navigation__list">
            
                <li class="navigation__item link-0">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='About the Business Solution Group';" href="/business/about-business-solution-group.html" class="navigation__link">
                        About the Business Solution Group
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-1">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Leadership';" href="/company/management-team.html" class="navigation__link">
                        Leadership
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-2">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Careers';" href="/company/job-opportunities.html" class="navigation__link">
                        Careers
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-3">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Newsroom';" href="/company/#Latest.html" class="navigation__link">
                        Newsroom
                    </a>
                    
                </li>
            
        </ul>
        <div class="navigation__view-all">
            
        </div>
    </div>
</div>
</div>

        
    </div>


                                                        </div>
                                                    
                                                        
                                                    
                                                        
                                                    
                                                        
                                                    </div>

                                                    

                                                    <div class="mega-menu__quick-links-mobile"></div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>

                                    
                                    <div class="mega-menu__right-top-link">
                                        <!-- using onclick forced by Adobe way of analytics implementation -->
                                        <a class="mega-menu__right-top-link-target" onclick="s_objectID='For Business';" href="/business.html">
                                            Business Solutions
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </li>
                    
                        
                        <li class="mega-menu__item  ">
                            
                            <!-- using onclick forced by Adobe way of analytics implementation -->
                            <a onclick="s_objectID='For Partners';" href="/partners.html" class="mega-menu__link">
                                <span class="mega-menu__link-text">For Partners</span>
                            </a>

                            
                            <div id="Main Menu|For Partners" class="mega-menu__second-level element-2">
                                <div class="we-container mega-menu__second-level-content">
                                    <div class="mega-menu__back-button"></div>
                                    <ul class="mega-menu__list">

                                        <li class="mega-menu__l2-item ">
                                            
                                            <!-- using onclick forced by Adobe way of analytics implementation -->
                                            <a class="mega-menu__l2-link">
                                                <span class="mega-menu__l2-link-text">Reseller Partners</span>
                                            </a>

                                            
                                            <div id="Main Menu|For Partners|Reseller Partners" class="mega-menu__third-level element-2-0 container">
                                                <div class="we-container mega-menu__third-level-content">
                                                    <div class="mega-menu__back-button-l2"></div>
                                                    
                                                    

                                                    <div class="mega-menu__row">
                                                        <div class="mega-menu__col">

                                                            
                                                            

    
    
    
    <div id="container-63aa4029bb" class="cmp-container">
        
        <div class="navigation"><div class="navigation__container ">

    <div class="navigation__heading">
        
        <div class="navigation__header-link"><span class="navigation__header-text">Our network</span></div>
        
    </div>

    <div id="Our network" class="navigation__links">
        <ul class="navigation__list">
            
                <li class="navigation__item link-0">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Reselling Partner Program Overview';" href="/partners.html" class="navigation__link">
                        Reselling Partner Program Overview
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-1">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Become a Reseller';" href="https://pan.bitdefender.com/partners/save/" class="navigation__link">
                        Become a Reseller
                    </a>
                    
                </li>
            
        </ul>
        
    </div>
</div>
</div>

        
    </div>


                                                        </div>
                                                    
                                                        <div class="mega-menu__col">

                                                            
                                                            

    
    
    
    <div id="container-b4fdc6d71c" class="cmp-container">
        
        <div class="navigation"><div class="navigation__container ">

    <div class="navigation__heading">
        
        <div class="navigation__header-link"><span class="navigation__header-text">Quick Links</span></div>
        
    </div>

    <div id="Quick Links" class="navigation__links">
        <ul class="navigation__list">
            
                <li class="navigation__item link-0">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Log In To PAN Portal';" href="https://pan.bitdefender.com/" class="navigation__link">
                        Log In To PAN Portal
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-1">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Find a Reseller';" href="/partners/partner-locator.html" class="navigation__link">
                        Find a Reseller
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-2">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Already a Partner?';" href="https://pan.bitdefender.com/" class="navigation__link">
                        Already a Partner?
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-3">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Join our Affiliates Program';" href="https://app.impact.com/campaign-promo-signup/Bitdefender.brand?execution=e1s1" class="navigation__link">
                        Join our Affiliates Program
                    </a>
                    
                </li>
            
        </ul>
        <div class="navigation__view-all">
            View All
        </div>
    </div>
</div>
</div>

        
    </div>


                                                        </div>
                                                    
                                                        
                                                    
                                                        
                                                    </div>

                                                    

                                                    <div class="mega-menu__quick-links-mobile"></div>
                                                </div>
                                            </div>
                                        </li>
                                    

                                        <li class="mega-menu__l2-item ">
                                            
                                            <!-- using onclick forced by Adobe way of analytics implementation -->
                                            <a class="mega-menu__l2-link">
                                                <span class="mega-menu__l2-link-text">Managed Service Providers</span>
                                            </a>

                                            
                                            <div id="Main Menu|For Partners|Managed Service Providers" class="mega-menu__third-level element-2-1 container">
                                                <div class="we-container mega-menu__third-level-content">
                                                    <div class="mega-menu__back-button-l2"></div>
                                                    
                                                    

                                                    <div class="mega-menu__row">
                                                        <div class="mega-menu__col">

                                                            
                                                            

    
    
    
    <div id="container-9a2cb21c10" class="cmp-container">
        
        <div class="navigation"><div class="navigation__container ">

    <div class="navigation__heading">
        
        <div class="navigation__header-link"><span class="navigation__header-text">Our Network</span></div>
        
    </div>

    <div id="Our Network" class="navigation__links">
        <ul class="navigation__list">
            
                <li class="navigation__item link-0">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='MSP Partner Program Overview';" href="/partners/msp-partners.html" class="navigation__link">
                        MSP Partner Program Overview
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-1">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Become a MSP Partner';" href="https://pan.bitdefender.com/partners/save/" class="navigation__link">
                        Become a MSP Partner
                    </a>
                    
                </li>
            
        </ul>
        
    </div>
</div>
</div>

        
    </div>


                                                        </div>
                                                    
                                                        <div class="mega-menu__col">

                                                            
                                                            

    
    
    
    <div id="container-90ae7c61c2" class="cmp-container">
        
        <div class="navigation"><div class="navigation__container ">

    <div class="navigation__heading">
        
        <div class="navigation__header-link"><span class="navigation__header-text">Quick Links</span></div>
        
    </div>

    <div id="Quick Links" class="navigation__links">
        <ul class="navigation__list">
            
                <li class="navigation__item link-0">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Log In To PAN Portal';" href="https://pan.bitdefender.com/" class="navigation__link">
                        Log In To PAN Portal
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-1">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Find a MSP Partner';" href="/partners/partner-locator.html" class="navigation__link">
                        Find a MSP Partner
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-2">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Already a Partner?';" href="https://pan.bitdefender.com/" class="navigation__link">
                        Already a Partner?
                    </a>
                    
                </li>
            
        </ul>
        
    </div>
</div>
</div>

        
    </div>


                                                        </div>
                                                    
                                                        
                                                    
                                                        
                                                    </div>

                                                    

                                                    <div class="mega-menu__quick-links-mobile"></div>
                                                </div>
                                            </div>
                                        </li>
                                    

                                        <li class="mega-menu__l2-item ">
                                            
                                            <!-- using onclick forced by Adobe way of analytics implementation -->
                                            <a class="mega-menu__l2-link">
                                                <span class="mega-menu__l2-link-text">Technology Licensing</span>
                                            </a>

                                            
                                            <div id="Main Menu|For Partners|Technology Licensing" class="mega-menu__third-level element-2-2 container">
                                                <div class="we-container mega-menu__third-level-content">
                                                    <div class="mega-menu__back-button-l2"></div>
                                                    
                                                    

                                                    <div class="mega-menu__row">
                                                        <div class="mega-menu__col">

                                                            
                                                            

    
    
    
    <div id="container-a24987358e" class="cmp-container">
        
        <div class="navigation"><div class="navigation__container ">

    <div class="navigation__heading">
        
        <div class="navigation__header-link"><span class="navigation__header-text">Technology Licensing Portfolio</span></div>
        
    </div>

    <div id="Technology Licensing Portfolio" class="navigation__links">
        <ul class="navigation__list">
            
                <li class="navigation__item link-0">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='OEM Technology Solutions';" href="/oem.html" class="navigation__link">
                        OEM Technology Solutions
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-1">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Endpoint Protection SDKs';" href="/oem/endpoint-protection.html" class="navigation__link">
                        Endpoint Protection SDKs
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-2">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Gateway Protection SDKs';" href="/oem/gateway-protection.html" class="navigation__link">
                        Gateway Protection SDKs
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-3">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Sandbox Services';" href="/oem/sandbox-service.html" class="navigation__link">
                        Sandbox Services
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-4">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Reputation Threat Intelligence';" href="/oem/threat-intelligence-feeds-services.html" class="navigation__link">
                        Reputation Threat Intelligence
                    </a>
                    
                </li>
            
        </ul>
        <div class="navigation__view-all">
            View All
        </div>
    </div>
</div>
</div>

        
    </div>


                                                        </div>
                                                    
                                                        <div class="mega-menu__col">

                                                            
                                                            

    
    
    
    <div id="container-18ec1b1771" class="cmp-container">
        
        <div class="navigation"><div class="navigation__container ">

    <div class="navigation__heading">
        
        <div class="navigation__header-link"><span class="navigation__header-text">Licensing Options</span></div>
        
    </div>

    <div id="Licensing Options" class="navigation__links">
        <ul class="navigation__list">
            
                <li class="navigation__item link-0">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='SDK Integration';" href="/oem/sdk-integration.html" class="navigation__link">
                        SDK Integration
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-1">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Rebranding';" href="/oem/rebranding-private-label-or-white-label.html" class="navigation__link">
                        Rebranding
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-2">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Bundling';" href="/oem/bundling-or-pre-installation.html" class="navigation__link">
                        Bundling
                    </a>
                    
                </li>
            
        </ul>
        
    </div>
</div>
</div>

        
    </div>


                                                        </div>
                                                    
                                                        <div class="mega-menu__col">

                                                            
                                                            

    
    
    
    <div id="container-7780e52162" class="cmp-container">
        
        <div class="navigation"><div class="navigation__container navigation__quick-links">

    <div class="navigation__heading">
        
        <div class="navigation__header-link"><span class="navigation__header-text">Quick Links</span></div>
        
    </div>

    <div id="Quick Links" class="navigation__links">
        <ul class="navigation__list">
            
                <li class="navigation__item link-0">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Contact Us';" href="/oem/contact-us.html" class="navigation__link">
                        Contact Us
                    </a>
                    
                </li>
            
        </ul>
        
    </div>
</div>
</div>

        
    </div>


                                                        </div>
                                                    
                                                        
                                                    </div>

                                                    

                                                    <div class="mega-menu__quick-links-mobile"></div>
                                                </div>
                                            </div>
                                        </li>
                                    

                                        <li class="mega-menu__l2-item ">
                                            
                                            <!-- using onclick forced by Adobe way of analytics implementation -->
                                            <a onclick="s_objectID='Subscriber Protection Platform';" href="/partners/subscriber-protection-platform.html" class="mega-menu__l2-link">
                                                <span class="mega-menu__l2-link-text">Telco Partners</span>
                                            </a>

                                            
                                            <div id="Main Menu|For Partners|Telco Partners" class="mega-menu__third-level element-2-3 container">
                                                <div class="we-container mega-menu__third-level-content">
                                                    <div class="mega-menu__back-button-l2"></div>
                                                    
                                                    <div class="mega-menu__category-links">
                                                        <!-- using onclick forced by Adobe way of analytics implementation -->
                                                        <a onclick="s_objectID='Subscriber Protection Platform';" href="/partners/subscriber-protection-platform.html" class="mega-menu__category-link">
                                                            Subscriber Protection Platform
                                                        </a>
                                                    </div>

                                                    <div class="mega-menu__row">
                                                        <div class="mega-menu__col">

                                                            
                                                            

    
    
    
    <div id="container-d8a2448415" class="cmp-container">
        
        <div class="navigation"><div class="navigation__container ">

    

    <div id="track1" class="navigation__links">
        
        
    </div>
</div>
</div>

        
    </div>


                                                        </div>
                                                    
                                                        
                                                    
                                                        
                                                    
                                                        
                                                    </div>

                                                    

                                                    <div class="mega-menu__quick-links-mobile"></div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>

                                    
                                    
                                </div>
                            </div>
                        </li>
                    
                        
                        <li class="mega-menu__item  mega-menu--right">
                            
                            <!-- using onclick forced by Adobe way of analytics implementation -->
                            <a onclick="s_objectID='Company';" href="/company.html" class="mega-menu__link">
                                <span class="mega-menu__link-text">Company</span>
                            </a>

                            
                            <div id="Main Menu|Company" class="mega-menu__second-level element-3">
                                <div class="we-container mega-menu__second-level-content">
                                    <div class="mega-menu__back-button"></div>
                                    <ul class="mega-menu__list">

                                        <li class="mega-menu__l2-item ">
                                            
                                            <!-- using onclick forced by Adobe way of analytics implementation -->
                                            <a class="mega-menu__l2-link">
                                                <span class="mega-menu__l2-link-text">About Us</span>
                                            </a>

                                            
                                            <div id="Main Menu|Company|About Us" class="mega-menu__third-level element-3-0 container">
                                                <div class="we-container mega-menu__third-level-content">
                                                    <div class="mega-menu__back-button-l2"></div>
                                                    
                                                    

                                                    <div class="mega-menu__row">
                                                        <div class="mega-menu__col">

                                                            
                                                            

    
    
    
    <div id="container-f55e7737bb" class="cmp-container">
        
        <div class="navigation"><div class="navigation__container ">

    

    <div id=" " class="navigation__links">
        <ul class="navigation__list">
            
                <li class="navigation__item link-0">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Overview';" href="/company.html" class="navigation__link">
                        Overview
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-1">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Management';" href="/company/management-team.html" class="navigation__link">
                        Management
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-2">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Customers';" href="/business/resource-library.html?type=Case-Study" class="navigation__link">
                        Customers
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-3">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Awards';" href="/business/awards.html" class="navigation__link">
                        Awards
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-4">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Certifications';" href="/business/certifications.html" class="navigation__link">
                        Certifications
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-5">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Careers';" href="/company/job-opportunities.html" class="navigation__link">
                        Careers
                    </a>
                    
                </li>
            
        </ul>
        <div class="navigation__view-all">
            View All
        </div>
    </div>
</div>
</div>

        
    </div>


                                                        </div>
                                                    
                                                        
                                                    
                                                        
                                                    
                                                        
                                                    </div>

                                                    

                                                    <div class="mega-menu__quick-links-mobile"></div>
                                                </div>
                                            </div>
                                        </li>
                                    

                                        <li class="mega-menu__l2-item ">
                                            
                                            <!-- using onclick forced by Adobe way of analytics implementation -->
                                            <a class="mega-menu__l2-link">
                                                <span class="mega-menu__l2-link-text">Latest News</span>
                                            </a>

                                            
                                            <div id="Main Menu|Company|Latest News" class="mega-menu__third-level element-3-1 container">
                                                <div class="we-container mega-menu__third-level-content">
                                                    <div class="mega-menu__back-button-l2"></div>
                                                    
                                                    

                                                    <div class="mega-menu__row">
                                                        <div class="mega-menu__col">

                                                            
                                                            

    
    
    
    <div id="container-41a8374ce4" class="cmp-container">
        
        <div class="navigation"><div class="navigation__container ">

    

    <div id=" " class="navigation__links">
        <ul class="navigation__list">
            
                <li class="navigation__item link-0">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Newsroom';" href="/news.html" class="navigation__link">
                        Newsroom
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-1">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Blogs';" href="https://www.bitdefender.com/blog/" class="navigation__link">
                        Blogs
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-2">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Bitdefender Cyberpedia';" href="https://www.bitdefender.com/cyberpedia/" class="navigation__link">
                        Bitdefender Cyberpedia
                    </a>
                    
                </li>
            
        </ul>
        
    </div>
</div>
</div>

        
    </div>


                                                        </div>
                                                    
                                                        
                                                    
                                                        
                                                    
                                                        
                                                    </div>

                                                    

                                                    <div class="mega-menu__quick-links-mobile"></div>
                                                </div>
                                            </div>
                                        </li>
                                    

                                        <li class="mega-menu__l2-item ">
                                            
                                            <!-- using onclick forced by Adobe way of analytics implementation -->
                                            <a class="mega-menu__l2-link">
                                                <span class="mega-menu__l2-link-text">Resources</span>
                                            </a>

                                            
                                            <div id="Main Menu|Company|Resources" class="mega-menu__third-level element-3-2 container">
                                                <div class="we-container mega-menu__third-level-content">
                                                    <div class="mega-menu__back-button-l2"></div>
                                                    
                                                    

                                                    <div class="mega-menu__row">
                                                        <div class="mega-menu__col">

                                                            
                                                            

    
    
    
    <div id="container-dec01acf87" class="cmp-container">
        
        <div class="navigation"><div class="navigation__container ">

    

    <div id=" " class="navigation__links">
        <ul class="navigation__list">
            
                <li class="navigation__item link-0">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Research';" href="/business/research.html" class="navigation__link">
                        Research
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-1">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='White Papers';" href="/business/resource-library.html?type=Whitepaper" class="navigation__link">
                        White Papers
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-2">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Industry Reports';" href="/business/resource-library.html?type=Industry-Reports" class="navigation__link">
                        Industry Reports
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-3">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Threat Maps';" href="https://threatmap.bitdefender.com/" class="navigation__link">
                        Threat Maps
                    </a>
                    
                </li>
            
        </ul>
        <div class="navigation__view-all">
            View All
        </div>
    </div>
</div>
</div>

        
    </div>


                                                        </div>
                                                    
                                                        
                                                    
                                                        
                                                    
                                                        
                                                    </div>

                                                    

                                                    <div class="mega-menu__quick-links-mobile"></div>
                                                </div>
                                            </div>
                                        </li>
                                    

                                        <li class="mega-menu__l2-item mega-menu__no-l3">
                                            
                                            <!-- using onclick forced by Adobe way of analytics implementation -->
                                            <a onclick="s_objectID='Brand Portal';" href="https://brand.bitdefender.com/brandcenter/en/bitdefenderhub/component/default/104804" class="mega-menu__l2-link">
                                                <span class="mega-menu__l2-link-text">Brand Portal</span>
                                            </a>

                                            
                                            
                                        </li>
                                    </ul>

                                    
                                    
                                </div>
                            </div>
                        </li>
                    
                </ul>
            </nav>
        </div>

        
        <div id="Right Top Links">
            <nav aria-label="secondary" class="mega-menu__right">
                <ul class="mega-menu__first-level">
                    
                        <li class="mega-menu__right-item ">
                            <!-- using onclick forced by Adobe way of analytics implementation -->
                            <a onclick="s_objectID='Blog';" class="mega-menu__right-link" href="https://www.bitdefender.com/blog">
                                Blog
                            </a>

                            
                            
                        </li>
                    

                    
                
                    
                        <li class="mega-menu__right-item mega-menu__popup-container">
                            <!-- using onclick forced by Adobe way of analytics implementation -->
                            <span onclick="s_objectID='Support';" class="mega-menu__right-link">
                                Support
                            </span>

                            
                            <div id="Right Top Links|Support" class="mega-menu__second-level-right element-1 mega-menu__second-level-container">
                                
                                
                                <div class="mega-menu__column">

    
    
    
    <div id="container-f548b79ea1" class="cmp-container">
        
        <div class="navigation"><div class="navigation__container ">

    <div class="navigation__heading">
        
        <div class="navigation__header-link"><span class="navigation__header-text">How Can We Help</span></div>
        
    </div>

    <div id="How Can We Help" class="navigation__links">
        <ul class="navigation__list">
            
                <li class="navigation__item link-0">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Support for Home Products';" href="https://www.bitdefender.com/consumer/support/" class="navigation__link">
                        Support for Home Products
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-1">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Support for Business Products';" href="https://www.bitdefender.com/business/support/" class="navigation__link">
                        Support for Business Products
                    </a>
                    
                </li>
            
        </ul>
        
    </div>
</div>
</div>

        
    </div>

</div>
                            </div>
                        </li>
                    

                    
                
                    

                    
                        <li class="mega-menu__right-item mega-menu__popup-container mega-menu__login-container" data-login-endpoint="/content/experience-fragments/bitdefender/language_master/en/header-navigation/mega-menu/master/_jcr_content.login">
                            <span data-login-text="Hello" class="mega-menu__right-link">
                                Login
                            </span>

                            
                            <div id="Right Top Links|Login" class="mega-menu__second-level-right element-2 mega-menu__second-level-container">
                                
                                
                                <div class="mega-menu__column">

    
    
    
    <div id="container-18a115acca" class="cmp-container">
        
        <div class="navigation"><div class="navigation__container ">

    <div class="navigation__heading">
        
        <div class="navigation__header-link"><span class="navigation__header-text">Your Account</span></div>
        
    </div>

    <div id="Your Account" class="navigation__links">
        <ul class="navigation__list">
            
                <li class="navigation__item link-0">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='Bitdefender Central';" href="https://login.bitdefender.com/central/login.html?lang=en_US&redirect_url=https:%2F%2Fcentral.bitdefender.com" class="navigation__link" data-logged-in-link="https://central.bitdefender.com/">
                        Bitdefender Central
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-1">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='GravityZone CLOUD Control Center';" href="https://gravityzone.bitdefender.com/" class="navigation__link">
                        GravityZone CLOUD Control Center
                    </a>
                    
                </li>
            
        
            
                <li class="navigation__item link-2">
                    <!-- using onclick forced by Adobe way of analytics implementation -->
                    <a onclick="s_objectID='MDR Portal';" href="https://auth.mdr.bitdefender.com/login" class="navigation__link">
                        MDR Portal
                    </a>
                    
                </li>
            
        </ul>
        
    </div>
</div>
</div>

        
    </div>

</div>
                            </div>
                        </li>
                    
                </ul>
            </nav>
        </div>
    </div>
</header>
      `;

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
      // shadowRoot.appendChild(newScriptFile);

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
