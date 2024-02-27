export default function decorate(block) {
  window.dispatchEvent(new CustomEvent('shadowDomLoaded'), {
    bubbles: true,
    composed: true,
  });

  setTimeout(() => {
    const element = block.querySelector('.dunga');
    const elementLink = block.querySelector('.dunga a');
    element.style.backgroundColor = '#E4F2FF';
    element.style.color = '#006EFF';
    elementLink.style.color = '#006EFF';
  }, 3000);
}
