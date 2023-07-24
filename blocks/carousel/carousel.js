function turnH3intoP() {
  const h3 = document.querySelectorAll('h3');
  h3.forEach((h3) => {
    const p = document.createElement('p');
    p.innerHTML = h3.innerHTML;
    h3.parentNode.replaceChild(p, h3);
  });
}

function wrapCarousel() {
  const carouselBlock = document.querySelector('.carousel.block');
  const carouselContainer = document.createElement('div');
  carouselContainer.className = 'carousel-container';

  const childDivs = carouselBlock.querySelectorAll(':scope > div');

  if (childDivs.length >= 4) {
    // Get the last four divs
    const lastFourDivs = Array.from(childDivs).slice(-4);

    lastFourDivs.forEach((div) => {
      carouselContainer.appendChild(div);
    });

    carouselBlock.appendChild(carouselContainer);
  }
}

export default function decorate(block) {
  turnH3intoP();
  wrapCarousel();
}
