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
(this["webpackChunktsparticles"] = this["webpackChunktsparticles"] || []).push([["updaters_life_dist_browser_index_js"],{

/***/ "../../updaters/life/dist/browser/index.js":
/*!*************************************************!*\
  !*** ../../updaters/life/dist/browser/index.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   loadLifeUpdater: () => (/* binding */ loadLifeUpdater)\n/* harmony export */ });\nasync function loadLifeUpdater(engine, refresh = true) {\n  await engine.addParticleUpdater(\"life\", async container => {\n    const {\n      LifeUpdater\n    } = await __webpack_require__.e(/*! import() */ \"updaters_life_dist_browser_LifeUpdater_js\").then(__webpack_require__.bind(__webpack_require__, /*! ./LifeUpdater.js */ \"../../updaters/life/dist/browser/LifeUpdater.js\"));\n    return new LifeUpdater(container);\n  }, refresh);\n}\n\n//# sourceURL=webpack://tsparticles/../../updaters/life/dist/browser/index.js?");

/***/ })

}]);