export default function decorate(block) {
  const parentBlockStyle = block.closest('.section').style;
  const blockStyle = block.style;
  const metaData = block.closest('.section').dataset;
  const {
    has_button, background_color, text_color, padding_top, padding_bottom, margin_top, margin_bottom,
  } = metaData;

  if(has_button) {
    const buttonEl = block.children[0].children[0].lastElementChild;
    const newDiv = document.createElement('div');
    newDiv.append(buttonEl);
    block.append(newDiv);
  }

  if (background_color) parentBlockStyle.backgroundColor = background_color;
  if (text_color) blockStyle.color = text_color;
  if (padding_top) blockStyle.paddingTop = `${padding_top}rem`;
  if (padding_bottom) blockStyle.paddingBottom = `${padding_bottom}rem`;
  if (margin_top) blockStyle.marginTop = `${margin_top}rem`;
  if (margin_bottom) blockStyle.marginBottom = `${margin_bottom}rem`;
}
