export default async function decorate(block) {
  const [richTextEl, firstPictureEl, secondPictureEl] = [...block.children];

  block.innerHTML = `
    <div class="wrapper default-content-wrapper">
        <div class="rte">${richTextEl.children[0].innerHTML}</div>
    </div>
    
    <div class="imgs-wrapper">
        <div class="main-img img-container">
            ${firstPictureEl.querySelector('picture').innerHTML}
        </div>
        
        <div class="second-img img-container">
            ${secondPictureEl.querySelector('picture').innerHTML}
        </div>
    </div>
  `;
}
