function embedYoutube(url, autoplay) {
  const usp = new URLSearchParams(url.search);
  const suffix = autoplay ? '&muted=1&autoplay=1' : '';
  let vid = usp.get('v') ? encodeURIComponent(usp.get('v')) : '';
  const embed = url.pathname;
  if (url.origin.includes('youtu.be')) {
    [, vid] = url.pathname.split('/');
  }
  return `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
      <iframe src="https://www.youtube.com${vid ? `/embed/${vid}?rel=0&v=${vid}${suffix}` : embed}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;"
      allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope; picture-in-picture" allowfullscreen="" scrolling="no" title="Content from Youtube" loading="lazy"></iframe>
    </div>`;
}

const loadVideoEmbed = (block, link, autoplay) => {
  if (block.dataset.embedIsLoaded) {
    return;
  }
  const url = new URL(link);

  const isYoutube = link.includes('youtube') || link.includes('youtu.be');

  if (isYoutube) {
    block.innerHTML = embedYoutube(url, autoplay);
  }

  block.dataset.embedIsLoaded = true;
};

export default async function decorate(block, options) {
  if (options) {
    // eslint-disable-next-line no-param-reassign
    block = block.querySelector('.block');
    const blockParent = block.closest('.section');
    blockParent.classList.add('we-container');

    // const images = document.querySelectorAll('picture');
    // images.forEach((image) => {
    //   let parentElement = image.parentElement;
    //   if (parentElement.tagName === 'A') {
    //     parentElement = parentElement.parentElement;
    //   }
    // });
  }

  const firstButton = block.querySelector('a.button');
  if (firstButton) {
    firstButton.classList.add('blue');
  }

  const link = block.querySelectorAll('a')[3].href;
  const wrapper = block.querySelector('.video-placeholder');
  wrapper.addEventListener('click', () => {
    loadVideoEmbed(block, link, true);
  });

  window.dispatchEvent(new CustomEvent('shadowDomLoaded'), {
    bubbles: true,
    composed: true, // This allows the event to cross the shadow DOM boundary
  });
}
