const nanoBlocks = new Map();

function findTextNodes(parent) {
  let all = [];
  for (let node = parent.firstChild; node; node = node.nextSibling) {
    if (node.nodeType === 3) all.push(node);
    else all = all.concat(findTextNodes(node));
  }
  return all;
}

/**
 * Create a nano block
 * @param name The name of the block
 * @param renderer The renderer function
 */
export function createNanoBlock(name, renderer) {
  nanoBlocks.set(name.toLowerCase(), renderer);
}

/**
 * Renders nano blocks
 * @param parent The parent element
 */
export function renderNanoBlocks(parent = document.body) {
  const regex = /{([^}]+)}/g;
  findTextNodes(parent).forEach((node) => {
    const text = node.textContent.trim();
    const matches = text.match(regex);
    if (matches) {
      matches.forEach((match) => {
        const [name, ...params] = match.slice(1, -1).split(',').map((p) => p.trim());
        const renderer = nanoBlocks.get(name.toLowerCase());
        if (renderer) {
          const element = renderer(...params);
          node.parentNode.replaceChild(element, node);
        }
      });
    }
  });
}
