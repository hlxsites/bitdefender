function createContainer(parent, elements) {
  const container = document.createElement('div');
  container.classList.add('product-card-group');
  elements.forEach((g) => container.append(g));
  parent.append(container);
}

export default function decorate(block) {
  [...block.children].forEach((card) => {
    card.classList.add('product-card');
    let elements = [];
    [...(card.firstElementChild.children)].forEach((child) => {
      if (child.tagName === 'HR') {
        createContainer(card.firstElementChild, elements);
        elements = [];
      } else {
        elements.push(child);
      }
      child.remove();
    });
    if (elements.length) {
      createContainer(card.firstElementChild, elements);
    }
  });
}
