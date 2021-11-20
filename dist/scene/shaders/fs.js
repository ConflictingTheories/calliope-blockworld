"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = fs;

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
function fs() {
  return "\n  precision highp float;\n  uniform sampler2D uSampler;\n  varying vec4 vColor;\n  varying vec2 vTexCoord;\n  void main(void) {\n    vec4 color = texture2D( uSampler, vec2( vTexCoord.s, vTexCoord.t ) ) * vec4( vColor.rgb, 1.0 );\n  \tif ( color.a < 0.1 ) discard;\n  \tgl_FragColor = vec4( color.rgb, vColor.a );\n  }\n";
}