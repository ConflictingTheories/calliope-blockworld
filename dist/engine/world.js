"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vector = require("./utils/vector");

var _blocks = _interopRequireDefault(require("./blocks"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var World = /*#__PURE__*/function () {
  function World(sx, sy, sz) {
    _classCallCheck(this, World);

    this.blocks = new Array(sx);

    for (var x = 0; x < sx; x++) {
      this.blocks[x] = new Array(sy);

      for (var y = 0; y < sy; y++) {
        this.blocks[x][y] = new Array(sz);
      }
    }

    this.sx = sx;
    this.sy = sy;
    this.sz = sz;
    this.players = {};
  } // Flat World at given height


  _createClass(World, [{
    key: "createFlatWorld",
    value: function createFlatWorld(height) {
      this.spawnPoint = new _vector.Vector(this.sx / 2 + 0.5, this.sy / 2 + 0.5, height);

      for (var x = 0; x < this.sx; x++) {
        for (var y = 0; y < this.sy; y++) {
          for (var z = 0; z < this.sz; z++) {
            this.blocks[x][y][z] = z < height ? _blocks["default"].DIRT : _blocks["default"].AIR;
          }
        }
      }
    } // Creates a world from a string representation.

  }, {
    key: "createFromString",
    value: function createFromString(str) {
      var spawn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      this.spawnPoint = spawn ? spawn : new _vector.Vector(this.sx / 2 + 0.5, this.sy / 2 + 0.5, this.sz);
      var i = 0;

      for (var x = 0; x < this.sx; x++) {
        for (var y = 0; y < this.sy; y++) {
          for (var z = 0; z < this.sz; z++) {
            this.blocks[x][y][z] = _blocks["default"].fromId(str.charCodeAt(i) - 97);
            i += 1;
          }
        }
      }
    } // Gett block at location

  }, {
    key: "getBlock",
    value: function getBlock(x, y, z) {
      if (x < 0 || y < 0 || z < 0 || x > this.sx - 1 || y > this.sy - 1 || z > this.sz - 1) return _blocks["default"].AIR;
      return this.blocks[x][y][z];
    } // Set Block at location

  }, {
    key: "setBlock",
    value: function setBlock(x, y, z, type) {
      this.blocks[x][y][z] = type;
      if (this.scene != null) this.scene.onBlockChanged(x, y, z);
    } // Return a string representation of the world

  }, {
    key: "toNetworkString",
    value: function toNetworkString() {
      var blockArray = [];

      for (var x = 0; x < this.sx; x++) {
        for (var y = 0; y < this.sy; y++) {
          for (var z = 0; z < this.sz; z++) {
            blockArray.push(String.fromCharCode(97 + this.blocks[x][y][z].id));
          }
        }
      }

      return blockArray.join("");
    } // Set Scene Handler

  }, {
    key: "setScene",
    value: function setScene(scene) {
      this.scene = scene;
    }
  }]);

  return World;
}();

exports["default"] = World;