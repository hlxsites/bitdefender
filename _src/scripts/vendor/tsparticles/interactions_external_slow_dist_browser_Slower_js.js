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
(this["webpackChunktsparticles"] = this["webpackChunktsparticles"] || []).push([["interactions_external_slow_dist_browser_Slower_js"],{

/***/ "../../interactions/external/slow/dist/browser/Slower.js":
/*!***************************************************************!*\
  !*** ../../interactions/external/slow/dist/browser/Slower.js ***!
  \***************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Slower: () => (/* binding */ Slower)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n/* harmony import */ var _Options_Classes_Slow_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Options/Classes/Slow.js */ \"../../interactions/external/slow/dist/browser/Options/Classes/Slow.js\");\n\n\nconst slowMode = \"slow\",\n  minRadius = 0;\nclass Slower extends _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.ExternalInteractorBase {\n  constructor(container) {\n    super(container);\n  }\n  clear(particle, delta, force) {\n    if (particle.slow.inRange && !force) {\n      return;\n    }\n    particle.slow.factor = 1;\n  }\n  init() {\n    const container = this.container,\n      slow = container.actualOptions.interactivity.modes.slow;\n    if (!slow) {\n      return;\n    }\n    container.retina.slowModeRadius = slow.radius * container.retina.pixelRatio;\n  }\n  interact() {}\n  isEnabled(particle) {\n    const container = this.container,\n      mouse = container.interactivity.mouse,\n      events = (particle?.interactivity ?? container.actualOptions.interactivity).events;\n    return events.onHover.enable && !!mouse.position && (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.isInArray)(slowMode, events.onHover.mode);\n  }\n  loadModeOptions(options, ...sources) {\n    if (!options.slow) {\n      options.slow = new _Options_Classes_Slow_js__WEBPACK_IMPORTED_MODULE_1__.Slow();\n    }\n    for (const source of sources) {\n      options.slow.load(source?.slow);\n    }\n  }\n  reset(particle) {\n    particle.slow.inRange = false;\n    const container = this.container,\n      options = container.actualOptions,\n      mousePos = container.interactivity.mouse.position,\n      radius = container.retina.slowModeRadius,\n      slowOptions = options.interactivity.modes.slow;\n    if (!slowOptions || !radius || radius < minRadius || !mousePos) {\n      return;\n    }\n    const particlePos = particle.getPosition(),\n      dist = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getDistance)(mousePos, particlePos),\n      proximityFactor = dist / radius,\n      slowFactor = slowOptions.factor,\n      {\n        slow\n      } = particle;\n    if (dist > radius) {\n      return;\n    }\n    slow.inRange = true;\n    slow.factor = proximityFactor / slowFactor;\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../interactions/external/slow/dist/browser/Slower.js?");

/***/ })

}]);