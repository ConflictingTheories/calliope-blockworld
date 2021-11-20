"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aTexCoordinates = aTexCoordinates;
exports.colorRGB = colorRGB;
exports.colorRGBA = colorRGBA;
exports.cube = cube;
exports.modelMerge = modelMerge;
exports.paramMerge = paramMerge;
exports.square = square;
exports.texCube = texCube;
exports.texSquare = texSquare;

var _vector = require("./vector");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

// Color w/ Opacity
function colorRGBA(r, g, b, a) {
  return new _vector.Vector4(r, g, b, a);
} // Color


function colorRGB(r, g, b) {
  return new _vector.Vector(r, g, b);
} // Map to Points from Coordinates


function aTexCoordinates(a, b, c, d) {
  return [].concat(_toConsumableArray(a.toArray()), _toConsumableArray(b.toArray()), _toConsumableArray(c.toArray()), _toConsumableArray(d.toArray()));
} // Square


function square(a, b, c, d, color) {
  var positions = [].concat(_toConsumableArray(a.toArray()), _toConsumableArray(b.toArray()), _toConsumableArray(c.toArray()), _toConsumableArray(d.toArray()));
  var indices = [0, 1, 2, 0, 2, 3];
  var colors = [];
  colors = colors.concat(color.toArray(), color.toArray(), color.toArray(), color.toArray());
  return {
    positions: positions,
    colors: colors,
    indices: indices
  };
} // Textured Square ([x,y],[x,y],[x,y])


function texSquare(a, b, c, d, texPos) {
  var positions = [].concat(_toConsumableArray(a.toArray()), _toConsumableArray(b.toArray()), _toConsumableArray(c.toArray()), _toConsumableArray(d.toArray()));
  var indices = [0, 1, 2, 0, 2, 3];
  return {
    positions: positions,
    aTexCoordinates: texPos.toArray(),
    indices: indices
  };
} // Param Merge


function paramMerge(models, key) {
  var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var n = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  var offsetCnt = 0;

  if (n) {
    offsetCnt = n;
  }

  return models.map(function (x) {
    return x[key];
  }).reduce(function (res, j, i) {
    return [].concat(_toConsumableArray(res), _toConsumableArray(j.map(function (y) {
      return offset ? y + offsetCnt * i : y;
    })));
  });
} // Merge Model Param


function modelMerge(models) {
  var model = {
    positions: paramMerge(models, 'positions'),
    colors: paramMerge(models, 'colors'),
    indices: paramMerge(models, 'indices', true, 24)
  };
  return model;
} // Cube at pos (x,y,z)


function cube(pos) {
  var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var x = pos.x,
      y = pos.y,
      z = pos.z;
  var front = square(new _vector.Vector(x - 1, y - 1, z + 1), new _vector.Vector(x + 1, y - 1, z + 1), new _vector.Vector(x + 1, y + 1, z + 1), new _vector.Vector(x - 1, y + 1, z + 1), color || colorRGBA(0.1, 1.0, 1.0, 1.0));
  var back = square(new _vector.Vector(x - 1, y - 1, z - 1), new _vector.Vector(x - 1, y + 1, z - 1), new _vector.Vector(x + 1, y + 1, z - 1), new _vector.Vector(x + 1, y - 1, z - 1), color || colorRGBA(1.0, 0.1, 1.0, 1.0));
  var top = square(new _vector.Vector(x - 1, y + 1, z - 1), new _vector.Vector(x - 1, y + 1, z + 1), new _vector.Vector(x + 1, y + 1, z + 1), new _vector.Vector(x + 1, y + 1, z - 1), color || colorRGBA(1.0, 1.0, 1.0, 1.0));
  var bottom = square(new _vector.Vector(x - 1, y - 1, z - 1), new _vector.Vector(x + 1, y - 1, z - 1), new _vector.Vector(x + 1, y - 1, z + 1), new _vector.Vector(x - 1, y - 1, z + 1), color || colorRGBA(0.5, 1.0, 0.1, 1.0));
  var right = square(new _vector.Vector(x + 1, y - 1, z - 1), new _vector.Vector(x + 1, y + 1, z - 1), new _vector.Vector(x + 1, y + 1, z + 1), new _vector.Vector(x + 1, y - 1, z + 1), color || colorRGBA(1.0, 0.5, 0.1, 1.0));
  var left = square(new _vector.Vector(x - 1, y - 1, z - 1), new _vector.Vector(x - 1, y - 1, z + 1), new _vector.Vector(x - 1, y + 1, z + 1), new _vector.Vector(x - 1, y + 1, z - 1), color || colorRGBA(0.5, 1.0, 1.0, 1.0));
  var sides = [front, back, top, bottom, right, left];
  return {
    positions: paramMerge(sides, 'positions'),
    colors: paramMerge(sides, 'colors'),
    indices: paramMerge(sides, 'indices', true, 4)
  };
} // Textured Cube at pos (x,y,z) with textureCoorArray([x,y,x,y,x,y,x,y],...)


function texCube(pos, texPos) {
  var x = pos.x,
      y = pos.y,
      z = pos.z;
  var front = texSquare(new _vector.Vector(x - 1, y - 1, z + 1), new _vector.Vector(x + 1, y - 1, z + 1), new _vector.Vector(x + 1, y + 1, z + 1), new _vector.Vector(x - 1, y + 1, z + 1), aTexCoordinates.apply(void 0, _toConsumableArray(texPos[0])));
  var back = texSquare(new _vector.Vector(x - 1, y - 1, z - 1), new _vector.Vector(x - 1, y + 1, z - 1), new _vector.Vector(x + 1, y + 1, z - 1), new _vector.Vector(x + 1, y - 1, z - 1), aTexCoordinates.apply(void 0, _toConsumableArray(texPos[1])));
  var top = texSquare(new _vector.Vector(x - 1, y + 1, z - 1), new _vector.Vector(x - 1, y + 1, z + 1), new _vector.Vector(x + 1, y + 1, z + 1), new _vector.Vector(x + 1, y + 1, z - 1), aTexCoordinates.apply(void 0, _toConsumableArray(texPos[2])));
  var bottom = texSquare(new _vector.Vector(x - 1, y - 1, z - 1), new _vector.Vector(x + 1, y - 1, z - 1), new _vector.Vector(x + 1, y - 1, z + 1), new _vector.Vector(x + 1, y - 1, z + 1), aTexCoordinates.apply(void 0, _toConsumableArray(texPos[3])));
  var right = texSquare(new _vector.Vector(x + 1, y - 1, z - 1), new _vector.Vector(x + 1, y + 1, z - 1), new _vector.Vector(x + 1, y + 1, z + 1), new _vector.Vector(x + 1, y - 1, z + 1), aTexCoordinates.apply(void 0, _toConsumableArray(texPos[4])));
  var left = texSquare(new _vector.Vector(x - 1, y - 1, z - 1), new _vector.Vector(x - 1, y - 1, z + 1), new _vector.Vector(x - 1, y + 1, z + 1), new _vector.Vector(x - 1, y + 1, z - 1), aTexCoordinates.apply(void 0, _toConsumableArray(texPos[5])));
  return {
    positions: [].concat(_toConsumableArray(front.positions), _toConsumableArray(back.positions), _toConsumableArray(top.positions), _toConsumableArray(bottom.positions), _toConsumableArray(right.positions), _toConsumableArray(left.positions)),
    aTexCoordinates: [].concat(_toConsumableArray(front.colors), _toConsumableArray(back.colors), _toConsumableArray(top.colors), _toConsumableArray(bottom.colors), _toConsumableArray(right.colors), _toConsumableArray(left.colors)),
    indices: [].concat(_toConsumableArray(front.indices), _toConsumableArray(back.indices.map(function (i) {
      return i + 4;
    })), _toConsumableArray(top.indices.map(function (i) {
      return i + 8;
    })), _toConsumableArray(bottom.indices.map(function (i) {
      return i + 12;
    })), _toConsumableArray(right.indices.map(function (i) {
      return i + 16;
    })), _toConsumableArray(left.indices.map(function (i) {
      return i + 20;
    })))
  };
}