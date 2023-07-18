function expandItem(item) {
  const [, content] = item.children;
  content.style.height = `${content.scrollHeight}px`;
  const transitionEndCallback = () => {
    content.removeEventListener('transitionend', transitionEndCallback);
    content.style.height = 'auto';
  };
  content.addEventListener('transitionend', transitionEndCallback);
  item.classList.add('expanded');
}

function collapseItem(item) {
  const [, content] = item.children;
  content.style.height = `${content.scrollHeight}px`;
  requestAnimationFrame(() => {
    item.classList.remove('expanded');
    content.style.height = 0;
  });
}

export default function decorate(block) {
  const items = Array.from(block.querySelectorAll(':scope > div'));
  items.forEach((item) => {
    item.classList.add('accordion-item');
    const [header, content] = item.children;
    header.classList.add('accordion-item-header');
    content.classList.add('accordion-item-content');
    item.addEventListener('click', () => {
      if (!item.classList.contains('expanded')) {
        items.filter((i) => i.classList.contains('expanded')).forEach((i) => collapseItem(i));
        expandItem(item);
      } else {
        collapseItem(item);
      }
    });
  });
}
