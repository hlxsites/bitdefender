export default function decorate(block) {
  setTimeout(() => {
    const element = document.querySelector('.dunga');
    const elementLink = document.querySelector('.dunga a');
    element.style.backgroundColor = '#E4F2FF';
    element.style.color = '#006EFF';
    elementLink.style.color = '#006EFF';
  }, 1000);
}
