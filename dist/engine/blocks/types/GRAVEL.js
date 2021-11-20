"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _default = function () {
  return {
    id: 12,
    spawnable: true,
    transparent: false,
    selflit: false,
    gravity: true,
    fluid: false,
    texture: function texture(world, lightmap, lit, x, y, z, dir) {
      return [3 / 16, 1 / 16, 4 / 16, 2 / 16];
    }
  };
}();

exports["default"] = _default;