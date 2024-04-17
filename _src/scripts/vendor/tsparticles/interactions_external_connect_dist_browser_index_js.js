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
(this["webpackChunktsparticles"] = this["webpackChunktsparticles"] || []).push([["interactions_external_connect_dist_browser_index_js"],{

/***/ "../../interactions/external/connect/dist/browser/Options/Classes/Connect.js":
/*!***********************************************************************************!*\
  !*** ../../interactions/external/connect/dist/browser/Options/Classes/Connect.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Connect: () => (/* binding */ Connect)\n/* harmony export */ });\n/* harmony import */ var _ConnectLinks_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ConnectLinks.js */ \"../../interactions/external/connect/dist/browser/Options/Classes/ConnectLinks.js\");\n\nclass Connect {\n  constructor() {\n    this.distance = 80;\n    this.links = new _ConnectLinks_js__WEBPACK_IMPORTED_MODULE_0__.ConnectLinks();\n    this.radius = 60;\n  }\n  load(data) {\n    if (!data) {\n      return;\n    }\n    if (data.distance !== undefined) {\n      this.distance = data.distance;\n    }\n    this.links.load(data.links);\n    if (data.radius !== undefined) {\n      this.radius = data.radius;\n    }\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../interactions/external/connect/dist/browser/Options/Classes/Connect.js?");

/***/ }),

/***/ "../../interactions/external/connect/dist/browser/Options/Classes/ConnectLinks.js":
/*!****************************************************************************************!*\
  !*** ../../interactions/external/connect/dist/browser/Options/Classes/ConnectLinks.js ***!
  \****************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ConnectLinks: () => (/* binding */ ConnectLinks)\n/* harmony export */ });\nclass ConnectLinks {\n  constructor() {\n    this.opacity = 0.5;\n  }\n  load(data) {\n    if (!data) {\n      return;\n    }\n    if (data.opacity !== undefined) {\n      this.opacity = data.opacity;\n    }\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../interactions/external/connect/dist/browser/Options/Classes/ConnectLinks.js?");

/***/ }),

/***/ "../../interactions/external/connect/dist/browser/Options/Interfaces/IConnect.js":
/*!***************************************************************************************!*\
  !*** ../../interactions/external/connect/dist/browser/Options/Interfaces/IConnect.js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n\n\n//# sourceURL=webpack://tsparticles/../../interactions/external/connect/dist/browser/Options/Interfaces/IConnect.js?");

/***/ }),

/***/ "../../interactions/external/connect/dist/browser/Options/Interfaces/IConnectLinks.js":
/*!********************************************************************************************!*\
  !*** ../../interactions/external/connect/dist/browser/Options/Interfaces/IConnectLinks.js ***!
  \********************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n\n\n//# sourceURL=webpack://tsparticles/../../interactions/external/connect/dist/browser/Options/Interfaces/IConnectLinks.js?");

/***/ }),

/***/ "../../interactions/external/connect/dist/browser/index.js":
/*!*****************************************************************!*\
  !*** ../../interactions/external/connect/dist/browser/index.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Connect: () => (/* reexport safe */ _Options_Classes_Connect_js__WEBPACK_IMPORTED_MODULE_0__.Connect),\n/* harmony export */   ConnectLinks: () => (/* reexport safe */ _Options_Classes_ConnectLinks_js__WEBPACK_IMPORTED_MODULE_1__.ConnectLinks),\n/* harmony export */   loadExternalConnectInteraction: () => (/* binding */ loadExternalConnectInteraction)\n/* harmony export */ });\n/* harmony import */ var _Options_Classes_Connect_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Options/Classes/Connect.js */ \"../../interactions/external/connect/dist/browser/Options/Classes/Connect.js\");\n/* harmony import */ var _Options_Classes_ConnectLinks_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Options/Classes/ConnectLinks.js */ \"../../interactions/external/connect/dist/browser/Options/Classes/ConnectLinks.js\");\n/* harmony import */ var _Options_Interfaces_IConnect_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Options/Interfaces/IConnect.js */ \"../../interactions/external/connect/dist/browser/Options/Interfaces/IConnect.js\");\n/* harmony import */ var _Options_Interfaces_IConnectLinks_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Options/Interfaces/IConnectLinks.js */ \"../../interactions/external/connect/dist/browser/Options/Interfaces/IConnectLinks.js\");\nasync function loadExternalConnectInteraction(engine, refresh = true) {\n  await engine.addInteractor(\"externalConnect\", async container => {\n    const {\n      Connector\n    } = await __webpack_require__.e(/*! import() */ \"interactions_external_connect_dist_browser_Connector_js\").then(__webpack_require__.bind(__webpack_require__, /*! ./Connector.js */ \"../../interactions/external/connect/dist/browser/Connector.js\"));\n    return new Connector(container);\n  }, refresh);\n}\n\n\n\n\n\n//# sourceURL=webpack://tsparticles/../../interactions/external/connect/dist/browser/index.js?");

/***/ })

}]);