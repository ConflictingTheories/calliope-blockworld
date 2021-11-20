"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _blocks = _interopRequireDefault(require("../blocks"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Physics = /*#__PURE__*/function () {
  function Physics() {
    var world = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    _classCallCheck(this, Physics);

    this.world = world;
    this.lastStep = -1;
  } // Assigns a world to simulate to this physics simulator.


  _createClass(Physics, [{
    key: "setWorld",
    value: function setWorld(world) {
      this.world = world;
    } // Simulate Change Iteration

  }, {
    key: "simulate",
    value: function simulate() {
      var world = this.world;
      var blocks = world.blocks;
      var step = Math.floor(new Date().getTime() / 100);
      if (step === this.lastStep) return;
      this.lastStep = step; // Gravity

      if (step % 1 === 0) {
        for (var x = 0; x < world.sx; x++) {
          for (var y = 0; y < world.sy; y++) {
            for (var z = 0; z < world.sz; z++) {
              if (blocks[x][y][z].gravity && z > 0 && blocks[x][y][z - 1] == _blocks["default"].AIR) {
                world.setBlock(x, y, z - 1, blocks[x][y][z]);
                world.setBlock(x, y, z, _blocks["default"].AIR);
              }
            }
          }
        }
      } // Fluids


      if (step % 10 === 0) {
        // Newly spawned fluid blocks are stored so that those aren't
        // updated in the same step, creating a simulation avalanche.
        var newFluidBlocks = {};

        for (var _x = 0; _x < world.sx; _x++) {
          for (var _y = 0; _y < world.sy; _y++) {
            for (var _z = 0; _z < world.sz; _z++) {
              var material = blocks[_x][_y][_z];

              if (material.fluid && newFluidBlocks["".concat(_x, ",").concat(_y, ",").concat(_z)] == null) {
                if (_x > 0 && blocks[_x - 1][_y][_z] == _blocks["default"].AIR) {
                  world.setBlock(_x - 1, _y, _z, material);
                  newFluidBlocks["".concat(_x - 1, ",").concat(_y, ",").concat(_z)] = true;
                }

                if (_x < world.sx - 1 && blocks[_x + 1][_y][_z] == _blocks["default"].AIR) {
                  world.setBlock(_x + 1, _y, _z, material);
                  newFluidBlocks["".concat(_x + 1, ",").concat(_y, ",").concat(_z)] = true;
                }

                if (_y > 0 && blocks[_x][_y - 1][_z] == _blocks["default"].AIR) {
                  world.setBlock(_x, _y - 1, _z, material);
                  newFluidBlocks["".concat(_x, ",").concat(_y - 1, ",").concat(_z)] = true;
                }

                if (_y < world.sy - 1 && blocks[_x][_y + 1][_z] == _blocks["default"].AIR) {
                  world.setBlock(_x, _y + 1, _z, material);
                  newFluidBlocks["".concat(_x, ",").concat(_y + 1, ",").concat(_z)] = true;
                }
              }
            }
          }
        }
      }
    }
  }]);

  return Physics;
}();

exports["default"] = Physics;