"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _enums = require("../../utils/enums.jsx");

var _default = function () {
  return {
    id: 4,
    spawnable: true,
    transparent: false,
    selflit: false,
    gravity: false,
    fluid: false,
    texture: function texture(world, lightmap, lit, x, y, z, dir) {
      if (dir === _enums.DIRECTION.UP || dir === _enums.DIRECTION.DOWN) return [10 / 16, 0 / 16, 11 / 16, 1 / 16];
      return [8 / 16, 0 / 16, 9 / 16, 1 / 16];
    }
  };
}();

exports["default"] = _default;