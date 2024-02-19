export default function decorate(block) {
  const blockParent = block.closest('.image-columns-container');
  const { background_color, type } = blockParent.dataset;
  const cols = [...block.firstElementChild.children];

  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          const imgContainer = document.createElement('div');
          imgContainer.classList.add('img-container');
          imgContainer.append(picWrapper.children[0]);
          picWrapper.append(imgContainer);
          // picture is only content in column
          picWrapper.classList.add('image-columns-img-coll');
        }

        const backPosition = type.split('mg-full-')[1];
        blockParent.style.background = `url(${pic.querySelector('img').getAttribute('src').split('?')[0]}) ${backPosition} 0 / 50% auto no-repeat ${background_color || '#000'}`;
      } else {
        col.classList.add('image-columns-txt-col');
      }
    });
  });
}
