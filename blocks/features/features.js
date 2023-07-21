function movePictureOverH1() {
  const parentDivs = document.querySelectorAll('.features > div');

  parentDivs.forEach((parentDiv) => {
    Array.from(parentDiv.children).forEach((childDiv) => {
      const h1 = childDiv.querySelector('h1');
      const picture = childDiv.querySelector('picture');
      const pWithText = childDiv.querySelector('p:last-of-type');

      if (h1 && picture && pWithText) {
        const newP = document.createElement('p');
        newP.innerHTML = h1.innerHTML;

        newP.classList.add('heading');

        const pWithPicture = picture.parentNode;
        pWithPicture.removeChild(picture);
        childDiv.innerHTML = '';
        childDiv.appendChild(picture);
        // Append newP instead of h1
        childDiv.appendChild(newP);
        childDiv.appendChild(pWithText);
      }
    });
  });
}

export default function decorate(block) {
  if (block.classList.contains('with-h1')) {
    movePictureOverH1();
  }
}
