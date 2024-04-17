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
(this["webpackChunktsparticles"] = this["webpackChunktsparticles"] || []).push([["shapes_polygon_dist_browser_PolygonDrawer_js"],{

/***/ "../../shapes/polygon/dist/browser/PolygonDrawer.js":
/*!**********************************************************!*\
  !*** ../../shapes/polygon/dist/browser/PolygonDrawer.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   PolygonDrawer: () => (/* binding */ PolygonDrawer)\n/* harmony export */ });\n/* harmony import */ var _PolygonDrawerBase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PolygonDrawerBase.js */ \"../../shapes/polygon/dist/browser/PolygonDrawerBase.js\");\n\nconst sidesCenterFactor = 3.5,\n  yFactor = 2.66,\n  sidesFactor = 3;\nclass PolygonDrawer extends _PolygonDrawerBase_js__WEBPACK_IMPORTED_MODULE_0__.PolygonDrawerBase {\n  getCenter(particle, radius) {\n    return {\n      x: -radius / (particle.sides / sidesCenterFactor),\n      y: -radius / (yFactor / sidesCenterFactor)\n    };\n  }\n  getSidesData(particle, radius) {\n    const sides = particle.sides;\n    return {\n      count: {\n        denominator: 1,\n        numerator: sides\n      },\n      length: radius * yFactor / (sides / sidesFactor)\n    };\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../shapes/polygon/dist/browser/PolygonDrawer.js?");

/***/ }),

/***/ "../../shapes/polygon/dist/browser/PolygonDrawerBase.js":
/*!**************************************************************!*\
  !*** ../../shapes/polygon/dist/browser/PolygonDrawerBase.js ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   PolygonDrawerBase: () => (/* binding */ PolygonDrawerBase)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n/* harmony import */ var _Utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utils.js */ \"../../shapes/polygon/dist/browser/Utils.js\");\n\n\nconst defaultSides = 5;\nclass PolygonDrawerBase {\n  draw(data) {\n    const {\n        particle,\n        radius\n      } = data,\n      start = this.getCenter(particle, radius),\n      side = this.getSidesData(particle, radius);\n    (0,_Utils_js__WEBPACK_IMPORTED_MODULE_1__.drawPolygon)(data, start, side);\n  }\n  getSidesCount(particle) {\n    const polygon = particle.shapeData;\n    return Math.round((0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getRangeValue)(polygon?.sides ?? defaultSides));\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../shapes/polygon/dist/browser/PolygonDrawerBase.js?");

/***/ }),

/***/ "../../shapes/polygon/dist/browser/Utils.js":
/*!**************************************************!*\
  !*** ../../shapes/polygon/dist/browser/Utils.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   drawPolygon: () => (/* binding */ drawPolygon)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n\nconst piDeg = 180,\n  origin = {\n    x: 0,\n    y: 0\n  },\n  sidesOffset = 2;\nfunction drawPolygon(data, start, side) {\n  const {\n      context\n    } = data,\n    sideCount = side.count.numerator * side.count.denominator,\n    decimalSides = side.count.numerator / side.count.denominator,\n    interiorAngleDegrees = piDeg * (decimalSides - sidesOffset) / decimalSides,\n    interiorAngle = Math.PI - (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.degToRad)(interiorAngleDegrees);\n  if (!context) {\n    return;\n  }\n  context.beginPath();\n  context.translate(start.x, start.y);\n  context.moveTo(origin.x, origin.y);\n  for (let i = 0; i < sideCount; i++) {\n    context.lineTo(side.length, origin.y);\n    context.translate(side.length, origin.y);\n    context.rotate(interiorAngle);\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../shapes/polygon/dist/browser/Utils.js?");

/***/ })

}]);