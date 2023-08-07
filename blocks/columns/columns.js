function countSlides(carouselContent) {
  const numberOfItems = carouselContent.children.length;
  return Math.ceil(numberOfItems / 3);
}

function hideExcessElements() {
  const carousel = document.querySelector('.columns.carousel');
  const carouselContentImage = carousel.querySelector('.columns.carousel > div:nth-child(1)');
  const carouselContentText = carousel.querySelector('.columns.carousel > div:nth-child(2)');

  // Hide excess images
  const childImageDivs = carouselContentImage.querySelectorAll('.columns-img-col');
  for (let i = 3; i < childImageDivs.length; i++) {
    childImageDivs[i].style.display = 'none';
  }

  // Hide excess texts
  const childTextDivs = carouselContentText.querySelectorAll('div');
  for (let i = 3; i < childTextDivs.length; i++) {
    childTextDivs[i].style.display = 'none';
  }
}

function setActiveButton(button, buttonsWrapper) {
  // Remove active class from all buttons
  buttonsWrapper.querySelectorAll('button').forEach((btn) => {
    btn.classList.remove('active');
  });

  button.classList.add('active');
}

function createNavigationButtons(numberOfSlides) {
  const buttonsWrapper = document.createElement('div');
  buttonsWrapper.className = 'carousel-buttons';

  for (let i = 0; i < numberOfSlides; i++) {
    const button = document.createElement('button');
    button.addEventListener('click', function() {
      setActiveButton(button, buttonsWrapper);
    });
    buttonsWrapper.appendChild(button);
  }

  // By default, set the first button as the active button
  if (buttonsWrapper.firstChild) {
    buttonsWrapper.firstChild.classList.add('active');
  }

  return buttonsWrapper;
}

function setupCarousel(carousel) {
  const carouselContent = carousel.querySelector('.columns.carousel > div');

  // Determine the number of slides
  const numberOfSlides = countSlides(carouselContent);
  // Generate navigation buttons for the carousel
  const buttonsWrapper = createNavigationButtons(numberOfSlides);

  carousel.appendChild(buttonsWrapper);

  hideExcessElements();
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
