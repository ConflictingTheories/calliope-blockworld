"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _default = function () {
  return {
    id: 6,
    spawnable: false,
    transparent: true,
    selflit: true,
    gravity: true,
    fluid: true,
    texture: function texture(world, lightmap, lit, x, y, z, dir) {
      return [13 / 16, 14 / 16, 14 / 16, 15 / 16];
    }
  };
}();

exports["default"] = _default;