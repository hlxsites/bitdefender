export default function decorate(block) {
  block.querySelectorAll(':scope > div').forEach((item) => {
    item.classList.add('accordion-item');
    const [header, content] = item.children;
    header.classList.add('accordion-item-header');
    header.addEventListener('click', () => {
      item.classList.toggle('accordion-item-open');
    });
    content.classList.add('accordion-item-content');
  });
}
