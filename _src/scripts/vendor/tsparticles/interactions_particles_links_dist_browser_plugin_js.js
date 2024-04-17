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
(this["webpackChunktsparticles"] = this["webpackChunktsparticles"] || []).push([["interactions_particles_links_dist_browser_plugin_js"],{

/***/ "../../interactions/particles/links/dist/browser/plugin.js":
/*!*****************************************************************!*\
  !*** ../../interactions/particles/links/dist/browser/plugin.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   loadLinksPlugin: () => (/* binding */ loadLinksPlugin)\n/* harmony export */ });\nasync function loadLinksPlugin(engine, refresh = true) {\n  const {\n      LinksPlugin\n    } = await __webpack_require__.e(/*! import() */ \"interactions_particles_links_dist_browser_LinksPlugin_js\").then(__webpack_require__.bind(__webpack_require__, /*! ./LinksPlugin.js */ \"../../interactions/particles/links/dist/browser/LinksPlugin.js\")),\n    plugin = new LinksPlugin();\n  await engine.addPlugin(plugin, refresh);\n}\n\n//# sourceURL=webpack://tsparticles/../../interactions/particles/links/dist/browser/plugin.js?");

/***/ })

}]);