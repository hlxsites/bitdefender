import { getDatasetFromSection } from '../../scripts/utils/utils.js';

export default async function decorate(block) {
  const blockDataset = getDatasetFromSection(block);
  const backgrounds = blockDataset.backgrounds.split(',');

  const boxes = [...block.children[0].children];

  block.innerHTML = `
    <div class="main-wrapper">
        ${boxes.map((box) => `
          <div class="col"><div class="img-wrapper">${box.innerHTML}</div></div>
        `).join('')}
    </div>
  `;

  const cols = [...block.querySelectorAll('.col')];

  backgrounds.forEach((bg, index) => {
    cols[index].style.setProperty('--backgroundColor', bg);
  });
}
