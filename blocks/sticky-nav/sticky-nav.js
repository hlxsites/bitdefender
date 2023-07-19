export default function decorate(block) {
  const menu = block.querySelector('ul');
  menu.classList.add('menu');

  // remove intermediary divs
  block.replaceChildren(menu);

  const menuEntries = block.querySelectorAll('ul > li');

  const mobileMenu = document.createElement('ul');
  mobileMenu.className = 'mobile-menu';
  mobileMenu.appendChild(menuEntries[0].cloneNode(true));
  block.prepend(mobileMenu);

  /* listen to click event to visually select the menu item in the nav */
  menuEntries.forEach((li) => li.addEventListener('click', () => {
    menuEntries.forEach((menuItem) => {
      menuItem.classList.remove('active');
    });
    li.classList.add('active');
    mobileMenu.replaceChildren(li.cloneNode(true));
    mobileMenu.classList.remove('opened');
  }));

  /* listen to click event to open or close the menu on mobile */
  mobileMenu.addEventListener('click', (e) => {
    e.preventDefault();
    mobileMenu.classList.toggle('opened');
  });

  /* listen to scroll event to stick the nav on the top when necessary */
  document.addEventListener('scroll', () => {
    const wrapperTop = block.parentElement.offsetTop;
    if (window.scrollY >= wrapperTop) {
      block.classList.add('fixed-nav');
    } else {
      block.classList.remove('fixed-nav');
    }
  });
}
