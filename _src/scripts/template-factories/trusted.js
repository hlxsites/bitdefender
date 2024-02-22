import { tsParticles } from 'https://cdn.jsdelivr.net/npm/@tsparticles/engine@3.1.0/+esm';
import { loadAll } from 'https://cdn.jsdelivr.net/npm/@tsparticles/all@3.1.0/+esm';

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
