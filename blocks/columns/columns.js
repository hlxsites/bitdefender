function getItemsToShow() {
  if (window.innerWidth <= 767) {
    return 1; // Show 1 item for mobile screens
  } if (window.innerWidth <= 990) {
    return 2; // Show 2 items for tablets
  }
  return 3; // Show 3 items for desktops
}

function countSlides(carouselContent) {
  const numberOfItems = carouselContent.children.length;
  return Math.ceil(numberOfItems / getItemsToShow());
}

function showSlides(carousel, slideNumber) {
  const carouselContentImage = carousel.querySelector('.columns.carousel > div:nth-child(1)');
  const carouselContentText = carousel.querySelector('.columns.carousel > div:nth-child(2)');

  function handleSlideDisplay(childDivs) {
    // Hide all elements
    childDivs.forEach((div) => { div.style.opacity = '0'; });

    // Calculate the start and end for the items to display based on slideNumber
    let start;
    let end;

    const itemsToShow = getItemsToShow();

    if (childDivs.length % itemsToShow === 0) {
      start = slideNumber * itemsToShow;
      end = start + itemsToShow;
    } else {
      start = slideNumber * (itemsToShow - 1);
      end = start + itemsToShow;

      if (end > childDivs.length) {
        start = childDivs.length - itemsToShow;
        end = childDivs.length;
      }
    }

    for (let i = start; i < end && i < childDivs.length; i += 1) {
      childDivs[i].style.opacity = '1';
    }
  }

  // Apply the display logic for both images and texts
  handleSlideDisplay(carouselContentImage.querySelectorAll('.columns-img-col'));
  handleSlideDisplay(carouselContentText.querySelectorAll('div'));
}

function hideExcessElements(carousel) {
  showSlides(carousel, 0); // Default: Show the first set of three elements

  const carouselContentImage = carousel.querySelector('.columns.carousel > div:nth-child(1)');
  const carouselContentText = carousel.querySelector('.columns.carousel > div:nth-child(2)');

  // Assign the 'slide-right' class to both the image and text sections
  carouselContentImage.classList.add('slide-right');
  carouselContentText.classList.add('slide-right');
}

function getButtonIndex(button) {
  const buttons = Array.from(button.parentElement.children);
  return buttons.indexOf(button);
}

function setActiveButton(button, buttonsWrapper, carousel) {
  const activeButton = buttonsWrapper.querySelector('.active');
  // Determine the index of the active button and the clicked button
  const activeButtonIndex = getButtonIndex(activeButton);
  const clickedButtonIndex = getButtonIndex(button);

  const carouselContentImage = carousel.querySelector('.columns.carousel > div:nth-child(1)');
  const carouselContentText = carousel.querySelector('.columns.carousel > div:nth-child(2)');

  // Clear any previous slide classes
  carouselContentImage.classList.remove('slide-left', 'slide-right');
  carouselContentText.classList.remove('slide-left', 'slide-right');

  if (clickedButtonIndex > activeButtonIndex) {
    carouselContentImage.classList.add('slide-left');
    carouselContentText.classList.add('slide-left');
  } else if (clickedButtonIndex < activeButtonIndex) {
    carouselContentImage.classList.add('slide-right');
    carouselContentText.classList.add('slide-right');
  }

  // Remove active class from all buttons
  buttonsWrapper.querySelectorAll('button').forEach((btn) => {
    btn.classList.remove('active');
  });

  button.classList.add('active');
}

function createNavigationButtons(numberOfSlides, carousel) {
  const buttonsWrapper = document.createElement('div');
  buttonsWrapper.className = 'carousel-buttons';

  for (let i = 0; i < numberOfSlides; i += 1) {
    const button = document.createElement('button');
    button.setAttribute('aria-label', `Slide ${i + 1}`);

    button.addEventListener('click', () => {
      // Return early if the button clicked is already active
      if (button.classList.contains('active')) {
        return;
      }

      showSlides(carousel, i);
      setActiveButton(button, buttonsWrapper, carousel);
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

  // Remove existing navigation buttons
  const existingButtonsWrapper = carousel.querySelector('.carousel-buttons');
  if (existingButtonsWrapper) {
    existingButtonsWrapper.remove();
  }

  const numberOfSlides = countSlides(carouselContent);
  const buttonsWrapper = createNavigationButtons(numberOfSlides, carousel);

  carousel.appendChild(buttonsWrapper);
  hideExcessElements(carousel);
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
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

  // Add a debounced event listener to handle window resizes
  window.addEventListener('resize', debounce(() => {
    // Check if the block still has the carousel class before resetting
    if (block.classList.contains('carousel')) {
      setupCarousel(block);
    }
  }, 250));
}
