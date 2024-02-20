export default function decorate(block) {
  const parentBlockStyle = block.closest('.section').style;
  const blockStyle = block.style;
  const metaData = block.closest('.section').dataset;
  const {
    contentSize, background_color, text_color, padding_top, padding_bottom, margin_top, margin_bottom
  } = metaData;
  const allImages = [...block.children];

  if (background_color) parentBlockStyle.backgroundColor = background_color;
  if (text_color) blockStyle.color = text_color;
  if (padding_top) blockStyle.paddingTop = `${padding_top}rem`;
  if (padding_bottom) blockStyle.paddingBottom = `${padding_bottom}rem`;
  if (margin_top) blockStyle.marginTop = `${margin_top}rem`;
  if (margin_bottom) blockStyle.marginBottom = `${margimargin_bottomnBottom}rem`;

  block.innerHTML = `
    <div id="carousel-box" class="container-fluidd-flex justify-between align-center">
      <div id="carousel">
        ${allImages.length ? allImages.map(item => `<div class="carousel-item d-flex align-center">${item.innerHTML}</div>`).join('') : ''}
      </div>
    </div>
  `;

  const carousel = block.querySelector('#carousel');
  const container = block.querySelector('#carousel-box');
  const items = block.querySelectorAll('.carousel-item');
  const visibleItems = 13;

  // set item width
  function setItemWidth() {
    const itemWidth = window.screen.width / visibleItems;
    items.forEach(item => {
      item.style.minWidth = `${itemWidth}px`;
    });
  }
  setItemWidth(); // Set initial item width
  window.addEventListener('resize', setItemWidth);

  // duplicate items in the carousel - for infinit loop
  function duplicateItems() {
    const clonedItems = Array.from(items).map(item => item.cloneNode(true));
    carousel.append(...clonedItems);
  }
  duplicateItems();

  let currentIndex = 0;
  function updateCarousel() {
    const itemWidth = container.clientWidth / visibleItems;
    carousel.style.transform = `translateX(${-currentIndex * itemWidth}px)`;
  }

  function next() {
    currentIndex++;
    duplicateItems(); // Duplicate items when reaching the end
    updateCarousel();
  }

  function prev() {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    updateCarousel();
  }

  // Set initial width and update on window resize
  window.addEventListener('resize', updateCarousel);
  updateCarousel();

  // Duplicate items periodically
  setInterval(duplicateItems, 4000);
  // Continuous scroll
  setInterval(next, 2000);
}
