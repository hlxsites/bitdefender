export default function decorate(block, options) {
  const {
    // eslint-disable-next-line no-unused-vars
    margintop,
  } = options ? options.metadata : block.closest('.section').dataset;
  console.log('testtetetetete 223232');
  if (options) {
    // eslint-disable-next-line no-param-reassign
    block = block.querySelector('.block');
    const blockParent = block.closest('.section');
    blockParent.classList.add('we-container');
    console.log('testtetetetete');
    console.log('options', options.metadata);
  }

  if (margintop) {
    const blockParent = block.closest('.section');
    blockParent.style.marginTop = `${margintop}px`;
  }

  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.innerHTML = row.innerHTML;

    ul.append(li);
  });

  block.textContent = '';
  block.append(ul);

  window.dispatchEvent(new CustomEvent('shadowDomLoaded'), {
    bubbles: true,
    composed: true, // This allows the event to cross the shadow DOM boundary
  });
}
