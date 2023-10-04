import { decorateIcons } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.innerHTML = row.innerHTML;
    li.children[1]?.classList.add('barchart-body');
    ul.append(li);
  });

  ul.querySelectorAll('.barchart-body').forEach((container) => {
    const progressBars = container.querySelectorAll('ul li:nth-child(odd)');
    progressBars.forEach((progressBar) => {
      const value = (parseFloat(progressBar.nextElementSibling.textContent / 6) * 100).toFixed(2);
      progressBar.style.setProperty('--bar-width', `${value}%`);
    });
  });

  await decorateIcons(ul);

  block.innerHTML = ul.outerHTML;
}
