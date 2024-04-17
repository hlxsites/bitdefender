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
(this["webpackChunktsparticles"] = this["webpackChunktsparticles"] || []).push([["shapes_star_dist_browser_StarDrawer_js"],{

/***/ "../../shapes/star/dist/browser/StarDrawer.js":
/*!****************************************************!*\
  !*** ../../shapes/star/dist/browser/StarDrawer.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   StarDrawer: () => (/* binding */ StarDrawer)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n/* harmony import */ var _Utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utils.js */ \"../../shapes/star/dist/browser/Utils.js\");\n\n\nconst defaultInset = 2,\n  defaultSides = 5;\nclass StarDrawer {\n  draw(data) {\n    (0,_Utils_js__WEBPACK_IMPORTED_MODULE_1__.drawStar)(data);\n  }\n  getSidesCount(particle) {\n    const star = particle.shapeData;\n    return Math.round((0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getRangeValue)(star?.sides ?? defaultSides));\n  }\n  particleInit(container, particle) {\n    const star = particle.shapeData;\n    particle.starInset = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getRangeValue)(star?.inset ?? defaultInset);\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../shapes/star/dist/browser/StarDrawer.js?");

/***/ }),

/***/ "../../shapes/star/dist/browser/Utils.js":
/*!***********************************************!*\
  !*** ../../shapes/star/dist/browser/Utils.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   drawStar: () => (/* binding */ drawStar)\n/* harmony export */ });\nconst defaultInset = 2,\n  origin = {\n    x: 0,\n    y: 0\n  };\nfunction drawStar(data) {\n  const {\n      context,\n      particle,\n      radius\n    } = data,\n    sides = particle.sides,\n    inset = particle.starInset ?? defaultInset;\n  context.moveTo(origin.x, origin.y - radius);\n  for (let i = 0; i < sides; i++) {\n    context.rotate(Math.PI / sides);\n    context.lineTo(origin.x, origin.y - radius * inset);\n    context.rotate(Math.PI / sides);\n    context.lineTo(origin.x, origin.y - radius);\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../shapes/star/dist/browser/Utils.js?");

/***/ })

}]);