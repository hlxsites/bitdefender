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
    // check if .accordion-item-content has a <p>
    const p = content.querySelector('p');
    // if it doesn't, add a <p> and move the content inside
    if (!p) {
      const newP = document.createElement('p');
      newP.innerHTML = content.innerHTML;
      content.innerHTML = '';
      content.appendChild(newP);
    }

    item.addEventListener('click', () => {
      if (!item.classList.contains('expanded')) {
        items.filter((i) => i.classList.contains('expanded')).forEach((i) => collapseItem(i));
        expandItem(item);
      } else {
        collapseItem(item);
      }
    });
  });

  if (block.classList.contains('first-open')) {
    items[0].classList.add('expanded')
  }
}
