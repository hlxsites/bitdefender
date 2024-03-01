export default async function decorate(block) {
  const cols = [...block.children[0].children];

  block.innerHTML = `
    <div class="default-content-wrapper">
        ${cols.map((col) => {
    const pictureEl = col.querySelector('picture');
    const richTextEls = [...col.children];
    richTextEls.shift();
    const [titleEl, subtitleEl, buttonEl] = richTextEls;

    return `
        <div class="col-container">
            <div class="card">
                <div class="img-container">
                    ${pictureEl.outerHTML}
                </div>
                <div class="box">
                    ${titleEl.outerHTML}
                    <div>${subtitleEl.innerHTML}</div>
                    ${buttonEl.outerHTML}
                </div>
            </div>
        </div>
    `;
  }).join('')}   
  `;
}
