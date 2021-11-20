"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _default = function () {
  return {
    id: 17,
    spawnable: true,
    transparent: true,
    selflit: false,
    gravity: false,
    fluid: false,
    texture: function texture(world, lightmap, lit, x, y, z, dir) {
      return [1 / 16, 3 / 16, 2 / 16, 4 / 16];
    }
  };
}();

exports["default"] = _default;