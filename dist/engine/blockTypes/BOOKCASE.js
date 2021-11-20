"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _enums = require("../enums");

var _default = function () {
  return {
    id: 5,
    spawnable: true,
    transparent: false,
    selflit: false,
    gravity: false,
    fluid: false,
    texture: function texture(world, lightmap, lit, x, y, z, dir) {
      if (dir === _enums.DIRECTION.FORWARD || dir === _enums.DIRECTION.BACK) return [3 / 16, 2 / 16, 4 / 16, 3 / 16];
      return [4 / 16, 0 / 16, 5 / 16, 1 / 16];
    }
  };
}();

exports["default"] = _default;