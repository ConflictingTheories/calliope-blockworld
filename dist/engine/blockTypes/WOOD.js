"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _enums = require("../enums");

var _default = function () {
  return {
    id: 3,
    spawnable: true,
    transparent: false,
    selflit: false,
    gravity: false,
    fluid: false,
    texture: function texture(world, lightmap, lit, x, y, z, dir) {
      if (dir === _enums.DIRECTION.UP || dir === _enums.DIRECTION.DOWN) return [5 / 16, 1 / 16, 6 / 16, 2 / 16];
      return [4 / 16, 1 / 16, 5 / 16, 2 / 16];
    }
  };
}();

exports["default"] = _default;