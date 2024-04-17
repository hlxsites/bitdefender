/*!
 * Author : Matteo Bruni
 * MIT license: https://opensource.org/licenses/MIT
 * Demo / Generator : https://particles.js.org/
 * GitHub : https://www.github.com/matteobruni/tsparticles
 * How to use? : Check the GitHub README
 * v3.3.0
 */
"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(this["webpackChunktsparticles"] = this["webpackChunktsparticles"] || []).push([["interactions_particles_attract_dist_browser_Attractor_js"],{

/***/ "../../interactions/particles/attract/dist/browser/Attractor.js":
/*!**********************************************************************!*\
  !*** ../../interactions/particles/attract/dist/browser/Attractor.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Attractor: () => (/* binding */ Attractor)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n\nconst attractFactor = 1000,\n  identity = 1;\nclass Attractor extends _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.ParticlesInteractorBase {\n  constructor(container) {\n    super(container);\n  }\n  clear() {}\n  init() {}\n  interact(p1) {\n    const container = this.container;\n    if (p1.attractDistance === undefined) {\n      p1.attractDistance = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getRangeValue)(p1.options.move.attract.distance) * container.retina.pixelRatio;\n    }\n    const distance = p1.attractDistance,\n      pos1 = p1.getPosition(),\n      query = container.particles.quadTree.queryCircle(pos1, distance);\n    for (const p2 of query) {\n      if (p1 === p2 || !p2.options.move.attract.enable || p2.destroyed || p2.spawning) {\n        continue;\n      }\n      const pos2 = p2.getPosition(),\n        {\n          dx,\n          dy\n        } = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getDistances)(pos1, pos2),\n        rotate = p1.options.move.attract.rotate,\n        ax = dx / (rotate.x * attractFactor),\n        ay = dy / (rotate.y * attractFactor),\n        p1Factor = p2.size.value / p1.size.value,\n        p2Factor = identity / p1Factor;\n      p1.velocity.x -= ax * p1Factor;\n      p1.velocity.y -= ay * p1Factor;\n      p2.velocity.x += ax * p2Factor;\n      p2.velocity.y += ay * p2Factor;\n    }\n  }\n  isEnabled(particle) {\n    return particle.options.move.attract.enable;\n  }\n  reset() {}\n}\n\n//# sourceURL=webpack://tsparticles/../../interactions/particles/attract/dist/browser/Attractor.js?");

/***/ })

}]);