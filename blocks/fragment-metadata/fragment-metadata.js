import { readBlockConfig } from '../../scripts/lib-franklin.js';
import { getOperatingSystem } from '../../scripts/scripts.js';

export default function decorate(block) {
  const {
    template,
    'open-url-macos': openUrlMacos,
    'open-url-windows': openUrlWindows,
    'open-url-android': openUrlAndroid,
    'open-url-ios': openUrlIos,
  } = readBlockConfig(block);

  if (template) {
    document.body.classList.add(template);
  }

  if (openUrlMacos || openUrlWindows || openUrlAndroid || openUrlIos) {
    // Get user's operating system
    const { userAgent } = navigator;
    const userOS = getOperatingSystem(userAgent);

    // Open the appropriate URL based on the OS
    let openUrl;
    switch (userOS) {
      case 'MacOS':
        openUrl = openUrlMacos;
        break;
      case 'Windows 10':
      case 'Windows 8':
      case 'Windows 7':
      case 'Windows Vista':
      case 'Windows XP':
      case 'Windows 2000':
        openUrl = openUrlWindows;
        break;
      case 'Android':
        openUrl = openUrlAndroid;
        break;
      case 'iOS':
        openUrl = openUrlIos;
        break;
      default:
        openUrl = null; // Fallback or 'Unknown' case
        console.warn(`Unknown OS: ${userOS}`);
    }

    if (openUrl) {
      window.open(openUrl, '_self');
    }
  }

  // Remove the Fragments Metadata table
  if (block.parentElement) {
    const parentWrapper = block.parentElement;
    if (parentWrapper) {
      parentWrapper.remove();
      parentWrapper.parentElement?.classList.remove('fragment-metadata-container');
    }
  }
}
