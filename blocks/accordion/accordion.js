export default function decorate(block) {
  block.querySelectorAll(':scope > div').forEach((item) => {
    item.classList.add('accordion-item');
    const [header, content] = item.children;
    header.classList.add('accordion-item-header');
    header.addEventListener('click', () => {
      if (!item.classList.contains('expanded')) {
        content.style.height = `${content.scrollHeight}px`;
      } else {
        content.style.height = 0;
      }
      item.classList.toggle('expanded');
    });
    content.classList.add('accordion-item-content');
  });
}
