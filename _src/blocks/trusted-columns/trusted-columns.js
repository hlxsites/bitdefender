import { isView } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const cols = [...block.children[0].children];
  let isMobileView = isView('mobile');

  function render() {
    block.innerHTML = `
    <div class="container">
      <div class="col-container">
        ${cols.map((col) => {
          const pictureEl = col.querySelector('picture');
          const richTextEls = [...col.children];
          if (richTextEls.length === 1) {
            richTextEls.shift();
          }

          

          return `
            <div class="col">
              <div class="img-container">
                ${pictureEl ? pictureEl.outerHTML : ''}
              </div>

              ${isMobileView ? `<div class="default-content-wrapper d-flex${richTextEls.length ? ' col-text' : ''}">
                ${richTextEls.map((item) => item.outerHTML).join('')}
              </div>` : ''}
            </div>`;
        }).join('')}
      </div>

      ${!isMobileView ? `<div class="centered-wrapper default-content-wrapper d-flex">
        ${cols.map((col) => {

          const richTextEls = [...col.children];
      if (richTextEls.length === 1) {
        richTextEls.shift();
      }


          return `<div class="col${richTextEls.length ? ' col-text' : ''}">${richTextEls.map((item) => item.outerHTML).join('')}</div> `;
        }).join('')}
      </div>` : ''}
    </div>
  `;

  const resizeObserver = new ResizeObserver(() => {
    const newViewportView = isView('mobile');
    const viewHasChanged = isMobileView !== newViewportView;

    if (viewHasChanged) {
      isMobileView = newViewportView;
      render();
    }
  });
  resizeObserver.observe(block);
}

render();
}
