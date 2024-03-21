import { adobeMcAppendVisitorId, getDatasetFromSection } from '../../scripts/utils/utils.js';

export default async function decorate(block) {
  const [rte, videoUrlEl] = [...block.children];

  const videoUrl = videoUrlEl.textContent.trim();
  const videoFormat = videoUrl.split('.').pop();

  const blockDataset = getDatasetFromSection(block);
  const { videoPlayerSettings, videoPlayerPoster } = blockDataset;

  function appendPreloadedVideo() {
    const linkElement = document.createElement('link');
    linkElement.rel = 'preload';
    linkElement.as = 'video';
    linkElement.href = videoUrl;
    linkElement.type = `video/${videoFormat}`;
    document.head.prepend(linkElement);
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
    <div class="rte-wrapper"></div>
    <div class="video-wrapper">
        <div class="gradient-1"></div>
        <div class="gradient-2"></div>
        <div class="gradient-3"></div>
        <video ${formattedVideoSettings} poster="${videoPlayerPoster}">
          <source src="${videoUrl}" type="video/${videoFormat}">
        </video>
    </div>
    <div class="default-content-wrapper">
        ${rte.innerHTML}
    </div>
  `;

  block.querySelectorAll('.button-container > a').forEach((anchorEl) => {
    anchorEl.target = '_blank';
    anchorEl.rel = 'noopener noreferrer';
  });

  adobeMcAppendVisitorId('header');
}
