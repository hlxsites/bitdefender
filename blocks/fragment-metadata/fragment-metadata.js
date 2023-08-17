import { readBlockConfig } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  const { template } = readBlockConfig(block);

  if (template) {
    document.body.classList.add(template);
  }

  block.innerHTML = '';
}
