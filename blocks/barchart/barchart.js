import { createOptimizedPicture, setImageDimensions } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.innerHTML = row.innerHTML;
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'barchart-image';
      else div.className = 'barchart-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('img').forEach((img) => {
    const optimizedPicture = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    setImageDimensions(optimizedPicture, '46', '60');
    img.closest('picture').replaceWith(optimizedPicture);
  });
  block.textContent = '';
  block.append(ul);

  const containers = document.querySelectorAll('.barchart.block .barchart-body');
  containers.forEach((container) => {
    const progressBars = container.querySelectorAll('ul li:nth-child(odd)');
    progressBars.forEach((progressBar) => {
      const value = (parseFloat(progressBar.nextElementSibling.textContent / 6) * 100).toFixed(2);
      progressBar.style.setProperty('--bar-width', `${value}%`);
    });
  });
}
