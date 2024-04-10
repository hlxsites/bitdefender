import { adobeMcAppendVisitorId, getDatasetFromSection } from '../../scripts/utils/utils.js';

export default async function decorate(block) {
  const [rte, pictureEl] = [...block.children[0].children];

  console.log('block quiz hero rte', rte);
  console.log('block quiz hero pictureEl', pictureEl.querySelector('picture'));

  // function appendPreloadedVideo() {
  //   const linkVideoEl = document.createElement('link');
  //   const linkVideoPosterEl = document.createElement('link');
  //   linkVideoEl.rel = 'preload';
  //   linkVideoEl.as = 'video';
  //   linkVideoEl.href = videoUrl;
  //   linkVideoEl.type = `video/${videoFormat}`;
  //
  //   linkVideoPosterEl.rel = 'preload';
  //   linkVideoPosterEl.as = 'image';
  //   linkVideoPosterEl.href = videoPlayerPoster;
  //
  //   document.head.prepend(linkVideoPosterEl);
  //   document.head.prepend(linkVideoEl);
  // }

  // appendPreloadedVideo();

  block.innerHTML = `
    <div class="rte-wrapper"></div>
    <div class="img-container">${pictureEl.querySelector('picture').innerHTML}</div>
    <div class="default-content-wrapper">
        ${rte.outerHTML}
    </div>
  `;

  block.querySelectorAll('.button-container > a').forEach((anchorEl) => {
    anchorEl.target = '_blank';
    anchorEl.rel = 'noopener noreferrer';
  });

  adobeMcAppendVisitorId('header');
}
