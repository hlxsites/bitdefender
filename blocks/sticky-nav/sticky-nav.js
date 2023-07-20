/* eslint-disable max-len */
export default function decorate(block) {
  const menu = block.querySelector('ul');
  menu.classList.add('menu');

  // remove intermediary divs
  block.replaceChildren(menu);

  const menuEntries = block.querySelectorAll('ul > li');

  const mobileDropDown = document.createElement('div');
  mobileDropDown.className = 'mobile-dropdown';
  mobileDropDown.innerText = menuEntries[0].innerText;
  block.prepend(mobileDropDown);

  /* listen to click event to open or close the dropdown menu on mobile */
  mobileDropDown.addEventListener('click', (e) => {
    e.preventDefault();
    mobileDropDown.classList.toggle('opened');
  });

  menu.addEventListener('click', () => {
    mobileDropDown.classList.toggle('opened');
  });

  /* listen to scroll event to stick the nav on the top and update the current visible section */
  document.addEventListener('scroll', () => {
    // stick the navigation on the top
    const wrapperTop = block.parentElement.offsetTop;
    if (window.scrollY >= wrapperTop) {
      block.classList.add('fixed-nav');
    } else {
      block.classList.remove('fixed-nav');
    }

    // update the active heading based on scroll position
    const headings = document.querySelectorAll('h2');

    const visibleHeading = Array.from(headings).reduce((visHeading, curHeading) => {
      const curTop = curHeading.getBoundingClientRect().top;
      // return current heading if at max 115 px from the top of the screen
      // 115 is a magic number working with all size of screens
      if (curTop < 115) {
        return curHeading;
      }
      return visHeading;
    }, null);

    if (visibleHeading) {
      const previousActiveMenuEntry = menu.querySelector('li.active');
      const visibleActiveMenuEntryLink = menu.querySelector(`li a[href="#${visibleHeading.id}"]`);

      // the heading is present in the sticky menu
      if (visibleActiveMenuEntryLink) {
        const visibleActiveMenuEntry = visibleActiveMenuEntryLink.parentElement;
        visibleActiveMenuEntry.classList.add('active');
        mobileDropDown.innerText = visibleActiveMenuEntry.innerText;

        if (previousActiveMenuEntry && !previousActiveMenuEntry.isSameNode(visibleActiveMenuEntry)) {
          previousActiveMenuEntry.classList.remove('active');
        }
      } else if (previousActiveMenuEntry) {
        previousActiveMenuEntry.classList.remove('active');
      }
    }
  });
}
