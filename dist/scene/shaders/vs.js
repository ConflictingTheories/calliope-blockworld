"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = vs;

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
function vs() {
  return "\n  uniform mat4 uModelMatrix;\n  uniform mat4 uViewMatrix;\n  uniform mat4 uProjMatrix;\n\n  attribute vec3 aPos;\n  attribute vec2 aTexCoord;\n  attribute vec4 aColor;\n\n  varying vec4 vColor;\n  varying vec2 vTexCoord;\n\n  void main(void) {\n    gl_Position = uProjMatrix * uViewMatrix * ( uModelMatrix * vec4( aPos, 1.0 ) );\n    vTexCoord = aTexCoord;\n    vColor = vec4(aColor.rgb, 1.0);\n  }\n";
}