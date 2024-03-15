import { decorateIcons, createOptimizedPicture } from '../../scripts/lib-franklin.js';
import { getDatasetFromSection } from '../../scripts/utils/utils.js';

export default async function decorate(block) {
  const firstButton = document.querySelector('a.button');
  if (firstButton) {
    firstButton.classList.add('blue');
  }
  const pictureWrapper = document.createElement('.bitdefender-central.block > div > div:first-of-type p:last-of-type');
  pictureWrapper.classList = 'appstore-playstore-wrapper';

  const blockDataset = getDatasetFromSection(block);
  pictureWrapper.append(createOptimizedPicture(blockDataset.bgImage, 'title'));

  // defaultWrapper.append(pictureWrapper);

  decorateIcons(block);
  window.dispatchEvent(new CustomEvent('shadowDomLoaded'), {
    bubbles: true,
    composed: true, // This allows the event to cross the shadow DOM boundary
  });
}
