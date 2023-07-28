import { createModal } from '../../scripts/scripts.js';

export default function decorate(block) {
  const placeholder = block.querySelector('picture');
  const videoFragmentPath = block.querySelector('p:last-of-type');
  block.textContent = '';

  if (placeholder && videoFragmentPath) {
    const wrapper = document.createElement('div');
    wrapper.className = 'video-placeholder';
    wrapper.innerHTML = '<div class="video-placeholder-play"><button title="Play"></button></div>';
    wrapper.prepend(placeholder);
    wrapper.addEventListener('click', async () => {
      const modalContainer = await createModal(videoFragmentPath.outerText, 'video-modal');
      document.body.append(modalContainer);
    });
    block.append(wrapper);
  }
}
