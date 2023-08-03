export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`features-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('features-img-col');
        }
      }


      /* **** setup tabs **** */

      const mergedUl = document.createElement("ul");
      mergedUl.classList.add("features-tabs");

      col.querySelectorAll("ul").forEach((ul) => {
        ul.querySelectorAll("li").forEach((li) => {

          var a = document.createElement('a');

          // register click event on a tag
          a.addEventListener('click', (event) => {
            // if the clicked node has children then toggle the nav-hidden class
            if (event.target.parentNode.children.length > 1) {
              event.target.parentNode.children[1].classList.toggle('features-tabs-hidden');
              event.target.classList.toggle('is-open');
            }

            // hid the other tabs
            mergedUl.querySelectorAll("li").forEach((li) => {
                if (li !== event.target.parentNode) {
                    li.children[0].classList.remove('is-open');
                    li.children[1].classList.add('features-tabs-hidden');
                }
            });

          });

          a.innerText = li.innerText;

          li.innerText = "";

          li.appendChild(a);

          if (li.nextElementSibling === null) {

            const paragraph = li.closest("ul").nextElementSibling;
            if (paragraph && paragraph.tagName === "P") {
              paragraph.classList.add("features-tabs-content");
              paragraph.classList.add("features-tabs-hidden");
              li.appendChild(paragraph);
            }
          }

          mergedUl.appendChild(li);
        });
        ul.remove();
      });

      col.appendChild(mergedUl);

      /* **** end **** */
    });
  });
}
