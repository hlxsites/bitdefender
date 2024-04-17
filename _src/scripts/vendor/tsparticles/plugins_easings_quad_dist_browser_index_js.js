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
(this["webpackChunktsparticles"] = this["webpackChunktsparticles"] || []).push([["plugins_easings_quad_dist_browser_index_js"],{

/***/ "../../plugins/easings/quad/dist/browser/index.js":
/*!********************************************************!*\
  !*** ../../plugins/easings/quad/dist/browser/index.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   loadEasingQuadPlugin: () => (/* binding */ loadEasingQuadPlugin)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n\nasync function loadEasingQuadPlugin() {\n  (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.addEasing)(\"ease-in-quad\", value => value ** 2);\n  (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.addEasing)(\"ease-out-quad\", value => 1 - (1 - value) ** 2);\n  (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.addEasing)(\"ease-in-out-quad\", value => value < 0.5 ? 2 * value ** 2 : 1 - (-2 * value + 2) ** 2 / 2);\n  await Promise.resolve();\n}\n\n//# sourceURL=webpack://tsparticles/../../plugins/easings/quad/dist/browser/index.js?");

/***/ })

}]);