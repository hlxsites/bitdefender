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
(this["webpackChunktsparticles"] = this["webpackChunktsparticles"] || []).push([["basic_dist_browser_index_js"],{

/***/ "../basic/dist/browser/index.js":
/*!**************************************!*\
  !*** ../basic/dist/browser/index.js ***!
  \**************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   loadBasic: () => (/* binding */ loadBasic)\n/* harmony export */ });\nasync function loadBasic(engine, refresh = true) {\n  const {\n      loadBaseMover\n    } = await __webpack_require__.e(/*! import() */ \"move_base_dist_browser_index_js\").then(__webpack_require__.bind(__webpack_require__, /*! @tsparticles/move-base */ \"../../move/base/dist/browser/index.js\")),\n    {\n      loadCircleShape\n    } = await __webpack_require__.e(/*! import() */ \"shapes_circle_dist_browser_index_js\").then(__webpack_require__.bind(__webpack_require__, /*! @tsparticles/shape-circle */ \"../../shapes/circle/dist/browser/index.js\")),\n    {\n      loadColorUpdater\n    } = await __webpack_require__.e(/*! import() */ \"updaters_color_dist_browser_index_js\").then(__webpack_require__.bind(__webpack_require__, /*! @tsparticles/updater-color */ \"../../updaters/color/dist/browser/index.js\")),\n    {\n      loadOpacityUpdater\n    } = await __webpack_require__.e(/*! import() */ \"updaters_opacity_dist_browser_index_js\").then(__webpack_require__.bind(__webpack_require__, /*! @tsparticles/updater-opacity */ \"../../updaters/opacity/dist/browser/index.js\")),\n    {\n      loadOutModesUpdater\n    } = await __webpack_require__.e(/*! import() */ \"updaters_outModes_dist_browser_index_js\").then(__webpack_require__.bind(__webpack_require__, /*! @tsparticles/updater-out-modes */ \"../../updaters/outModes/dist/browser/index.js\")),\n    {\n      loadSizeUpdater\n    } = await __webpack_require__.e(/*! import() */ \"updaters_size_dist_browser_index_js\").then(__webpack_require__.bind(__webpack_require__, /*! @tsparticles/updater-size */ \"../../updaters/size/dist/browser/index.js\"));\n  await loadBaseMover(engine, false);\n  await loadCircleShape(engine, false);\n  await loadColorUpdater(engine, false);\n  await loadOpacityUpdater(engine, false);\n  await loadOutModesUpdater(engine, false);\n  await loadSizeUpdater(engine, false);\n  await engine.refresh(refresh);\n}\n\n//# sourceURL=webpack://tsparticles/../basic/dist/browser/index.js?");

/***/ })

}]);