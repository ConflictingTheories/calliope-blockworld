"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

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
var _default = function () {
  return {
    id: 1,
    spawnable: false,
    selflit: false,
    gravity: false,
    fluid: false,
    transparent: false,
    texture: function texture(world, lightmap, lit, x, y, z, dir) {
      return [1 / 16, 1 / 16, 2 / 16, 2 / 16];
    }
  };
}();

exports["default"] = _default;