"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _enums = require("../../utils/enums.jsx");

var _default = function () {
  return {
    id: 2,
    spawnable: true,
    transparent: false,
    selflit: false,
    gravity: false,
    fluid: false,
    texture: function texture(world, lightmap, lit, x, y, z, dir) {
      if (dir == _enums.DIRECTION.UP && lit) return [14 / 16, 0 / 16, 15 / 16, 1 / 16];else if (dir == _enums.DIRECTION.DOWN || !lit) return [2 / 16, 0 / 16, 3 / 16, 1 / 16];else return [3 / 16, 0 / 16, 4 / 16, 1 / 16];
    }
  };
}();

exports["default"] = _default;