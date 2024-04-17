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
(this["webpackChunktsparticles"] = this["webpackChunktsparticles"] || []).push([["updaters_strokeColor_dist_browser_StrokeColorUpdater_js"],{

/***/ "../../updaters/strokeColor/dist/browser/StrokeColorUpdater.js":
/*!*********************************************************************!*\
  !*** ../../updaters/strokeColor/dist/browser/StrokeColorUpdater.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   StrokeColorUpdater: () => (/* binding */ StrokeColorUpdater)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n\nconst defaultOpacity = 1;\nclass StrokeColorUpdater {\n  constructor(container) {\n    this.container = container;\n  }\n  init(particle) {\n    const container = this.container,\n      options = particle.options;\n    const stroke = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.itemFromSingleOrMultiple)(options.stroke, particle.id, options.reduceDuplicates);\n    particle.strokeWidth = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getRangeValue)(stroke.width) * container.retina.pixelRatio;\n    particle.strokeOpacity = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getRangeValue)(stroke.opacity ?? defaultOpacity);\n    particle.strokeAnimation = stroke.color?.animation;\n    const strokeHslColor = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.rangeColorToHsl)(stroke.color) ?? particle.getFillColor();\n    if (strokeHslColor) {\n      particle.strokeColor = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getHslAnimationFromHsl)(strokeHslColor, particle.strokeAnimation, container.retina.reduceFactor);\n    }\n  }\n  isEnabled(particle) {\n    const color = particle.strokeAnimation,\n      {\n        strokeColor\n      } = particle;\n    return !particle.destroyed && !particle.spawning && !!color && (strokeColor?.h.value !== undefined && strokeColor.h.enable || strokeColor?.s.value !== undefined && strokeColor.s.enable || strokeColor?.l.value !== undefined && strokeColor.l.enable);\n  }\n  update(particle, delta) {\n    if (!this.isEnabled(particle)) {\n      return;\n    }\n    (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.updateColor)(particle.strokeColor, delta);\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../updaters/strokeColor/dist/browser/StrokeColorUpdater.js?");

/***/ })

}]);