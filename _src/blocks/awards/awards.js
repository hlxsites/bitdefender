export default function decorate(block) {
  const parentSelector = block.closest(".section");
  const metaData = parentSelector.dataset;
  const [texte, logouri] = block.children;
  console.log(metaData.pipi);
  console.log(logouri);
  console.log(texte);
  console.log(parentSelector);
}
