import { getDatasetFromSection } from '../../scripts/utils/utils.js';

export default async function decorate(block) {
  const [rte, videoUrlEl] = [...block.children];

  const state = {
    isVideoPlaying: false,
  };

  const videoUrl = videoUrlEl.textContent.trim();
  const videoFormat = videoUrl.split('.').pop();

  const blockDataset = getDatasetFromSection(block);
  const { videoPlayerSettings, videoPlayerPoster } = blockDataset;

  function appendPreloadedVideo() {
    const linkVideoEl = document.createElement('link');
    const linkVideoPosterEl = document.createElement('link');
    linkVideoEl.rel = 'preload';
    linkVideoEl.as = 'video';
    linkVideoEl.href = videoUrl;
    linkVideoEl.type = `video/${videoFormat}`;

    linkVideoPosterEl.rel = 'preload';
    linkVideoPosterEl.as = 'image';
    linkVideoPosterEl.href = videoPlayerPoster;

    document.head.prepend(linkVideoPosterEl);
    document.head.prepend(linkVideoEl);
  }

  appendPreloadedVideo();

  const formattedVideoSettings = videoPlayerSettings
    .split(',')
    .map((item) => {
      let newStr = item;
      if (newStr.includes('=')) {
        newStr = item.replace('=', '="');
        newStr = `${newStr}"`;

        return newStr;
      }

      return newStr.trim();
    })
    .join(' ');

  block.innerHTML = `
    <div class="default-content-wrapper">
        <div class="rte-wrapper">${rte.innerHTML}</div>
        <div class="video-wrapper">
            <a class="video-placeholder">
                <span class="video-placeholder-play"></span>
<!--                <span class="video-placeholder-pause"></span>-->
            </a>
            <video ${formattedVideoSettings} poster="${videoPlayerPoster}">
              <source src="${videoUrl}" type="video/${videoFormat}">
            </video>
        </div>
<!--        <div class="scroll-down">Scroll down</div>-->
    </div>
  `;

  const playAnchor = block.querySelector('.video-placeholder');
  const videoElement = block.querySelector('video');

  playAnchor.addEventListener('click', (event) => {
    event.preventDefault();
    playAnchor.classList.toggle('play');
    state.isVideoPlaying = !state.isVideoPlaying;

    // eslint-disable-next-line no-unused-expressions
    if (state.isVideoPlaying) {
      videoElement.play();
      setTimeout(() => {
        playAnchor.classList.add('playing');
      }, 250);
    } else {
      videoElement.pause();
      setTimeout(() => {
        playAnchor.classList.remove('playing');
      }, 250);
    }
  });

  block.querySelectorAll('.button-container > a').forEach((anchorEl) => {
    anchorEl.target = '_blank';
    anchorEl.rel = 'noopener noreferrer';
  });

  // adobeMcAppendVisitorId('header');
}
