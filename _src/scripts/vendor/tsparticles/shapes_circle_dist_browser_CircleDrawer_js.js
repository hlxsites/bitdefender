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
(this["webpackChunktsparticles"] = this["webpackChunktsparticles"] || []).push([["shapes_circle_dist_browser_CircleDrawer_js"],{

/***/ "../../shapes/circle/dist/browser/CircleDrawer.js":
/*!********************************************************!*\
  !*** ../../shapes/circle/dist/browser/CircleDrawer.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   CircleDrawer: () => (/* binding */ CircleDrawer)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n/* harmony import */ var _Utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utils.js */ \"../../shapes/circle/dist/browser/Utils.js\");\n\n\nconst sides = 12,\n  maxAngle = 360,\n  minAngle = 0;\nclass CircleDrawer {\n  draw(data) {\n    (0,_Utils_js__WEBPACK_IMPORTED_MODULE_1__.drawCircle)(data);\n  }\n  getSidesCount() {\n    return sides;\n  }\n  particleInit(container, particle) {\n    const shapeData = particle.shapeData,\n      angle = shapeData?.angle ?? {\n        max: maxAngle,\n        min: minAngle\n      };\n    particle.circleRange = !(0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.isObject)(angle) ? {\n      min: minAngle,\n      max: (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.degToRad)(angle)\n    } : {\n      min: (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.degToRad)(angle.min),\n      max: (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.degToRad)(angle.max)\n    };\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../shapes/circle/dist/browser/CircleDrawer.js?");

/***/ }),

/***/ "../../shapes/circle/dist/browser/Utils.js":
/*!*************************************************!*\
  !*** ../../shapes/circle/dist/browser/Utils.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   drawCircle: () => (/* binding */ drawCircle)\n/* harmony export */ });\nconst double = 2,\n  doublePI = Math.PI * double,\n  minAngle = 0,\n  origin = {\n    x: 0,\n    y: 0\n  };\nfunction drawCircle(data) {\n  const {\n    context,\n    particle,\n    radius\n  } = data;\n  if (!particle.circleRange) {\n    particle.circleRange = {\n      min: minAngle,\n      max: doublePI\n    };\n  }\n  const circleRange = particle.circleRange;\n  context.arc(origin.x, origin.y, radius, circleRange.min, circleRange.max, false);\n}\n\n//# sourceURL=webpack://tsparticles/../../shapes/circle/dist/browser/Utils.js?");

/***/ })

}]);