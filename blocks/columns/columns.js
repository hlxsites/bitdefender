function setupCarousel(carousel) {
  // Use the provided CSS selector to get all columns that need to be in the carousel
  const items = Array.from(carousel.querySelectorAll('.columns.carousel > div > div.columns-img-col:nth-child(n+4), .columns.carousel > div:nth-child(2) > div:nth-child(n+4)'));
  let currentIndex = 0;

  function showItemsFromIndex(index) {
    // Hide all items first
    items.forEach(item => item.style.display = 'none');

    // Show the next three items
    for (let i = index; i < (index + 3) && i < items.length; i++) {
      items[i].style.display = 'block';
    }
  }

  const nextButton = document.createElement('button');
  nextButton.addEventListener('click', function () {
    currentIndex = (currentIndex + 3) % items.length;
    showItemsFromIndex(currentIndex);
  });

  const prevButton = document.createElement('button');
  prevButton.addEventListener('click', function () {
    currentIndex -= 3;
    if (currentIndex < 0) {
      currentIndex = items.length - 3;
    }
    showItemsFromIndex(currentIndex);
  });

  carousel.appendChild(prevButton);
  carousel.appendChild(nextButton);

  // Initially show the first three items
  showItemsFromIndex(currentIndex);
}

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });

  // If it has the carousel class, then setup the carousel
  if (block.classList.contains('carousel')) {
    setupCarousel(block);
  }
}
