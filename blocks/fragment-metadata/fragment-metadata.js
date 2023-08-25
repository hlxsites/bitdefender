import { readBlockConfig } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  const { template, 'open-url': openUrl } = readBlockConfig(block);

  if (template) {
    document.body.classList.add(template);
  }

  if (openUrl) {
    window.open(openUrl, '_self');
  }

  block.parentElement?.parentElement.remove();
}
