import { isView } from '../scripts.js';
import { debounce } from '../utils/utils.js';

(async () => {
  let tsParticles;
  let loadAll;
  async function init() {
    if (isView('mobile')) {
      return;
    }

    tsParticles = (await import('https://cdn.jsdelivr.net/npm/@tsparticles/engine@3.1.0/+esm')).tsParticles;
    loadAll = (await import('https://cdn.jsdelivr.net/npm/@tsparticles/all@3.1.0/+esm')).loadAll;

    const particleIdSelector = 'particles-js';

    const particleDiv = document.createElement('div');
    particleDiv.setAttribute('id', particleIdSelector);

    document.body.prepend(particleDiv);

    async function loadParticles(options) {
      await loadAll(tsParticles);

      await tsParticles.load({ id: particleIdSelector, options });
    }

    const configs = {
      particles: {
        number: {
          value: 100,
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
          value: 1,
        },
        size: {
          value: {
            min: 4,
            max: 6,
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

  await init();

  window.addEventListener('resize', debounce(checkForMobile, 250));
})();
