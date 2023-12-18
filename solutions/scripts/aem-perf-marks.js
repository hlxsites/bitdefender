/**
 * AEM Performance Marks.
 * @type {*|{}}
 */
window.PerfMarks = window.PerfMarks || {};

/**
 * Create a performance mark.
 * @param {string} name The name of the performance mark.
 * @param {any} detail The detail to pass to the performance mark.
 */
window.PerfMarks.create = (name, detail = undefined) => {
  performance.mark(`perf-start-${name}`, detail ? { detail } : undefined);
  // eslint-disable-next-line no-console
  console.debug(`perf-${name} started at ${performance.now()} + ms`);
};

/**
 * Measure the time between two performance marks.
 * @param {string} name The name of the performance mark.
 */
window.PerfMarks.measure = (name) => {
  performance.mark(`perf-stop-${name}`);
  const duration = performance.measure(`perf-${name}`, `perf-start-${name}`, `perf-stop-${name}`);
  // eslint-disable-next-line no-console
  console.debug(`perf-${name} stopped at ${performance.now()} ms`);
  // eslint-disable-next-line no-console
  console.debug(`perf-${name} took ${duration.duration} ms`);
};

const config = {
  attributes: true,
  subtree: true,
  attributeFilter: ['data-block-status'],
};

// const ids = new Map();

const observer = new MutationObserver((mutations) => {

  mutations.forEach((mutation) => {
    const { target } = mutation;
    console.debug('MutationObserver', target); // eslint-disable-line no-console
    if (target.dataset.blockStatus) {
      const name = target.dataset.blockName;
      const status = target.dataset.blockStatus;
      if (status === 'initialized') {
        window.PerfMarks.create(name);
      } else if (status === 'loaded') {
        window.PerfMarks.measure(name);
      }
    }
  });

  // if (element.dataset.sectionStatus) {
  //   const markName = element.classList.join('_');
  //   if (element.dataset.sectionStatus === 'initialized') {
  //     window.PerfMarks.create(markName, { section: element.id });
  //   } else if (element.dataset.sectionStatus === 'loaded') {
  //     window.PerfMarks.measure(markName);
  //   }
  // }
});

console.debug('Attaching performance observer...'); // eslint-disable-line no-console
observer.observe(document.body, config);

setTimeout(() => {
  console.debug('Detaching performance observer...'); // eslint-disable-line no-console
  observer.disconnect();
}, 10000);
