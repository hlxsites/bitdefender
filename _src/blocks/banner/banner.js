export default function decorate(block) {
  block.classList.add('default-content-wrapper');
  const parentBlock = block.closest('.section');
  const parentBlockStyle = block.closest('.section').style;
  const blockStyle = block.style;
  const metaData = block.closest('.section').dataset;
  const {
    contentSize, background_color, background_hide, banner_hide, text_color, underlinedInclinedTextColor, textAlignVertical, imageAlign, padding_top, padding_bottom, margin_top, margin_bottom, image_cover
  } = metaData;
  const [contentEl, pictureEl, contentRightEl, pictureMobileEl] = [...block.children];

  if (image_cover) {
    parentBlock.classList.add(`bckimg-${image_cover}`);
  }

  // tables from left content
  [...contentEl.querySelectorAll('table')].forEach((table) => {
    const aliasTr = table.querySelector('tr'); // 1st tr shoudlk have an identifier alias
  });

  if (background_color) block.closest('div.section').style.backgroundColor = background_color;
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

  if (image_cover) {
    parentBlockStyle.backgroundImage = `url(${pictureEl.querySelector('img').getAttribute('src').split('?')[0]})`;
    parentBlockStyle.backgroundRepeat = 'no-repeat';
    parentBlockStyle.backgroundPosition = 'right 0';
    parentBlockStyle.backgroundColor = background_color || '#000';

    if (image_cover === 'full-left-50') {
      parentBlockStyle.backgroundPosition = 'left 0';
      parentBlockStyle.backgroundSize = '50% auto';
    }

    if (image_cover === 'full-right-50') {
      parentBlockStyle.backgroundPosition = 'right 0';
      parentBlockStyle.backgroundSize = '50% auto';
    }
  }

  block.innerHTML = `
  <div class="d-flex align-end">
      <div class="banner-left">
        ${contentEl.innerHTML}
      </div>
      <div class="banner-right">
        <div class="text-right">${contentRightEl.innerHTML}</div>
        <div class="only-mobile">
          ${pictureMobileEl.innerHTML}
        </div>
      </div>
    </div>
  `;

  if (textAlignVertical) {
    block.querySelector('.row').classList.add(`align-items-${textAlignVertical}`);
  }

  if (imageAlign) {
    block.querySelector('.img-right').style.textAlign = imageAlign;
  }

  // creating scroll down icon:
  const mouseScrollDiv = `<div id="mouse-scroll">
    <div class="mouse">
      <div class="mouse-in"></div>
    </div>
    <div>
        <span class="down-arrow down-arrow-1"></span>
        <span class="down-arrow down-arrow-2"></span>
    </div>
  </div>`;

  if (!block.querySelector('#mouse-scroll')) {
    block.innerHTML += mouseScrollDiv;
  }
}
