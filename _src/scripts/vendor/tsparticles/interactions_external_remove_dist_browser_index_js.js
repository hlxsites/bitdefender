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
(this["webpackChunktsparticles"] = this["webpackChunktsparticles"] || []).push([["interactions_external_remove_dist_browser_index_js"],{

/***/ "../../interactions/external/remove/dist/browser/Options/Classes/Remove.js":
/*!*********************************************************************************!*\
  !*** ../../interactions/external/remove/dist/browser/Options/Classes/Remove.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Remove: () => (/* binding */ Remove)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n\nclass Remove {\n  constructor() {\n    this.quantity = 2;\n  }\n  load(data) {\n    if (!data) {\n      return;\n    }\n    const quantity = data.quantity;\n    if (quantity !== undefined) {\n      this.quantity = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.setRangeValue)(quantity);\n    }\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../interactions/external/remove/dist/browser/Options/Classes/Remove.js?");

/***/ }),

/***/ "../../interactions/external/remove/dist/browser/Options/Interfaces/IRemove.js":
/*!*************************************************************************************!*\
  !*** ../../interactions/external/remove/dist/browser/Options/Interfaces/IRemove.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n\n\n//# sourceURL=webpack://tsparticles/../../interactions/external/remove/dist/browser/Options/Interfaces/IRemove.js?");

/***/ }),

/***/ "../../interactions/external/remove/dist/browser/index.js":
/*!****************************************************************!*\
  !*** ../../interactions/external/remove/dist/browser/index.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Remove: () => (/* reexport safe */ _Options_Classes_Remove_js__WEBPACK_IMPORTED_MODULE_0__.Remove),\n/* harmony export */   loadExternalRemoveInteraction: () => (/* binding */ loadExternalRemoveInteraction)\n/* harmony export */ });\n/* harmony import */ var _Options_Classes_Remove_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Options/Classes/Remove.js */ \"../../interactions/external/remove/dist/browser/Options/Classes/Remove.js\");\n/* harmony import */ var _Options_Interfaces_IRemove_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Options/Interfaces/IRemove.js */ \"../../interactions/external/remove/dist/browser/Options/Interfaces/IRemove.js\");\nasync function loadExternalRemoveInteraction(engine, refresh = true) {\n  await engine.addInteractor(\"externalRemove\", async container => {\n    const {\n      Remover\n    } = await __webpack_require__.e(/*! import() */ \"interactions_external_remove_dist_browser_Remover_js\").then(__webpack_require__.bind(__webpack_require__, /*! ./Remover.js */ \"../../interactions/external/remove/dist/browser/Remover.js\"));\n    return new Remover(container);\n  }, refresh);\n}\n\n\n\n//# sourceURL=webpack://tsparticles/../../interactions/external/remove/dist/browser/index.js?");

/***/ })

}]);