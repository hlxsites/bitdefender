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
(this["webpackChunktsparticles"] = this["webpackChunktsparticles"] || []).push([["interactions_external_repulse_dist_browser_index_js"],{

/***/ "../../interactions/external/repulse/dist/browser/Options/Classes/Repulse.js":
/*!***********************************************************************************!*\
  !*** ../../interactions/external/repulse/dist/browser/Options/Classes/Repulse.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Repulse: () => (/* binding */ Repulse)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n/* harmony import */ var _RepulseBase_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./RepulseBase.js */ \"../../interactions/external/repulse/dist/browser/Options/Classes/RepulseBase.js\");\n/* harmony import */ var _RepulseDiv_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./RepulseDiv.js */ \"../../interactions/external/repulse/dist/browser/Options/Classes/RepulseDiv.js\");\n\n\n\nclass Repulse extends _RepulseBase_js__WEBPACK_IMPORTED_MODULE_1__.RepulseBase {\n  load(data) {\n    super.load(data);\n    if (!data) {\n      return;\n    }\n    this.divs = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.executeOnSingleOrMultiple)(data.divs, div => {\n      const tmp = new _RepulseDiv_js__WEBPACK_IMPORTED_MODULE_2__.RepulseDiv();\n      tmp.load(div);\n      return tmp;\n    });\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../interactions/external/repulse/dist/browser/Options/Classes/Repulse.js?");

/***/ }),

/***/ "../../interactions/external/repulse/dist/browser/Options/Classes/RepulseBase.js":
/*!***************************************************************************************!*\
  !*** ../../interactions/external/repulse/dist/browser/Options/Classes/RepulseBase.js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   RepulseBase: () => (/* binding */ RepulseBase)\n/* harmony export */ });\nclass RepulseBase {\n  constructor() {\n    this.distance = 200;\n    this.duration = 0.4;\n    this.factor = 100;\n    this.speed = 1;\n    this.maxSpeed = 50;\n    this.easing = \"ease-out-quad\";\n  }\n  load(data) {\n    if (!data) {\n      return;\n    }\n    if (data.distance !== undefined) {\n      this.distance = data.distance;\n    }\n    if (data.duration !== undefined) {\n      this.duration = data.duration;\n    }\n    if (data.easing !== undefined) {\n      this.easing = data.easing;\n    }\n    if (data.factor !== undefined) {\n      this.factor = data.factor;\n    }\n    if (data.speed !== undefined) {\n      this.speed = data.speed;\n    }\n    if (data.maxSpeed !== undefined) {\n      this.maxSpeed = data.maxSpeed;\n    }\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../interactions/external/repulse/dist/browser/Options/Classes/RepulseBase.js?");

/***/ }),

/***/ "../../interactions/external/repulse/dist/browser/Options/Classes/RepulseDiv.js":
/*!**************************************************************************************!*\
  !*** ../../interactions/external/repulse/dist/browser/Options/Classes/RepulseDiv.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   RepulseDiv: () => (/* binding */ RepulseDiv)\n/* harmony export */ });\n/* harmony import */ var _RepulseBase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./RepulseBase.js */ \"../../interactions/external/repulse/dist/browser/Options/Classes/RepulseBase.js\");\n\nclass RepulseDiv extends _RepulseBase_js__WEBPACK_IMPORTED_MODULE_0__.RepulseBase {\n  constructor() {\n    super();\n    this.selectors = [];\n  }\n  load(data) {\n    super.load(data);\n    if (!data) {\n      return;\n    }\n    if (data.selectors !== undefined) {\n      this.selectors = data.selectors;\n    }\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../interactions/external/repulse/dist/browser/Options/Classes/RepulseDiv.js?");

/***/ }),

/***/ "../../interactions/external/repulse/dist/browser/Options/Interfaces/IRepulse.js":
/*!***************************************************************************************!*\
  !*** ../../interactions/external/repulse/dist/browser/Options/Interfaces/IRepulse.js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n\n\n//# sourceURL=webpack://tsparticles/../../interactions/external/repulse/dist/browser/Options/Interfaces/IRepulse.js?");

/***/ }),

/***/ "../../interactions/external/repulse/dist/browser/Options/Interfaces/IRepulseBase.js":
/*!*******************************************************************************************!*\
  !*** ../../interactions/external/repulse/dist/browser/Options/Interfaces/IRepulseBase.js ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n\n\n//# sourceURL=webpack://tsparticles/../../interactions/external/repulse/dist/browser/Options/Interfaces/IRepulseBase.js?");

/***/ }),

/***/ "../../interactions/external/repulse/dist/browser/Options/Interfaces/IRepulseDiv.js":
/*!******************************************************************************************!*\
  !*** ../../interactions/external/repulse/dist/browser/Options/Interfaces/IRepulseDiv.js ***!
  \******************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n\n\n//# sourceURL=webpack://tsparticles/../../interactions/external/repulse/dist/browser/Options/Interfaces/IRepulseDiv.js?");

/***/ }),

/***/ "../../interactions/external/repulse/dist/browser/index.js":
/*!*****************************************************************!*\
  !*** ../../interactions/external/repulse/dist/browser/index.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Repulse: () => (/* reexport safe */ _Options_Classes_Repulse_js__WEBPACK_IMPORTED_MODULE_2__.Repulse),\n/* harmony export */   RepulseBase: () => (/* reexport safe */ _Options_Classes_RepulseBase_js__WEBPACK_IMPORTED_MODULE_0__.RepulseBase),\n/* harmony export */   RepulseDiv: () => (/* reexport safe */ _Options_Classes_RepulseDiv_js__WEBPACK_IMPORTED_MODULE_1__.RepulseDiv),\n/* harmony export */   loadExternalRepulseInteraction: () => (/* binding */ loadExternalRepulseInteraction)\n/* harmony export */ });\n/* harmony import */ var _Options_Classes_RepulseBase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Options/Classes/RepulseBase.js */ \"../../interactions/external/repulse/dist/browser/Options/Classes/RepulseBase.js\");\n/* harmony import */ var _Options_Classes_RepulseDiv_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Options/Classes/RepulseDiv.js */ \"../../interactions/external/repulse/dist/browser/Options/Classes/RepulseDiv.js\");\n/* harmony import */ var _Options_Classes_Repulse_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Options/Classes/Repulse.js */ \"../../interactions/external/repulse/dist/browser/Options/Classes/Repulse.js\");\n/* harmony import */ var _Options_Interfaces_IRepulseBase_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Options/Interfaces/IRepulseBase.js */ \"../../interactions/external/repulse/dist/browser/Options/Interfaces/IRepulseBase.js\");\n/* harmony import */ var _Options_Interfaces_IRepulseDiv_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Options/Interfaces/IRepulseDiv.js */ \"../../interactions/external/repulse/dist/browser/Options/Interfaces/IRepulseDiv.js\");\n/* harmony import */ var _Options_Interfaces_IRepulse_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Options/Interfaces/IRepulse.js */ \"../../interactions/external/repulse/dist/browser/Options/Interfaces/IRepulse.js\");\nasync function loadExternalRepulseInteraction(engine, refresh = true) {\n  await engine.addInteractor(\"externalRepulse\", async container => {\n    const {\n      Repulser\n    } = await __webpack_require__.e(/*! import() */ \"interactions_external_repulse_dist_browser_Repulser_js\").then(__webpack_require__.bind(__webpack_require__, /*! ./Repulser.js */ \"../../interactions/external/repulse/dist/browser/Repulser.js\"));\n    return new Repulser(engine, container);\n  }, refresh);\n}\n\n\n\n\n\n\n\n//# sourceURL=webpack://tsparticles/../../interactions/external/repulse/dist/browser/index.js?");

/***/ })

}]);