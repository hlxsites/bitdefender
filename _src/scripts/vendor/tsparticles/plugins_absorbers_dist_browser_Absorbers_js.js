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
(this["webpackChunktsparticles"] = this["webpackChunktsparticles"] || []).push([["plugins_absorbers_dist_browser_Absorbers_js"],{

/***/ "../../plugins/absorbers/dist/browser/Absorbers.js":
/*!*********************************************************!*\
  !*** ../../plugins/absorbers/dist/browser/Absorbers.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Absorbers: () => (/* binding */ Absorbers)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n\nconst defaultIndex = 0;\nclass Absorbers {\n  constructor(container) {\n    this.container = container;\n    this.array = [];\n    this.absorbers = [];\n    this.interactivityAbsorbers = [];\n    container.getAbsorber = idxOrName => idxOrName === undefined || (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.isNumber)(idxOrName) ? this.array[idxOrName ?? defaultIndex] : this.array.find(t => t.name === idxOrName);\n    container.addAbsorber = async (options, position) => this.addAbsorber(options, position);\n  }\n  async addAbsorber(options, position) {\n    const {\n        AbsorberInstance\n      } = await __webpack_require__.e(/*! import() */ \"plugins_absorbers_dist_browser_AbsorberInstance_js\").then(__webpack_require__.bind(__webpack_require__, /*! ./AbsorberInstance.js */ \"../../plugins/absorbers/dist/browser/AbsorberInstance.js\")),\n      absorber = new AbsorberInstance(this, this.container, options, position);\n    this.array.push(absorber);\n    return absorber;\n  }\n  draw(context) {\n    for (const absorber of this.array) {\n      absorber.draw(context);\n    }\n  }\n  handleClickMode(mode) {\n    const absorberOptions = this.absorbers,\n      modeAbsorbers = this.interactivityAbsorbers;\n    if (mode === \"absorber\") {\n      const absorbersModeOptions = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.itemFromSingleOrMultiple)(modeAbsorbers),\n        absorbersOptions = absorbersModeOptions ?? (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.itemFromSingleOrMultiple)(absorberOptions),\n        aPosition = this.container.interactivity.mouse.clickPosition;\n      void this.addAbsorber(absorbersOptions, aPosition);\n    }\n  }\n  async init() {\n    this.absorbers = this.container.actualOptions.absorbers;\n    this.interactivityAbsorbers = this.container.actualOptions.interactivity.modes.absorbers;\n    const promises = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.executeOnSingleOrMultiple)(this.absorbers, async absorber => {\n      await this.addAbsorber(absorber);\n    });\n    if (promises instanceof Array) {\n      await Promise.all(promises);\n    } else {\n      await promises;\n    }\n  }\n  particleUpdate(particle) {\n    for (const absorber of this.array) {\n      absorber.attract(particle);\n      if (particle.destroyed) {\n        break;\n      }\n    }\n  }\n  removeAbsorber(absorber) {\n    const index = this.array.indexOf(absorber),\n      deleteCount = 1;\n    if (index >= defaultIndex) {\n      this.array.splice(index, deleteCount);\n    }\n  }\n  resize() {\n    for (const absorber of this.array) {\n      absorber.resize();\n    }\n  }\n  stop() {\n    this.array = [];\n  }\n}\n\n//# sourceURL=webpack://tsparticles/../../plugins/absorbers/dist/browser/Absorbers.js?");

/***/ })

}]);