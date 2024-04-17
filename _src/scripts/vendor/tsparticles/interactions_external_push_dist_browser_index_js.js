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
(this["webpackChunktsparticles"] = this["webpackChunktsparticles"] || []).push([["interactions_external_push_dist_browser_index_js"],{

/***/ "../../interactions/external/push/dist/browser/Options/Classes/Push.js":
/*!*****************************************************************************!*\
  !*** ../../interactions/external/push/dist/browser/Options/Classes/Push.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Push: () => (/* binding */ Push)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n\nclass Push {\n  constructor() {\n    this.default = true;\n    this.groups = [];\n    this.quantity = 4;\n  }\n  load(data) {\n    if (!data) {\n      return;\n    }\n    if (data.default !== undefined) {\n      this.default = data.default;\n    }\n    if (data.groups !== undefined) {\n      this.groups = data.groups.map(t => t);\n    }\n    if (!this.groups.length) {\n      this.default = true;\n    }\n    const quantity = data.quantity;\n    if (quantity !== undefined) {\n      this.quantity = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.setRangeValue)(quantity);\n    }\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../interactions/external/push/dist/browser/Options/Classes/Push.js?");

/***/ }),

/***/ "../../interactions/external/push/dist/browser/Options/Interfaces/IPush.js":
/*!*********************************************************************************!*\
  !*** ../../interactions/external/push/dist/browser/Options/Interfaces/IPush.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n\n\n//# sourceURL=webpack://tsparticles/../../interactions/external/push/dist/browser/Options/Interfaces/IPush.js?");

/***/ }),

/***/ "../../interactions/external/push/dist/browser/index.js":
/*!**************************************************************!*\
  !*** ../../interactions/external/push/dist/browser/index.js ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Push: () => (/* reexport safe */ _Options_Classes_Push_js__WEBPACK_IMPORTED_MODULE_0__.Push),\n/* harmony export */   loadExternalPushInteraction: () => (/* binding */ loadExternalPushInteraction)\n/* harmony export */ });\n/* harmony import */ var _Options_Classes_Push_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Options/Classes/Push.js */ \"../../interactions/external/push/dist/browser/Options/Classes/Push.js\");\n/* harmony import */ var _Options_Interfaces_IPush_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Options/Interfaces/IPush.js */ \"../../interactions/external/push/dist/browser/Options/Interfaces/IPush.js\");\nasync function loadExternalPushInteraction(engine, refresh = true) {\n  await engine.addInteractor(\"externalPush\", async container => {\n    const {\n      Pusher\n    } = await __webpack_require__.e(/*! import() */ \"interactions_external_push_dist_browser_Pusher_js\").then(__webpack_require__.bind(__webpack_require__, /*! ./Pusher.js */ \"../../interactions/external/push/dist/browser/Pusher.js\"));\n    return new Pusher(container);\n  }, refresh);\n}\n\n\n\n//# sourceURL=webpack://tsparticles/../../interactions/external/push/dist/browser/index.js?");

/***/ })

}]);