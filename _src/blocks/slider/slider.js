export default function decorate(block) {
  block.classList.add('default-content-wrapper');
  const parentBlockStyle = block.closest('.section').style;
  const blockStyle = block.style;
  const metaData = block.closest('.section').dataset;
  const {
    type, background_color, text_color, padding_top, padding_bottom, margin_top, margin_bottom
  } = metaData;
  const allSliders = [...block.children];

  if (background_color) parentBlockStyle.backgroundColor = background_color;
  if (text_color) blockStyle.color = text_color;
  if (padding_top) blockStyle.paddingTop = `${padding_top}rem`;
  if (padding_bottom) blockStyle.paddingBottom = `${padding_bottom}rem`;
  if (margin_top) blockStyle.marginTop = `${margin_top}rem`;
  if (margin_bottom) blockStyle.marginBottom = `${margimargin_bottomnBottom}rem`;

 block.innerHTML = `
    <div class="container-fluid d-flex justify-between align-center">
      ${allSliders.length ? allSliders.map(item => {
        const [ sliderText, sliderImage ] = [...item.children];
        return `<div class="slider d-flex align-center">
          <div class="slider-text">${sliderText.innerHTML}</div>
          <div class="slider-image">${sliderImage.innerHTML}</div>`;
      }).join('') : ''}
    </div>
  `;
}
