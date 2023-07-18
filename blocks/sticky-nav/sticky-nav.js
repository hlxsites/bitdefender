function selectActiveMenu(event, activeItem, menuItems) {
  // remove current active menu
  menuItems.forEach((menuItem) => {
    menuItem.classList.remove('active');
  });

  activeItem.classList.add('active');
}

export default function decorate(block) {
  /* add css classes */
  const weContainerDiv = block.children[0];
  weContainerDiv.classList.add('we-container');

  const outerDiv = weContainerDiv.children[0];
  outerDiv.classList.add('outer');

  const ul = outerDiv.querySelector('ul');

  const innerWrapperDiv = document.createElement('div');
  innerWrapperDiv.className = 'inner-wrapper';
  innerWrapperDiv.appendChild(ul);
  outerDiv.appendChild(innerWrapperDiv);

  [...ul.children].forEach((li) => {
    const span = document.createElement('span');
    const a = li.querySelector('a');
    span.innerHTML = a.innerHTML;
    a.innerHTML = '';
    a.appendChild(span);
  });

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
