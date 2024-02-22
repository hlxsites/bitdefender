import { debounce } from '../../scripts/utils/utils.js';

export default async function decorate(block) {
  const SLIDE_SIZE = 240;
  const initialSlideList = [...block.children];
  function calculateSlideListBasedOnScreenWidth() {
    const result = {
      duplicatedSlides: null,
      slidesToShift: null,
    };

    const { clientWidth } = block;
    const spaceToFillMore = clientWidth - initialSlideList.length * SLIDE_SIZE; // ok
    if (spaceToFillMore < 0) {
      result.duplicatedSlides = initialSlideList.concat(initialSlideList);
      result.slidesToShift = initialSlideList;

      return result;
    }
    // fill space
    const fullWidthSlidesToFill = parseInt(spaceToFillMore / SLIDE_SIZE, 10);
    const hasPartialSlideToFill = clientWidth % SLIDE_SIZE !== 0;

    result.duplicatedSlides = Array(fullWidthSlidesToFill)
      .fill(initialSlideList).flatMap((slide) => slide);

    if (!hasPartialSlideToFill) {
      result.duplicatedSlides = result.duplicatedSlides.concat(result.duplicatedSlides);
      result.slidesToShift = result.duplicatedSlides;

      return result;
    }

    // need to apply the patch here
    result.duplicatedSlides = result.duplicatedSlides.concat(initialSlideList);
    result.slidesToShift = result.duplicatedSlides;
    result.duplicatedSlides = result.duplicatedSlides.concat(result.duplicatedSlides);

    return result;
  }

  function updateTranslation(slidesToShift) {
    const content = block.querySelector('.marquee-content');
    content.style.setProperty('--translateX', `${SLIDE_SIZE * slidesToShift.length}px`);
  }

  function render() {
    const { duplicatedSlides, slidesToShift } = calculateSlideListBasedOnScreenWidth();

    block.innerHTML = `
    <div class="marquee">
        <div class="marquee-content">
            ${duplicatedSlides.map((slide) => `<div class="marquee-item img-container">${slide.querySelector('picture').outerHTML}</div>`).join('')}
        </div>
    </div>
  `;

    updateTranslation(slidesToShift);
  }

  render();

  window.addEventListener('resize', debounce(render, 250));
}
