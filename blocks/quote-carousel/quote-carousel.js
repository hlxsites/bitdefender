import { createTag } from '../../scripts/utils/utils.js';


function createSlide(item) {
  const quote = item.querySelector('p:not(:has(> strong, > em)):not(:empty)');
  const author = item.querySelector('p > strong');
  const description = item.querySelector('p > em');
  if (!quote) {
    return null;
  }
  return createTag(
    'div',
    { class: 'slide' },
    `<h4>${quote?.textContent}</h4>
<h5>${author?.textContent}</h5>
<p>${description?.textContent}</p>`,
  );
}

function getCurrentSlideIndex(slides) {
  return [...slides.children].findIndex((slide) => slide.classList.contains('active'));
}

function updateControls(block, nextIndex) {
  const dots = block.querySelector('.slides-dots');
  dots.querySelector('.active')?.classList.remove('active');
  dots.children[nextIndex]?.classList.add('active');
}

function updateSlide(nextIndex, block) {
  const slides = block.querySelector('.slides');
  const currentIndex = getCurrentSlideIndex(slides);
  slides.children[currentIndex].classList.remove('active');
  slides.children[nextIndex].classList.add('active');
  const translateX = 100;
  slides.style.transform = `translateX( ${-nextIndex * translateX}% )`;
  updateControls(block, nextIndex);
}

function addDotsListeners(dotsControls, slides) {
  [...dotsControls.children].forEach((dot, index) => {
    dot.addEventListener('click', (event) => {
      event.preventDefault();
      updateSlide(index, slides.parentElement);
    });
  });
}

export default function decorate(block) {
  const slides = createTag('div', { class: 'slides' });
  [...block.children]
    .map((item) => createSlide(item))
    .filter((item) => item)
    .forEach((item) => {
      slides.append(item);
    });
  slides.children[0].classList.add('selected');
  const dotsControls = createTag('ul', { class: 'slides-dots' });
  [...slides.children].forEach((slide, slideIndex) => {
    const btn = createTag('li', {}, '<button class="dot"><button>');
    btn.addEventListener('click', () => {
      updateSlide(slideIndex, block);
    });
    dotsControls.append(btn);
  });
  /* Add carousel action button if it exists */
  const slidesAction = createTag('div', { class: 'slides-action' });
  const button = block.querySelector('button');
  if (button) {
    slidesAction.append(button);
  }
  const slidesContainer = createTag('div', { class: 'slides-container' }, [slides, dotsControls, slidesAction]);
  block.replaceChildren(slidesContainer);
  updateControls(block, 0);
  addDotsListeners(dotsControls, slides);
}
