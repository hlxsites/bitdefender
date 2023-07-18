export default function decorate(block) {
  const items = Array.from(block.querySelectorAll(':scope > div'));
  items.forEach((item) => {
    item.classList.add('accordion-item');
    const [header, content] = item.children;
    header.classList.add('accordion-item-header');
    item.addEventListener('click', () => {
      if (!item.classList.contains('expanded')) {
        items.filter((i) => i.classList.contains('expanded')).forEach((i) => {
          i.classList.remove('expanded');
          i.children[1].style.height = 0;
        });
        content.style.height = `${content.scrollHeight}px`;
        const transitionEndCallback = () => {
          content.removeEventListener('transitionend', transitionEndCallback);
          content.style.height = 'auto';
          console.log('transitionend');
        };
        content.addEventListener('transitionend', transitionEndCallback);
        item.classList.add('expanded');
      } else {
        content.style.height = `${content.scrollHeight}px`;
        requestAnimationFrame(() => {
          item.classList.remove('expanded');
          content.style.height = 0;
        });
      }
    });
    content.classList.add('accordion-item-content');
  });
}
