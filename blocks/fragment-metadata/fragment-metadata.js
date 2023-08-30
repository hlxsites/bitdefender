import { readBlockConfig } from '../../scripts/lib-franklin.js';
import getOperatingSystem from '../../scripts/delayed.js';

export default function decorate(block) {
  const { template } = readBlockConfig(block);

  if (template) {
    document.body.classList.add(template);
  }

  // Read OS-specific URLs
  const osUrls = {};
  const urlDivs = block.querySelectorAll('div > div');
  urlDivs.forEach((div) => {
    const key = div.children[0]?.textContent?.trim();
    const value = div.children[1]?.querySelector('a')?.href;
    if (key && value) {
      osUrls[key.replace('Open URL ', '')] = value;
    }
  });

  // Get user's operating system
  const { userAgent } = navigator;
  const userOS = getOperatingSystem(userAgent);

  // Open the appropriate URL based on the OS
  let openUrl;
  switch (userOS) {
    case 'MacOS':
      openUrl = osUrls.MacOS;
      break;
    case 'Windows 10':
    case 'Windows 8':
    case 'Windows 7':
    case 'Windows Vista':
    case 'Windows XP':
    case 'Windows 2000':
      openUrl = osUrls.Windows;
      break;
    case 'Android':
      openUrl = osUrls.Android;
      break;
    case 'iOS':
      openUrl = osUrls.IOS;
      break;
    default:
      openUrl = null; // Fallback or 'Unknown' case
  }

  if (openUrl) {
    window.open(openUrl, '_self');
  }

  // clean up
  const parentWrapper = block.parentElement;
  if (parentWrapper) {
    parentWrapper.remove();
    parentWrapper.parentElement?.classList.remove('fragment-metadata-container');
  }
}
