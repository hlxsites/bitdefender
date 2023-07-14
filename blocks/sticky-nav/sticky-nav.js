function selectActiveMenu(event, activeItem, menuItems) {
  // remove current active menu
  menuItems.forEach((menuItem) => {
    menuItem.classList.remove('active');
  });

  activeItem.classList.add('active');
}

export default function decorate(block) {
  /* change to ul, li and divs to match original css */
  const wcDiv = document.createElement('div');
  wcDiv.className = 'we-container';

  const outerDiv = document.createElement('div');
  outerDiv.className = 'outer';
  wcDiv.append(outerDiv);

  const innderDiv = document.createElement('div');
  innderDiv.className = 'inner-wrapper';
  outerDiv.append(innderDiv);

  const ul = document.createElement('ul');

  [...block.children[0].children].forEach((row) => {
    const li = document.createElement('li');
    const a = row.querySelector('a');
    const span = document.createElement('span');
    span.innerHTML = a.innerHTML;
    a.innerHTML = '';
    a.append(span);
    li.append(a);

    ul.append(li);
  });
  innderDiv.append(ul);

  block.textContent = '';
  block.classList.add('more-items');
  block.append(wcDiv);

  /* listen to scroll event to stick the nav on the top when necessary */
  document.addEventListener('scroll', () => {
    const wrapperTop = block.parentElement.offsetTop - 10;
    if (window.scrollY >= wrapperTop) {
      block.classList.add('fixed-nav');
    } else {
      block.classList.remove('fixed-nav');
    }
  });

  /* listen to click event to visually select the menu item in the nav */
  const menuEntries = ul.querySelectorAll('ul > li');
  menuEntries.forEach((li) => li.addEventListener('click', (event) => selectActiveMenu(event, li, menuEntries)));
}
