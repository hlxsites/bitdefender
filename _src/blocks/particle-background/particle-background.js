/* eslint-disable prefer-const */
/* eslint-disable camelcase */

// function debounce(func, wait) {
//   let timeout;
//   return function executedFunction(...args) {
//     const later = () => {
//       clearTimeout(timeout);
//       func(...args);
//     };
//     clearTimeout(timeout);
//     timeout = setTimeout(later, wait);
//   };
// }

// function isView(viewport) {
//   const element = document.querySelectorAll(`[data-${viewport}-detector]`)[0];
//   return !!(element && getComputedStyle(element).display !== 'none');
// }

let tsParticles;
let loadAll;

async function init(block) {
  // if (isView('mobile')) {
  //   return;
  // }

  // eslint-disable-next-line import/no-unresolved
  tsParticles = (await import('https://cdn.jsdelivr.net/npm/@tsparticles/engine@3.1.0/+esm')).tsParticles;
  console.log(tsParticles);
  // eslint-disable-next-line import/no-unresolved
  loadAll = (await import('https://cdn.jsdelivr.net/npm/@tsparticles/all@3.1.0/+esm')).loadAll;

  const particleIdSelector = 'ts-particles';

  const particleDiv = document.createElement('div');
  particleDiv.setAttribute('id', particleIdSelector);
  const particleBackground = block.querySelector('.particle-background');
  particleBackground.prepend(particleDiv);
  // block.children[0].setAttribute('id', particleIdSelector);
  async function loadParticles(options) {
    await loadAll(tsParticles);

    await tsParticles.load({ id: particleIdSelector, options });
  }

  const configs = {
    particles: {
      number: {
        value: 50,
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
    fullScreen: { enable: false },
  };

  loadParticles(configs);
}

// async function checkForMobile() {
//   const isMobileView = isView('mobile');
//   if (isMobileView && (!tsParticles && !loadAll)) {
//     return;
//   }

//   if (isMobileView && tsParticles) {
//     const particles = tsParticles.domItem(0);
//     particles.pause();
//     return;
//   }

//   if (!isMobileView && (!tsParticles && !loadAll)) {
//     await init();
//     return;
//   }

//   const particles = tsParticles.domItem(0);
//   particles.play();
// }

export default async function decorate(block) {
  await init(block);

  // window.addEventListener('resize', debounce(checkForMobile, 50));

  let test = document.querySelectorAll('#ts-particles');
  console.log(test);
  let test2 = block.querySelectorAll('#ts-particles');
  console.log(test2);
  test2[0].replaceWith(test2[1]);
  window.dispatchEvent(new CustomEvent('shadowDomLoaded'), {
    bubbles: true,
    composed: true, // This allows the event to cross the shadow DOM boundary
  });
}
