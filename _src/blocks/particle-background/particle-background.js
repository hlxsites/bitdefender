/* eslint-disable prefer-const */
/* eslint-disable camelcase */
// import '../../../node_modules/particles.js/particles';
// import { tsParticles } from "../../../node_modules/@tsparticles/engine/tsparticles.engine.js";
import { tsParticles } from 'https://cdn.jsdelivr.net/npm/@tsparticles/engine@3.1.0/+esm';
import { loadAll } from 'https://cdn.jsdelivr.net/npm/@tsparticles/all@3.1.0/+esm';

async function loadParticles(options) {
  await loadAll(tsParticles);

  await tsParticles.load({ id: 'tsparticles', options });
}

export default async function decorate(block) {
  console.log('Particle background block');

  const canvas = document.createElement('div');
  canvas.setAttribute('id', 'tsparticles');
  block.append(canvas);

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
