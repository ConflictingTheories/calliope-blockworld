"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _engine = _interopRequireDefault(require("../engine"));

var _enums = require("../engine/utils/enums");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/*                                                 *\
** ----------------------------------------------- **
**             Calliope - Site Generator   	       **
** ----------------------------------------------- **
**  Copyright (c) 2020-2021 - Kyle Derby MacInnis  **
**                                                 **
**    Any unauthorized distribution or transfer    **
**       of this work is strictly prohibited.      **
**                                                 **
**               All Rights Reserved.              **
** ----------------------------------------------- **
\*                                                 */
//
var WebGLView = function WebGLView(_ref) {
  var width = _ref.width,
      height = _ref.height,
      SceneProvider = _ref.SceneProvider,
      string = _ref["class"];
  var ref = (0, _react.useRef)();

  var onMouseEvent = function onMouseEvent() {
    return null;
  };

  var onKeyEvent = function onKeyEvent() {
    return null;
  };

  (0, _react.useEffect)(function () {
    var canvas = ref.current;
    var engine = new _engine["default"](canvas, width, height); // Initialize Scene

    engine.init(SceneProvider); // Attach Handlers

    onMouseEvent = SceneProvider.onMouseEvent;
    onKeyEvent = SceneProvider.onKeyEvent;
    return function () {
      engine.close();
    };
  }, [SceneProvider]);
  return /*#__PURE__*/_react["default"].createElement("canvas", {
    tabIndex: 0,
    ref: ref,
    width: width,
    height: height,
    className: string,
    onKeyDownCapture: function onKeyDownCapture(e) {
      return onKeyEvent(e.key, true, e);
    },
    onKeyUpCapture: function onKeyUpCapture(e) {
      return onKeyEvent(e.key, false, e);
    },
    onContextMenu: function onContextMenu(e) {
      return onMouseEvent(e.nativeEvent.clientX, e.nativeEvent.clientY, _enums.MOUSE.UP, true, e);
    },
    onMouseUp: function onMouseUp(e) {
      return onMouseEvent(e.nativeEvent.clientX, e.nativeEvent.clientY, _enums.MOUSE.UP, e.nativeEvent.button == 3, e);
    },
    onMouseDown: function onMouseDown(e) {
      return onMouseEvent(e.nativeEvent.clientX, e.nativeEvent.clientY, _enums.MOUSE.DOWN, e.nativeEvent.button == 3, e);
    },
    onMouseMove: function onMouseMove(e) {
      return onMouseEvent(e.nativeEvent.clientX, e.nativeEvent.clientY, _enums.MOUSE.MOVE, e.nativeEvent.button == 3, e);
    }
  });
};

WebGLView.propTypes = {
  width: _propTypes["default"].number.isRequired,
  height: _propTypes["default"].number.isRequired,
  SceneProvider: _propTypes["default"].object.isRequired,
  "class": _propTypes["default"].string.isRequired
};
var _default = WebGLView;
exports["default"] = _default;