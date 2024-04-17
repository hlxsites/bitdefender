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
(this["webpackChunktsparticles"] = this["webpackChunktsparticles"] || []).push([["interactions_external_connect_dist_browser_Connector_js"],{

/***/ "../../interactions/external/connect/dist/browser/Connector.js":
/*!*********************************************************************!*\
  !*** ../../interactions/external/connect/dist/browser/Connector.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Connector: () => (/* binding */ Connector)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n/* harmony import */ var _Options_Classes_Connect_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Options/Classes/Connect.js */ \"../../interactions/external/connect/dist/browser/Options/Classes/Connect.js\");\n/* harmony import */ var _Utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Utils.js */ \"../../interactions/external/connect/dist/browser/Utils.js\");\n\n\n\nconst connectMode = \"connect\",\n  minDistance = 0;\nclass Connector extends _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.ExternalInteractorBase {\n  constructor(container) {\n    super(container);\n  }\n  clear() {}\n  init() {\n    const container = this.container,\n      connect = container.actualOptions.interactivity.modes.connect;\n    if (!connect) {\n      return;\n    }\n    container.retina.connectModeDistance = connect.distance * container.retina.pixelRatio;\n    container.retina.connectModeRadius = connect.radius * container.retina.pixelRatio;\n  }\n  interact() {\n    const container = this.container,\n      options = container.actualOptions;\n    if (options.interactivity.events.onHover.enable && container.interactivity.status === \"pointermove\") {\n      const mousePos = container.interactivity.mouse.position,\n        {\n          connectModeDistance,\n          connectModeRadius\n        } = container.retina;\n      if (!connectModeDistance || connectModeDistance < minDistance || !connectModeRadius || connectModeRadius < minDistance || !mousePos) {\n        return;\n      }\n      const distance = Math.abs(connectModeRadius),\n        query = container.particles.quadTree.queryCircle(mousePos, distance, p => this.isEnabled(p));\n      query.forEach((p1, i) => {\n        const pos1 = p1.getPosition(),\n          indexOffset = 1;\n        for (const p2 of query.slice(i + indexOffset)) {\n          const pos2 = p2.getPosition(),\n            distMax = Math.abs(connectModeDistance),\n            xDiff = Math.abs(pos1.x - pos2.x),\n            yDiff = Math.abs(pos1.y - pos2.y);\n          if (xDiff < distMax && yDiff < distMax) {\n            (0,_Utils_js__WEBPACK_IMPORTED_MODULE_2__.drawConnection)(container, p1, p2);\n          }\n        }\n      });\n    }\n  }\n  isEnabled(particle) {\n    const container = this.container,\n      mouse = container.interactivity.mouse,\n      events = (particle?.interactivity ?? container.actualOptions.interactivity).events;\n    if (!(events.onHover.enable && mouse.position)) {\n      return false;\n    }\n    return (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.isInArray)(connectMode, events.onHover.mode);\n  }\n  loadModeOptions(options, ...sources) {\n    if (!options.connect) {\n      options.connect = new _Options_Classes_Connect_js__WEBPACK_IMPORTED_MODULE_1__.Connect();\n    }\n    for (const source of sources) {\n      options.connect.load(source?.connect);\n    }\n  }\n  reset() {}\n}\n\n//# sourceURL=webpack://tsparticles/../../interactions/external/connect/dist/browser/Connector.js?");

/***/ }),

/***/ "../../interactions/external/connect/dist/browser/Utils.js":
/*!*****************************************************************!*\
  !*** ../../interactions/external/connect/dist/browser/Utils.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   drawConnectLine: () => (/* binding */ drawConnectLine),\n/* harmony export */   drawConnection: () => (/* binding */ drawConnection),\n/* harmony export */   gradient: () => (/* binding */ gradient),\n/* harmony export */   lineStyle: () => (/* binding */ lineStyle)\n/* harmony export */ });\n/* harmony import */ var _tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tsparticles/engine */ \"../../engine/dist/browser/index.js\");\n\nconst gradientMin = 0,\n  gradientMax = 1,\n  defaultLinksWidth = 0;\nfunction gradient(context, p1, p2, opacity) {\n  const gradStop = Math.floor(p2.getRadius() / p1.getRadius()),\n    color1 = p1.getFillColor(),\n    color2 = p2.getFillColor();\n  if (!color1 || !color2) {\n    return;\n  }\n  const sourcePos = p1.getPosition(),\n    destPos = p2.getPosition(),\n    midRgb = (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.colorMix)(color1, color2, p1.getRadius(), p2.getRadius()),\n    grad = context.createLinearGradient(sourcePos.x, sourcePos.y, destPos.x, destPos.y);\n  grad.addColorStop(gradientMin, (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getStyleFromHsl)(color1, opacity));\n  grad.addColorStop((0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.clamp)(gradStop, gradientMin, gradientMax), (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getStyleFromRgb)(midRgb, opacity));\n  grad.addColorStop(gradientMax, (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getStyleFromHsl)(color2, opacity));\n  return grad;\n}\nfunction drawConnectLine(context, width, lineStyle, begin, end) {\n  (0,_tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.drawLine)(context, begin, end);\n  context.lineWidth = width;\n  context.strokeStyle = lineStyle;\n  context.stroke();\n}\nfunction lineStyle(container, ctx, p1, p2) {\n  const options = container.actualOptions,\n    connectOptions = options.interactivity.modes.connect;\n  if (!connectOptions) {\n    return;\n  }\n  return gradient(ctx, p1, p2, connectOptions.links.opacity);\n}\nfunction drawConnection(container, p1, p2) {\n  container.canvas.draw(ctx => {\n    const ls = lineStyle(container, ctx, p1, p2);\n    if (!ls) {\n      return;\n    }\n    const pos1 = p1.getPosition(),\n      pos2 = p2.getPosition();\n    drawConnectLine(ctx, p1.retina.linksWidth ?? defaultLinksWidth, ls, pos1, pos2);\n  });\n}\n\n//# sourceURL=webpack://tsparticles/../../interactions/external/connect/dist/browser/Utils.js?");

/***/ })

}]);