export default function decorate(block) {
  block.classList.add('default-content-wrapper');
  const parentBlock = block.closest('.section');
  const parentBlockStyle = block.closest('.section').style;
  const blockStyle = block.style;
  const metaData = block.closest('.section').dataset;
  const {
    contentSize, background_color, background_hide, banner_hide, text_color, underlinedInclinedTextColor, textAlignVertical, imageAlign, padding_top, padding_bottom, margin_top, margin_bottom, image_cover
  } = metaData;
  const [contentEl, pictureEl, contentRightEl] = [...block.children];

  if (image_cover) {
    parentBlock.classList.add(`bckimg-${image_cover}`);
  }

  // tables from left content
  [...contentEl.querySelectorAll('table')].forEach((table) => {
    const aliasTr = table.querySelector('tr'); // 1st tr shoudlk have an identifier alias
  });

  if (background_color) parentBlockStyle.backgroundColor = background_color;
  if (text_color) blockStyle.color = text_color;
  if (underlinedInclinedTextColor) {
    block.querySelectorAll('em u').forEach((element) => {
      element.style.color = underlinedInclinedTextColor;
      element.style.fontStyle = 'normal';
      element.style.textDecoration = 'none';
    });
  }
  if (padding_top) blockStyle.paddingTop = `${padding_top}rem`;
  if (padding_bottom) blockStyle.paddingBottom = `${padding_bottom}rem`;
  if (margin_top) blockStyle.marginTop = `${margin_top}rem`;
  if (margin_bottom) blockStyle.marginBottom = `${margimargin_bottomnBottom}rem`;

  if (background_hide) parentBlock.classList.add(`hide-${background_hide}`);
  if (banner_hide) parentBlock.classList.add(`block-hide-${banner_hide}`);

  if (image_cover && image_cover === 'small') {
    blockStyle.background = `url(${pictureEl.querySelector('img').getAttribute('src').split('?')[0]}) no-repeat 0 0 / cover ${background_color || '#000'}`;
    block.innerHTML = `
    <div class="container-fluid">
        <div class="row d-none d-flex">
          <div class="col-5 ps-4">${contentEl.innerHTML}</div>
        </div>
        <div class="row d-lg-none justify-content-center">
          <div class="col-12 col-md-7 text-center">${contentEl.innerHTML}</div>
          <div class="col-12 p-0 text-center bck-img">
            ${pictureEl.innerHTML}
          </div>
        </div>
      </div>
    `;
  } else if (image_cover) {
    parentBlockStyle.background = `url(${pictureEl.querySelector('img').getAttribute('src').split('?')[0]}) no-repeat top center / 100% ${background_color || '#000'}`;

    if (image_cover === 'full-left') {
      parentBlockStyle.background = `url(${pictureEl.querySelector('img').getAttribute('src').split('?')[0]}) no-repeat top left / auto 100% ${background_color || '#000'}`;
    } else if (image_cover === 'full-center') {
      parentBlockStyle.background = `url(${pictureEl.querySelector('img').getAttribute('src').split('?')[0]}) no-repeat top center / auto 100% ${background_color || '#000'}`;
    } else if (image_cover === 'full-right') {
      parentBlockStyle.background = `url(${pictureEl.querySelector('img').getAttribute('src').split('?')[0]}) no-repeat top right / auto 100% ${background_color || '#000'}`;
    }

    block.innerHTML = `
    <div class="container-fluid">
      <div class="row d-flex ${contentRightEl ? 'justify-content-center' : ''}">
        <div class="col-12 col-md-${contentSize === 'half' ? '6' : '7'}">${contentEl.innerHTML}</div>
        ${contentRightEl ? `<div class="col-12 col-md-${contentSize === 'half' ? '6' : '5'}">${contentRightEl.innerHTML}</div>` : ''}
      </div>
      </div>
    `;
  } else {
    block.innerHTML = `
    <div class="container-fluid">
        <div class="row d-none d-flex">
          <div class="col-5 ps-4">${contentEl.innerHTML}</div>
          <div class="col-7 img-right bck-img">
            ${pictureEl.innerHTML}
          </div>
        </div>
        <div class="row d-lg-none justify-content-center">
          <div class="col-12 p-0 text-center bck-img">
            ${pictureEl.innerHTML}
          </div>
          <div class="col-12 col-md-7 text-center">${contentEl.innerHTML}</div>
        </div>
      </div>
    `;
  }

  if (textAlignVertical) {
    block.querySelector('.row').classList.add(`align-items-${textAlignVertical}`);
  }

  if (imageAlign) {
    block.querySelector('.img-right').style.textAlign = imageAlign;
  }
}
