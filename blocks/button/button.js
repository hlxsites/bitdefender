export default function decorate(block) {
  if (block.classList.contains('download')) {
    const aHref = block.querySelector('a');
    const icon = block.querySelector('span.icon');
    if (aHref && icon) aHref.append(icon);
  }
}
