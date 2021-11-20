"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vector = require("./utils/vector");

var _enums = require("./enums");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

// Block Object Model
var _default = function () {
  // Default Functions
  var BLK = {
    // Find Block by ID
    fromId: function fromId(id) {
      for (var mat in BLK) {
        if (_typeof(BLK[mat]) === "object" && BLK[mat].id === id) return BLK[mat];
      }

      return null;
    },
    // Push Top Vertices
    pushTop: function pushTop(vertices, x, y, z, bH, c, lm) {
      (0, _vector.pushQuad)(vertices, [x, y, z + bH, c[0], c[1], lm, lm, lm, 1.0], [x + 1.0, y, z + bH, c[2], c[1], lm, lm, lm, 1.0], [x + 1.0, y + 1.0, z + bH, c[2], c[3], lm, lm, lm, 1.0], [x, y + 1.0, z + bH, c[0], c[3], lm, lm, lm, 1.0]);
    },
    // Push Front Vertices
    pushFront: function pushFront(vertices, x, y, z, bH, c, lm) {
      (0, _vector.pushQuad)(vertices, [x, y, z, c[0], c[3], lm, lm, lm, 1.0], [x + 1.0, y, z, c[2], c[3], lm, lm, lm, 1.0], [x + 1.0, y, z + bH, c[2], c[1], lm, lm, lm, 1.0], [x, y, z + bH, c[0], c[1], lm, lm, lm, 1.0]);
    },
    // Push Back Vertices
    pushBack: function pushBack(vertices, x, y, z, bH, c, lm) {
      (0, _vector.pushQuad)(vertices, [x, y, z + bH, c[2], c[1], lm, lm, lm, 1.0], [x, y + 1.0, z + bH, c[0], c[1], lm, lm, lm, 1.0], [x, y + 1.0, z, c[0], c[3], lm, lm, lm, 1.0], [x, y, z, c[2], c[3], lm, lm, lm, 1.0]);
    },
    // Push Bottom Vertices
    pushBottom: function pushBottom(vertices, x, y, z, c, lm) {
      (0, _vector.pushQuad)(vertices, [x, y + 1.0, z, c[0], c[3], lm, lm, lm, 1.0], [x + 1.0, y + 1.0, z, c[2], c[3], lm, lm, lm, 1.0], [x + 1.0, y, z, c[2], c[1], lm, lm, lm, 1.0], [x, y, z, c[0], c[1], lm, lm, lm, 1.0]);
    },
    // Push Right Vertices
    pushRight: function pushRight(vertices, x, y, z, bH, c, lm) {
      (0, _vector.pushQuad)(vertices, [x + 1.0, y, z, c[0], c[3], lm, lm, lm, 1.0], [x + 1.0, y + 1.0, z, c[2], c[3], lm, lm, lm, 1.0], [x + 1.0, y + 1.0, z + bH, c[2], c[1], lm, lm, lm, 1.0], [x + 1.0, y, z + bH, c[0], c[1], lm, lm, lm, 1.0]);
    },
    // Push Left Vertices
    pushLeft: function pushLeft(vertices, x, y, z, bH, c, lm) {
      (0, _vector.pushQuad)(vertices, [x, y, z + bH, c[2], c[1], lm, lm, lm, 1.0], [x, y + 1.0, z + bH, c[0], c[1], lm, lm, lm, 1.0], [x, y + 1.0, z, c[0], c[3], lm, lm, lm, 1.0], [x, y, z, c[2], c[3], lm, lm, lm, 1.0]);
    },
    // Pushes the vertices necessary for rendering
    pushVertices: function pushVertices(vertices, world, lightmap, x, y, z) {
      var blocks = world.blocks;
      var blockLit = z >= lightmap[x][y];
      var block = blocks[x][y][z];
      var bH = block.fluid && (z === world.sz - 1 || !blocks[x][y][z + 1].fluid) ? 0.9 : 1.0; // Top

      if (z === world.sz - 1 || world.blocks[x][y][z + 1].transparent || block.fluid) {
        var c = block.texture(world, lightmap, blockLit, x, y, z, _enums.DIRECTION.UP);
        var lightMultiplier = z >= lightmap[x][y] ? 1.0 : 0.6;
        if (block.selflit) lightMultiplier = 1.0;
        BLK.pushTop(vertices, x, y, z, bH, c, lightMultiplier);
      } // Bottom


      if (z === 0 || world.blocks[x][y][z - 1].transparent) {
        var _c = block.texture(world, lightmap, blockLit, x, y, z, _enums.DIRECTION.DOWN);

        var _lightMultiplier = block.selflit ? 1.0 : 0.6;

        BLK.pushBottom(vertices, x, y, z, _c, _lightMultiplier);
      } // Front


      if (y === 0 || world.blocks[x][y - 1][z].transparent) {
        var _c2 = block.texture(world, lightmap, blockLit, x, y, z, _enums.DIRECTION.FORWARD);

        var _lightMultiplier2 = y === 0 || z >= lightmap[x][y - 1] ? 1.0 : 0.6;

        if (block.selflit) _lightMultiplier2 = 1.0; // Push Shader Vertex Shaders

        BLK.pushFront(vertices, x, y, z, bH, _c2, _lightMultiplier2);
      } // Back


      if (y === world.sy - 1 || world.blocks[x][y + 1][z].transparent) {
        var _c3 = block.texture(world, lightmap, blockLit, x, y, z, _enums.DIRECTION.BACK);

        var _lightMultiplier3 = block.selflit ? 1.0 : 0.6;

        BLK.pushBack(vertices, x, y, z, bH, _c3, _lightMultiplier3);
      } // Left


      if (x === 0 || world.blocks[x - 1][y][z].transparent) {
        var _c4 = block.texture(world, lightmap, blockLit, x, y, z, _enums.DIRECTION.LEFT);

        var _lightMultiplier4 = block.selflit ? 1.0 : 0.6;

        BLK.pushLeft(vertices, x, y, z, bH, _c4, _lightMultiplier4);
      } // Right


      if (x === world.sx - 1 || world.blocks[x + 1][y][z].transparent) {
        var _c5 = block.texture(world, lightmap, blockLit, x, y, z, _enums.DIRECTION.RIGHT);

        console.log(_c5);

        var _lightMultiplier5 = x === world.sx - 1 || z >= lightmap[x + 1][y] ? 1.0 : 0.6;

        if (block.selflit) _lightMultiplier5 = 1.0;
        BLK.pushRight(vertices, x, y, z, bH, _c5, _lightMultiplier5);
      }
    },
    // Pushes vertices with the data needed for picking.
    pushPickingVertices: function pushPickingVertices(vertices, x, y, z) {
      var color = {
        r: x / 255,
        g: y / 255,
        b: z / 255
      }; // Top

      (0, _vector.pushQuad)(vertices, [x, y, z + 1, 0, 0, color.r, color.g, color.b, 1 / 255], [x + 1, y, z + 1, 1, 0, color.r, color.g, color.b, 1 / 255], [x + 1, y + 1, z + 1, 1, 1, color.r, color.g, color.b, 1 / 255], [x, y + 1, z + 1, 0, 0, color.r, color.g, color.b, 1 / 255]); // Bottom

      (0, _vector.pushQuad)(vertices, [x, y + 1, z, 0, 0, color.r, color.g, color.b, 2 / 255], [x + 1, y + 1, z, 1, 0, color.r, color.g, color.b, 2 / 255], [x + 1, y, z, 1, 1, color.r, color.g, color.b, 2 / 255], [x, y, z, 0, 0, color.r, color.g, color.b, 2 / 255]); // Front

      (0, _vector.pushQuad)(vertices, [x, y, z, 0, 0, color.r, color.g, color.b, 3 / 255], [x + 1, y, z, 1, 0, color.r, color.g, color.b, 3 / 255], [x + 1, y, z + 1, 1, 1, color.r, color.g, color.b, 3 / 255], [x, y, z + 1, 0, 0, color.r, color.g, color.b, 3 / 255]); // Back

      (0, _vector.pushQuad)(vertices, [x, y + 1, z + 1, 0, 0, color.r, color.g, color.b, 4 / 255], [x + 1, y + 1, z + 1, 1, 0, color.r, color.g, color.b, 4 / 255], [x + 1, y + 1, z, 1, 1, color.r, color.g, color.b, 4 / 255], [x, y + 1, z, 0, 0, color.r, color.g, color.b, 4 / 255]); // Left

      (0, _vector.pushQuad)(vertices, [x, y, z + 1, 0, 0, color.r, color.g, color.b, 5 / 255], [x, y + 1, z + 1, 1, 0, color.r, color.g, color.b, 5 / 255], [x, y + 1, z, 1, 1, color.r, color.g, color.b, 5 / 255], [x, y, z, 0, 0, color.r, color.g, color.b, 5 / 255]); // Right

      (0, _vector.pushQuad)(vertices, [x + 1, y, z, 0, 0, color.r, color.g, color.b, 6 / 255], [x + 1, y + 1, z, 1, 0, color.r, color.g, color.b, 6 / 255], [x + 1, y + 1, z + 1, 1, 1, color.r, color.g, color.b, 6 / 255], [x + 1, y, z + 1, 0, 0, color.r, color.g, color.b, 6 / 255]);
    }
  }; // Block types

  var blockType = ["AIR", "DIRT", "BEDROCK", "BOOKCASE", "BRICK", "COBBLESTONE", "CONCRETE", "DIAMOND", "GLASS", "GOLD", "GRAVEL", "LAVA", "OBSIDIAN", "PLANK", "SPONGE", "TNT", "WOOD"]; // Add Block Types

  blockType.forEach(function (type) {
    BLK[type] = require("./blockTypes/".concat(type, ".jsx"))["default"];
  });
  return BLK;
}();

exports["default"] = _default;