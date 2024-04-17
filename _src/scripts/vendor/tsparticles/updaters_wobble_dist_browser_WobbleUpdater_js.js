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
(this["webpackChunktsparticles"] = this["webpackChunktsparticles"] || []).push([["updaters_wobble_dist_browser_WobbleUpdater_js"],{

/***/ "../../updaters/wobble/dist/browser/Options/Classes/Wobble.js":
/*!********************************************************************!*\
  !*** ../../updaters/wobble/dist/browser/Options/Classes/Wobble.js ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Wobble: () => (/* binding */ Wobble)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n/* harmony import */ var _WobbleSpeed_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./WobbleSpeed.js */ \"../../updaters/wobble/dist/browser/Options/Classes/WobbleSpeed.js\");\n\n\nclass Wobble {\n  constructor() {\n    this.distance = 5;\n    this.enable = false;\n    this.speed = new _WobbleSpeed_js__WEBPACK_IMPORTED_MODULE_1__.WobbleSpeed();\n  }\n  load(data) {\n    if (!data) {\n      return;\n    }\n    if (data.distance !== undefined) {\n      this.distance = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.setRangeValue)(data.distance);\n    }\n    if (data.enable !== undefined) {\n      this.enable = data.enable;\n    }\n    if (data.speed !== undefined) {\n      if ((0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.isNumber)(data.speed)) {\n        this.speed.load({\n          angle: data.speed\n        });\n      } else {\n        const rangeSpeed = data.speed;\n        if (rangeSpeed.min !== undefined) {\n          this.speed.load({\n            angle: rangeSpeed\n          });\n        } else {\n          this.speed.load(data.speed);\n        }\n      }\n    }\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../updaters/wobble/dist/browser/Options/Classes/Wobble.js?");

/***/ }),

/***/ "../../updaters/wobble/dist/browser/Options/Classes/WobbleSpeed.js":
/*!*************************************************************************!*\
  !*** ../../updaters/wobble/dist/browser/Options/Classes/WobbleSpeed.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   WobbleSpeed: () => (/* binding */ WobbleSpeed)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n\nclass WobbleSpeed {\n  constructor() {\n    this.angle = 50;\n    this.move = 10;\n  }\n  load(data) {\n    if (!data) {\n      return;\n    }\n    if (data.angle !== undefined) {\n      this.angle = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.setRangeValue)(data.angle);\n    }\n    if (data.move !== undefined) {\n      this.move = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.setRangeValue)(data.move);\n    }\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../updaters/wobble/dist/browser/Options/Classes/WobbleSpeed.js?");

/***/ }),

/***/ "../../updaters/wobble/dist/browser/Utils.js":
/*!***************************************************!*\
  !*** ../../updaters/wobble/dist/browser/Utils.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   updateWobble: () => (/* binding */ updateWobble)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n\nconst defaultDistance = 0,\n  double = 2,\n  doublePI = Math.PI * double,\n  distanceFactor = 60;\nfunction updateWobble(particle, delta) {\n  const {\n      wobble: wobbleOptions\n    } = particle.options,\n    {\n      wobble\n    } = particle;\n  if (!wobbleOptions?.enable || !wobble) {\n    return;\n  }\n  const angleSpeed = wobble.angleSpeed * delta.factor,\n    moveSpeed = wobble.moveSpeed * delta.factor,\n    distance = moveSpeed * ((particle.retina.wobbleDistance ?? defaultDistance) * delta.factor) / (_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.millisecondsToSeconds / distanceFactor),\n    max = doublePI,\n    {\n      position\n    } = particle;\n  wobble.angle += angleSpeed;\n  if (wobble.angle > max) {\n    wobble.angle -= max;\n  }\n  position.x += distance * Math.cos(wobble.angle);\n  position.y += distance * Math.abs(Math.sin(wobble.angle));\n}\n\n//# sourceURL=webpack://tsparticles/../../updaters/wobble/dist/browser/Utils.js?");

/***/ }),

/***/ "../../updaters/wobble/dist/browser/WobbleUpdater.js":
/*!***********************************************************!*\
  !*** ../../updaters/wobble/dist/browser/WobbleUpdater.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   WobbleUpdater: () => (/* binding */ WobbleUpdater)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n/* harmony import */ var _Options_Classes_Wobble_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Options/Classes/Wobble.js */ \"../../updaters/wobble/dist/browser/Options/Classes/Wobble.js\");\n/* harmony import */ var _Utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Utils.js */ \"../../updaters/wobble/dist/browser/Utils.js\");\n\n\n\nconst double = 2,\n  doublePI = Math.PI * double,\n  maxAngle = 360,\n  moveSpeedFactor = 10,\n  defaultDistance = 0;\nclass WobbleUpdater {\n  constructor(container) {\n    this.container = container;\n  }\n  init(particle) {\n    const wobbleOpt = particle.options.wobble;\n    if (wobbleOpt?.enable) {\n      particle.wobble = {\n        angle: (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getRandom)() * doublePI,\n        angleSpeed: (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getRangeValue)(wobbleOpt.speed.angle) / maxAngle,\n        moveSpeed: (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getRangeValue)(wobbleOpt.speed.move) / moveSpeedFactor\n      };\n    } else {\n      particle.wobble = {\n        angle: 0,\n        angleSpeed: 0,\n        moveSpeed: 0\n      };\n    }\n    particle.retina.wobbleDistance = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getRangeValue)(wobbleOpt?.distance ?? defaultDistance) * this.container.retina.pixelRatio;\n  }\n  isEnabled(particle) {\n    return !particle.destroyed && !particle.spawning && !!particle.options.wobble?.enable;\n  }\n  loadOptions(options, ...sources) {\n    if (!options.wobble) {\n      options.wobble = new _Options_Classes_Wobble_js__WEBPACK_IMPORTED_MODULE_1__.Wobble();\n    }\n    for (const source of sources) {\n      options.wobble.load(source?.wobble);\n    }\n  }\n  update(particle, delta) {\n    if (!this.isEnabled(particle)) {\n      return;\n    }\n    (0,_Utils_js__WEBPACK_IMPORTED_MODULE_2__.updateWobble)(particle, delta);\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../updaters/wobble/dist/browser/WobbleUpdater.js?");

/***/ })

}]);