export default function decorate(block) {
  block.classList.add('default-content-wrapper');
  const parentBlock = block.closest('.section');
  const parentBlockStyle = parentBlock.style;
  const blockStyle = block.style;
  const metaData = parentBlock.dataset;
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
        return `<div class="slider-item">
          <div class="slider-text">${sliderText.innerHTML}</div>
          <div class="slider-image">${sliderImage.innerHTML}</div>
        </div>`;
      }).join('') : ''}
    </div>
  `;

  const items = parentBlock.getElementsByClassName("slider-item");
  let allItemsSeen = false;

parentBlock.addEventListener("wheel", handleWheel);

function handleWheel(evt) {
    if (!allItemsSeen) {
        evt.preventDefault();
        const delta = evt.deltaY || evt.deltaX;

        if (delta !== 0) {
            parentBlock.scrollLeft += delta;
        }

        // Check if all items have been seen
        const firstItem = items[0];
        const lastItem = items[items.length - 1];
        const parentLeft = parentBlock.getBoundingClientRect().left;
        const parentRight = parentBlock.getBoundingClientRect().right;

        if (delta > 0 && lastItem.getBoundingClientRect().right <= parentRight) {
            // Scrolling down and all items have been seen
            allItemsSeen = true;
            removePreventDefault();
        } else if (delta < 0 && firstItem.getBoundingClientRect().left >= parentLeft) {
            // Scrolling up and reached the first item
            allItemsSeen = true;
            removePreventDefault();
        }
    }
}

function removePreventDefault() {
    // Remove the event listener to stop preventing default behavior
    parentBlock.removeEventListener("wheel", handleWheel);
    // Enable scrolling again when scrolling back up or down
    parentBlock.addEventListener("wheel", handleRevertScroll);

    function handleRevertScroll(evt) {
        const delta = evt.deltaY || evt.deltaX;

        if (delta !== 0) {
            parentBlock.scrollLeft += delta;

            // Check if scrolling down and all items have been seen
            if (delta > 0 && allItemsSeen) {
                allItemsSeen = false;
                // Reattach the original event listener
                parentBlock.addEventListener("wheel", handleWheel);
                // Remove the revert scroll event listener
                parentBlock.removeEventListener("wheel", handleRevertScroll);
            } else if (delta < 0 && allItemsSeen) {
                allItemsSeen = false;
                // Reattach the original event listener
                parentBlock.addEventListener("wheel", handleWheel);
                // Remove the revert scroll event listener
                parentBlock.removeEventListener("wheel", handleRevertScroll);
            }
        }
    }
}

  /* parentBlock.addEventListener("wheel", (evt) => {
    evt.preventDefault();
    parentBlock.scrollLeft += evt.deltaY;
    // console.log(evt.deltaY)
  }); */
}
