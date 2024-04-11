import { decorateIcons } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  block.classList.add('default-content-wrapper');
  block.children[0].children[0].classList.add('results-wrapper');
  block.children[0].children[0].lastElementChild.classList.add('social-wrapper');
  block.querySelector('picture').closest('p').classList.add('img-container');

  const resultTitle = 'result-title';
  const resultPageUrl = window.location.href;

  const socialWrapperEl = block.querySelector('.social-wrapper');
  [...socialWrapperEl.querySelectorAll('a')].forEach((anchor) => {
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';

    if (anchor.href.includes('twitter')) {
      const twitterBaseUrl = 'https://twitter.com/intent/post?';
      const twitterText = `text=${encodeURIComponent(`Check out my quiz results: ${resultTitle}`)}`;
      const twitterUrl = `&url=${encodeURIComponent(resultPageUrl)}`;
      const fullTwitterUrl = twitterBaseUrl + twitterText + twitterUrl;
      anchor.href = fullTwitterUrl;
    }
    if (anchor.href.includes('linkedin')) {
      const linkedInBaseUrl = 'https://www.linkedin.com/sharing/share-offsite/?';
      const linkedInUrl = `url=${encodeURIComponent(resultPageUrl)}`;
      const fullLinkedInUrl = linkedInBaseUrl + linkedInUrl;
      anchor.href = fullLinkedInUrl;
    }
    if (anchor.href.includes('facebook')) {
      const facebookBaseUrl = 'https://www.facebook.com/sharer/sharer.php?';
      const facebookUrl = `u=${encodeURIComponent(resultPageUrl)}`;
      const fullFacebookUrl = facebookBaseUrl + facebookUrl;
      anchor.href = fullFacebookUrl;
    }
  });
}
