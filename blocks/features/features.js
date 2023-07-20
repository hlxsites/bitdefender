function movePictureOverH1() {
  const parentDivs = document.querySelectorAll('.features > div');

  parentDivs.forEach((parentDiv) => {
    Array.from(parentDiv.children).forEach((childDiv) => {
      const h1 = childDiv.querySelector('h1');
      const picture = childDiv.querySelector('picture');
      const pWithText = childDiv.querySelector('p:last-of-type');

      if (h1 && picture && pWithText) {
        const pWithPicture = picture.parentNode;
        pWithPicture.removeChild(picture);
        childDiv.innerHTML = '';
        childDiv.appendChild(picture);
        childDiv.appendChild(h1);
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
