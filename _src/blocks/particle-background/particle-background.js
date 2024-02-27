/* eslint-disable prefer-const */
/* eslint-disable camelcase */
import { isView } from '../../scripts/scripts.js';
import { debounce } from '../../scripts/utils/utils.js';

let tsParticles;
let loadAll;
async function init(block) {
  if (isView('mobile')) {
    return;
  }

  tsParticles = (await import('https://cdn.jsdelivr.net/npm/@tsparticles/engine@3.1.0/+esm')).tsParticles;
  loadAll = (await import('https://cdn.jsdelivr.net/npm/@tsparticles/all@3.1.0/+esm')).loadAll;

  const particleIdSelector = 'particles-js';

  const particleDiv = document.createElement('div');
  particleDiv.setAttribute('id', particleIdSelector);

  block.prepend(particleDiv);

  async function loadParticles(options) {
    await loadAll(tsParticles);

    await tsParticles.load({ id: particleIdSelector, options });
  }

  const configs = {
    particles: {
      number: {
        value: 130,
      },
      color: {
        value: '#ffffff',
      },
      links: {
        enable: true,
        distance: 200,
      },
      shape: {
        type: 'circle',
      },
      opacity: {
        value: 0.6,
      },
      size: {
        value: {
          min: 2,
          max: 4,
        },
      },
      move: {
        enable: true,
        speed: 2,
      },
    },
    background: {
      color: '#016DFF',
    },
    poisson: {
      enable: true,
    },
  };

  loadParticles(configs);
}

async function checkForMobile() {
  const isMobileView = isView('mobile');
  if (isMobileView && (!tsParticles && !loadAll)) {
    return;
  }

  if (isMobileView && tsParticles) {
    const particles = tsParticles.domItem(0);
    particles.pause();
    return;
  }

  if (!isMobileView && (!tsParticles && !loadAll)) {
    await init();
    return;
  }

  const particles = tsParticles.domItem(0);
  particles.play();
}

export default async function decorate(block) {
  console.log('Particle background block');

  await init(block);

  window.addEventListener('resize', debounce(checkForMobile, 250));
}
