function countSlides(carouselContent) {
  const numberOfItems = carouselContent.children.length;
  return Math.ceil(numberOfItems / 3);
}

function showSlides(carousel, slideNumber) {
  const carouselContentImage = carousel.querySelector('.columns.carousel > div:nth-child(1)');
  const carouselContentText = carousel.querySelector('.columns.carousel > div:nth-child(2)');

  // Common function to handle showing of slides
  function handleSlideDisplay(childDivs) {
    // Hide all elements
    childDivs.forEach((div) => { div.style.opacity = '0'; });

    // Calculate the start and end for the items to display based on slideNumber
    let start;
    let end;

    if (childDivs.length % 3 === 0) {
      // Non-overlapping
      start = slideNumber * 3;
      end = start + 3;
    } else {
      // Overlapping logic
      start = slideNumber * 2; // from 2x the slide number to account for overlapping element
      end = start + 3;

      if (end > childDivs.length) {
        // Adjust start to always show 3 items
        start = childDivs.length - 3;
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
    console.log('slide left');
    carouselContentImage.classList.add('slide-left');
    carouselContentText.classList.add('slide-left');
  } else if (clickedButtonIndex < activeButtonIndex) {
    console.log('slide right');
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

  const numberOfSlides = countSlides(carouselContent);
  const buttonsWrapper = createNavigationButtons(numberOfSlides, carousel);

  carousel.appendChild(buttonsWrapper);
  hideExcessElements(carousel);
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
