"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _default = function () {
  return {
    id: 13,
    spawnable: true,
    transparent: false,
    selflit: false,
    gravity: false,
    fluid: false,
    texture: function texture(world, lightmap, lit, x, y, z, dir) {
      return [6 / 16, 1 / 16, 7 / 16, 2 / 16];
    }
  };
}();

exports["default"] = _default;