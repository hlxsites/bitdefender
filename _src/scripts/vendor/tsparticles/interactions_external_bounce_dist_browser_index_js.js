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
(this["webpackChunktsparticles"] = this["webpackChunktsparticles"] || []).push([["interactions_external_bounce_dist_browser_index_js"],{

/***/ "../../interactions/external/bounce/dist/browser/Options/Classes/Bounce.js":
/*!*********************************************************************************!*\
  !*** ../../interactions/external/bounce/dist/browser/Options/Classes/Bounce.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Bounce: () => (/* binding */ Bounce)\n/* harmony export */ });\nclass Bounce {\n  constructor() {\n    this.distance = 200;\n  }\n  load(data) {\n    if (!data) {\n      return;\n    }\n    if (data.distance !== undefined) {\n      this.distance = data.distance;\n    }\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../interactions/external/bounce/dist/browser/Options/Classes/Bounce.js?");

/***/ }),

/***/ "../../interactions/external/bounce/dist/browser/Options/Interfaces/IBounce.js":
/*!*************************************************************************************!*\
  !*** ../../interactions/external/bounce/dist/browser/Options/Interfaces/IBounce.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n\n\n//# sourceURL=webpack://tsparticles/../../interactions/external/bounce/dist/browser/Options/Interfaces/IBounce.js?");

/***/ }),

/***/ "../../interactions/external/bounce/dist/browser/index.js":
/*!****************************************************************!*\
  !*** ../../interactions/external/bounce/dist/browser/index.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Bounce: () => (/* reexport safe */ _Options_Classes_Bounce_js__WEBPACK_IMPORTED_MODULE_0__.Bounce),\n/* harmony export */   loadExternalBounceInteraction: () => (/* binding */ loadExternalBounceInteraction)\n/* harmony export */ });\n/* harmony import */ var _Options_Classes_Bounce_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Options/Classes/Bounce.js */ \"../../interactions/external/bounce/dist/browser/Options/Classes/Bounce.js\");\n/* harmony import */ var _Options_Interfaces_IBounce_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Options/Interfaces/IBounce.js */ \"../../interactions/external/bounce/dist/browser/Options/Interfaces/IBounce.js\");\nasync function loadExternalBounceInteraction(engine, refresh = true) {\n  await engine.addInteractor(\"externalBounce\", async container => {\n    const {\n      Bouncer\n    } = await __webpack_require__.e(/*! import() */ \"interactions_external_bounce_dist_browser_Bouncer_js\").then(__webpack_require__.bind(__webpack_require__, /*! ./Bouncer.js */ \"../../interactions/external/bounce/dist/browser/Bouncer.js\"));\n    return new Bouncer(container);\n  }, refresh);\n}\n\n\n\n//# sourceURL=webpack://tsparticles/../../interactions/external/bounce/dist/browser/index.js?");

/***/ })

}]);