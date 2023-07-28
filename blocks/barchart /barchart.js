import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  /* change to ul, li */
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
  ul.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.textContent = '';
  block.append(ul);

  const containers = document.querySelectorAll('.barchart.block .barchart-body');
  containers.forEach((container) => {
    const progressBars = container.querySelectorAll('ul');
    progressBars.forEach((progressBar) => {
      progressBar.setAttribute('data-bar-chart', 'true');
      let value = `${(parseFloat(progressBar.lastElementChild.textContent) / 6) * 100}%`;
      progressBar.style.setProperty('--bar-width', value);
    }
    )
  }
  )
}
