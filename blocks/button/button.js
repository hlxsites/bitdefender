import { createModal } from '../../scripts/scripts.js';

export default function decorate(block) {
  if (block.classList.contains('modal')) {
    const modalPath = block.children[1]?.children[1]?.textContent;
    const modalTemplate = block.children[2]?.children[1]?.textContent;

    if (!modalPath) {
      // eslint-disable-next-line no-console
      console.error('modal block must have a path');
      return;
    }

    // remove metadata from block
    [...block.children].forEach((child, i) => {
      if (i > 0) child.remove();
    });

    const button = block.querySelector('a');
    const icon = block.querySelector('span.icon');
    if (button && icon) button.append(icon);

    button.addEventListener('click', async () => {
      const modalContainer = await createModal(modalPath, modalTemplate);
      document.body.append(modalContainer);
    });
  }
}
