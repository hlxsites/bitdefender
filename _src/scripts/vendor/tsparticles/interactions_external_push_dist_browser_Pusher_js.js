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
(this["webpackChunktsparticles"] = this["webpackChunktsparticles"] || []).push([["interactions_external_push_dist_browser_Pusher_js"],{

/***/ "../../interactions/external/push/dist/browser/Pusher.js":
/*!***************************************************************!*\
  !*** ../../interactions/external/push/dist/browser/Pusher.js ***!
  \***************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Pusher: () => (/* binding */ Pusher)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n/* harmony import */ var _Options_Classes_Push_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Options/Classes/Push.js */ \"../../interactions/external/push/dist/browser/Options/Classes/Push.js\");\n\n\nconst pushMode = \"push\",\n  minQuantity = 0;\nclass Pusher extends _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.ExternalInteractorBase {\n  constructor(container) {\n    super(container);\n    this.handleClickMode = mode => {\n      if (mode !== pushMode) {\n        return;\n      }\n      const container = this.container,\n        options = container.actualOptions,\n        pushOptions = options.interactivity.modes.push;\n      if (!pushOptions) {\n        return;\n      }\n      const quantity = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getRangeValue)(pushOptions.quantity);\n      if (quantity <= minQuantity) {\n        return;\n      }\n      const group = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.itemFromArray)([undefined, ...pushOptions.groups]),\n        groupOptions = group !== undefined ? container.actualOptions.particles.groups[group] : undefined;\n      void container.particles.push(quantity, container.interactivity.mouse, groupOptions, group);\n    };\n  }\n  clear() {}\n  init() {}\n  interact() {}\n  isEnabled() {\n    return true;\n  }\n  loadModeOptions(options, ...sources) {\n    if (!options.push) {\n      options.push = new _Options_Classes_Push_js__WEBPACK_IMPORTED_MODULE_1__.Push();\n    }\n    for (const source of sources) {\n      options.push.load(source?.push);\n    }\n  }\n  reset() {}\n}\n\n//# sourceURL=webpack://tsparticles/../../interactions/external/push/dist/browser/Pusher.js?");

/***/ })

}]);