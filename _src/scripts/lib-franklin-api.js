/**
 * @param {HTMLDivElement} shadoRoot
 */
const parseMetadata = (shadowRoot) => {
  const metadata = {};
  const sectionMetadata = shadowRoot.querySelector(".section-metadata");

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
  console.log('decorateIcons', element, svgSprite)

  // Download all new icons
  const icons = [...element.querySelectorAll('span.icon')];
  await Promise.all(icons.map(async (span) => {
    const iconName = Array.from(span.classList).find((c) => c.startsWith('icon-')).substring(5);
    if (!ICONS_CACHE[iconName]) {
      ICONS_CACHE[iconName] = true;
      try {
        let dynamicIconsSharepointPath = '/icons/';
        // check for localhost
        if (window.location.hostname === 'localhost') {
          dynamicIconsSharepointPath = 'https://www.bitdefender.com/icons/';
        }
        const response = await fetch(`${dynamicIconsSharepointPath}${iconName}.svg`);
        if (!response.ok) {
          ICONS_CACHE[iconName] = false;
          return;
        }
        // Styled icons don't play nice with the sprite approach because of shadow dom isolation
        const svg = await response.text();
        console.log('svg', svg)
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
      console.log('unstyled', parent.innerHTML)
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

  shadowRoot.innerHTML +=  html;
  updateLinkSources(shadowRoot, `${origin}${offerFolder}/`);
  decorateIcons(shadowRoot);

  console.log(ICONS_CACHE)
  await js.default(shadowRoot, {...options, metadata: parseMetadata(shadowRoot)});

  return container;
}
