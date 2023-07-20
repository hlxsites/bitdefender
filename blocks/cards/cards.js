import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.innerHTML = row.innerHTML;
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.textContent = '';
  block.append(ul);

  const containers = document.querySelectorAll('.cards.barchart.block .cards-card-body');
  containers.forEach((container) => {
    const progressBars = container.querySelectorAll('li > ul');
    progressBars.forEach((progressBar, index) => {
      const value = parseFloat(progressBar.textContent);
      const label = progressBar.parentElement.firstChild.textContent.trim();

      let bar = progressBar.querySelector('.bar');

      if (!bar) {
        bar = document.createElement('span');
        bar.classList.add('bar');
        bar.style.width = `${(value / 6) * 100}%`;
        progressBar.appendChild(bar);

        const labelElement = document.createElement('span');
        labelElement.classList.add('bar-label');
        labelElement.textContent = label;
        bar.appendChild(labelElement);

        const valueElement = document.createElement('span');
        valueElement.classList.add('value-label');
        valueElement.textContent = value;
        bar.appendChild(valueElement);

        if (index === 0) {
          bar.classList.add('first-bar');
        }
      }
    });
  });
}
