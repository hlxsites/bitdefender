/**
 * @param {HTMLDivElement} shadoRoot
 */
const parseMetadata = (shadowRoot) => {
  const metadata = {};
  const sectionMetadata = shadowRoot.querySelector(".section-metadata");
  if (sectionMetadata === null) {
    return metadata;
  }
  for (const child of sectionMetadata.children) {
    const [keyChild, valueChild] = child.children;
    metadata[keyChild.textContent] = valueChild.textContent;
  }

  sectionMetadata.remove();

  return metadata;
}

/**
 * @param {HTMLDivElement} shadoRoot
 * @param {string} origin - prepends the origin to the relative links
 */
const updateLinkSources = (shadoRoot, origin) => {
  shadoRoot
    .querySelectorAll('source')
    .forEach(source => source.srcset = new URL(source.getAttribute("srcset"), origin).href);

  shadoRoot
    .querySelectorAll('img')
    .forEach(image => image.src = new URL(image.getAttribute("src"), origin).href);
};

let ICONS_CACHE = {};
async function decorateIcons(element) {
  // Prepare the inline sprite
  let svgSprite = element.getElementById('franklin-svg-sprite');
  if (!svgSprite) {
    const div = document.createElement('div');
    div.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" id="franklin-svg-sprite" style="display: none"></svg>';
    svgSprite = div.firstElementChild;
    element.append(div.firstElementChild);
  }
  // Download all new icons
  const icons = [...element.querySelectorAll('span.icon')];
  await Promise.all(icons.map(async (span) => {
    const iconName = Array.from(span.classList).find((c) => c.startsWith('icon-')).substring(5);
    if (!ICONS_CACHE[iconName]) {
      ICONS_CACHE[iconName] = true;
      try {
        let dynamicIconsSharepointPath = 'https://www.bitdefender.com/common/icons/';
        if (window.location.hostname.includes('bitdefender.co.uk')) {
          dynamicIconsSharepointPath = 'https://www.bitdefender.co.uk/content/dam/franklin/';
        }
        if (window.location.hostname.includes('bitdefender.fr')) {
          dynamicIconsSharepointPath = 'https://www.bitdefender.fr/content/dam/franklin/';
        }
        // check for localhost
        if (window.location.hostname === 'localhost') {
          dynamicIconsSharepointPath = 'https://www.bitdefender.com/common/icons/';
        }
        const response = await fetch(`${dynamicIconsSharepointPath}${iconName}.svg`);
        if (!response.ok) {
          ICONS_CACHE[iconName] = false;
          return;
        }
        // Styled icons don't play nice with the sprite approach because of shadow dom isolation
        const svg = await response.text();
        if (svg.match(/(<style | class=)/)) {
          ICONS_CACHE[iconName] = { styled: true, html: svg };
        } else {
          ICONS_CACHE[iconName] = {
            html: svg
              .replace('<svg', `<symbol id="icons-sprite-${iconName}"`)
              .replace(/ width=".*?"/, '')
              .replace(/ height=".*?"/, '')
              .replace('</svg>', '</symbol>'),
          };
        }
      } catch (error) {
        ICONS_CACHE[iconName] = false;
        // eslint-disable-next-line no-console
        console.error(error);
      }
    }
  }));

  const symbols = Object
    .keys(ICONS_CACHE).filter((k) => !svgSprite.querySelector(`#icons-sprite-${k}`))
    .map((k) => ICONS_CACHE[k])
    .filter((v) => !v.styled)
    .map((v) => v.html)
    .join('\n');
  svgSprite.innerHTML += symbols;

  icons.forEach((span) => {
    const iconName = Array.from(span.classList).find((c) => c.startsWith('icon-')).substring(5);
    const parent = span.firstElementChild?.tagName === 'A' ? span.firstElementChild : span;
    // Styled icons need to be inlined as-is, while unstyled ones can leverage the sprite
    if (ICONS_CACHE[iconName].styled) {
      parent.innerHTML = ICONS_CACHE[iconName].html;
    } else {
      parent.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg"><use href="#icons-sprite-${iconName}"/></svg>`;
    }
  });
}

function decorateSections(main) {
  main.querySelectorAll(':scope > div').forEach((section) => {
    const wrappers = [];
    let defaultContent = false;
    [...section.children].forEach((e) => {
      if (e.tagName === 'DIV' || !defaultContent) {
        const wrapper = document.createElement('div');
        wrappers.push(wrapper);
        defaultContent = e.tagName !== 'DIV';
        if (defaultContent) wrapper.classList.add('default-content-wrapper');
      }
      wrappers[wrappers.length - 1].append(e);
    });
    wrappers.forEach((wrapper) => section.append(wrapper));
    section.classList.add('section');
  });
}

function decorateBlock(block) {
  const shortBlockName = block.classList[0];
  if (shortBlockName) {
    block.classList.add('block');
    block.dataset.blockName = shortBlockName;
    block.dataset.blockStatus = 'initialized';
    const blockWrapper = block.parentElement;
    blockWrapper.classList.add(`${shortBlockName}-wrapper`);
    const section = block.closest('.section');
    if (section) section.classList.add(`${shortBlockName}-container`);
  }
}

/**
 *
 * @param {String} path The path to the modal
 * @param {String} template The template to use for the modal styling
 * @returns {Promise<Element>}
 * @example
 */
export async function createModal(path, template) {
  const modalContainer = document.createElement('div');
  modalContainer.classList.add('modal-container');

  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');

  // fetch modal content
  console.log(path);
  const resp = await fetch(`${path}.plain.html`);

  if (!resp.ok) {
    // eslint-disable-next-line no-console
    console.error(`modal url cannot be loaded: ${path}`);
    return modalContainer;
  }

  const html = await resp.text();
  console.log(html);
  modalContent.innerHTML = html;

  // decorateMain(modalContent);
  // await loadBlock(modalContent);
  modalContainer.append(modalContent);

  // add class to modal container for opportunity to add custom modal styling
  if (template) modalContainer.classList.add(template);

  const closeModal = () => modalContainer.remove();
  const close = document.createElement('div');
  close.classList.add('modal-close');
  close.addEventListener('click', closeModal);
  modalContent.append(close);
  return modalContainer;
}

function decorateLinkedPictures(main) {
  console.log(main);
  console.log(main.querySelectorAll('picture'));
  main.querySelectorAll('picture').forEach((picture) => {
    // this condition checks if the picture is part of some content block ( rte )
    // and not a direct element in some DIV block
    // that could have different behaviour for some blocks (ex: columns )
    console.log(picture.closest('div.block'))
    console.log(picture.parentElement.tagName);
    if (picture.closest('div.block') && picture.parentElement.tagName !== 'DIV') {
      const next = picture.parentNode.nextElementSibling;
      console.log("next ", next);
      if (next) {
        const a = next.querySelector('a');
        const link = a?.textContent;
        /* Modal video */
        if (a && link.startsWith('https://') && link.includes('fragments')) {
          a.innerHTML = '';
          a.className = 'video-placeholder';
          a.appendChild(picture);
          const overlayPlayButton = document.createElement('span');
          overlayPlayButton.className = 'video-placeholder-play';
          a.appendChild(overlayPlayButton);
          a.addEventListener('click', async (event) => {
            event.preventDefault();
            // eslint-disable-next-line no-use-before-define
            const modalContainer = await createModal(link, 'video-modal');
            document.body.append(modalContainer);
          });
          const up = a.parentElement;
          if (up.childNodes.length === 1 && (up.tagName === 'P' || up.tagName === 'DIV')) {
            up.classList.add('modal-video-container');
          }
          return;
        }
        // Basic linked image
        if (a && link.startsWith('https://')) {
          a.innerHTML = '';
          a.className = 'linked-image';
          const pictureParent = picture.parentNode;
          a.append(picture);
          if (pictureParent.children.length === 0) {
            pictureParent.parentNode.removeChild(pictureParent);
          }
          const up = a.parentElement;
          if (up.childNodes.length === 1 && (up.tagName === 'P' || up.tagName === 'DIV')) {
            up.classList.add('linked-image-container');
          }
        }
      }
    }
  });
}

export async function loadComponent(offer, block, options, selector)  {
  const offerURL = new URL(offer);
  const origin = offerURL.origin;
  const offerFolder = offerURL.pathname.split("/").slice(0,-1).join("/");
  const container = selector ? document.querySelector(selector) : document.createElement('div');
  const shadowRoot = container.attachShadow({ mode: 'open' });

  shadowRoot.innerHTML = `<link rel="stylesheet" href="${origin}/_src/blocks/${block}/${block}.css" type="text/css">`;

  const [html, js] = await Promise.all([
    fetch(offer).then(r => r.text()),
    import(`${origin}/_src/blocks/${block}/${block}.js`)
  ])
  // If the block is a particle background, 
  // a new div is created and appended to the body so the external library can work
  if (block === "particle-background") {
    const newDiv = document.createElement('div');
    newDiv.style.display = "none";
    newDiv.innerHTML += html;
    updateLinkSources(newDiv, `${origin}${offerFolder}/`);
    document.body.appendChild(newDiv);
    await js.default(newDiv, {...options, metadata: parseMetadata(newDiv)});
    shadowRoot.appendChild(newDiv);
    newDiv.style.display = "block";
  } else {
    // in order to have a structure as close as possible as in franklin
    // when we import in aem, we also decorate the sections and the block
    // the functions are taken from lib-franklin.js
    let franklinHTMLStructure = document.createElement('div')
    franklinHTMLStructure.innerHTML = html;
    decorateSections(franklinHTMLStructure);
    decorateBlock(franklinHTMLStructure.querySelector(`.${block}`));
    shadowRoot.innerHTML +=  franklinHTMLStructure.innerHTML;
    updateLinkSources(shadowRoot, `${origin}${offerFolder}/`);
    await js.default(shadowRoot.querySelector('.section'), {...options, metadata: parseMetadata(shadowRoot)});
    decorateIcons(shadowRoot);
    decorateLinkedPictures(shadowRoot);
  }

  return container;
}
