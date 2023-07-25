function createDivider() {
  const paragraphs = document.querySelectorAll('.carousel.block > div > div > p:first-child');

  paragraphs.forEach(p => {
    const divider = document.createElement('hr');
    p.after(divider);
  });
}

function createNextButtons() {
  const carousel = document.querySelector('.carousel.block');
  const carouselItems = carousel.children;
  const numOfChildren = carouselItems.length;

  const titleDescription = document.querySelectorAll('.carousel.block > div > div > p:last-child');
  titleDescription.forEach((element, index) => {
    const nextButtons = document.createElement('div');
    nextButtons.classList.add('next-buttons');
    element.after(nextButtons);

    for (let i = 0; i < numOfChildren; i++) {
      const circle = document.createElement('span');
      circle.classList.add('circle');
      if (i === index) {
        circle.classList.add('active'); // set the circle of the current carousel item as active
      }
      circle.addEventListener('click', () => {
        document.querySelector('.carousel.block > div.active').classList.remove('active'); // hide the previously visible carousel item
        carouselItems[i].classList.add('active'); // show the selected carousel item
        document.querySelector('.circle.active').classList.remove('active'); // deactivate the previously active circle
        circle.classList.add('active'); // activate the clicked circle
      });
      nextButtons.appendChild(circle);
    }
  });

  // make the first carousel item visible by default
  carouselItems[0].classList.add('active');
}

export default function decorate() {
  createDivider();
  createNextButtons();
}
