"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _matrix = require("../engine/utils/matrix4");

var _elements = require("../engine/utils/elements");

var _vector = require("../engine/utils/vector");

var _fs = _interopRequireDefault(require("../shaders/fs"));

var _vs = _interopRequireDefault(require("../shaders/vs"));

var _world = _interopRequireDefault(require("../engine/world"));

var _physics = _interopRequireDefault(require("../engine/physics"));

var _player = _interopRequireDefault(require("../engine/player"));

var _blocks = _interopRequireDefault(require("../engine/blocks"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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
// Shaders
// Blockworld 
// Instance
var impl = {}; // Scene Object

var scene = {
  // Shaders
  shaders: {
    fs: (0, _fs["default"])(),
    vs: (0, _vs["default"])()
  },
  // Model Vertices / Indices / Etc... (OLD Method..... - For Static Model/Scenes)
  model: (0, _elements.modelMerge)(new Array(5).fill(0).map(function (_, i) {
    return (0, _elements.cube)(new _vector.Vector(i * 2, i * 2, i * 3));
  }))
}; // Init Scene

scene.init = function (engine) {
  // game Engine & Timing
  impl.engine = engine;
  impl.squareRotation = 0;
  impl.from = null; // Init Game Engine Components

  var world = impl.world = new _world["default"](16, 16, 16);
  world.createFlatWorld(6); // Physics

  impl.physics = new _physics["default"](world); // Player & Controls

  impl.player = new _player["default"](world, scene); // Create Flat World in Scene

  scene.loadTextures(engine);
  scene.setWorld(world, 8);
}; // Build Chunks from World


scene.buildChunks = function (count) {
  var gl = impl.engine.gl;
  var chunks = impl.chunks,
      world = impl.world;

  for (var i = 0; i < chunks.length; i++) {
    var chunk = chunks[i];

    if (chunk.dirty) {
      var vertices = []; // Create map of lowest blocks that are still lit

      var lightmap = {};

      for (var x = chunk.start[0] - 1; x < chunk.end[0] + 1; x++) {
        lightmap[x] = {};

        for (var y = chunk.start[1] - 1; y < chunk.end[1] + 1; y++) {
          for (var z = world.sz - 1; z >= 0; z--) {
            lightmap[x][y] = z;
            if (!world.getBlock(x, y, z).transparent) break;
          }
        }
      } // Add vertices for blocks


      for (var _x = chunk.start[0]; _x < chunk.end[0]; _x++) {
        for (var _y = chunk.start[1]; _y < chunk.end[1]; _y++) {
          for (var _z = chunk.start[2]; _z < chunk.end[2]; _z++) {
            if (world.blocks[_x][_y][_z] == _blocks["default"].AIR) continue;

            _blocks["default"].pushVertices(vertices, world, lightmap, _x, _y, _z);
          }
        }
      } // Create WebGL buffer


      if (chunk.buffer) gl.deleteBuffer(chunk.buffer);
      var buffer = chunk.buffer = gl.createBuffer();
      buffer.vertices = vertices.length / 9;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
      chunk.dirty = false;
      count--;
    }

    if (count == 0) break;
  }
}; // Update World on Blockchange


scene.onBlockChanged = function (x, y, z) {
  var chunks = impl.chunks;

  for (var i = 0; i < chunks.length; i++) {
    // Neighbouring chunks are updated as well if the block is on a chunk border
    // Also, all chunks below the block are updated because of lighting
    if (x >= chunks[i].start[0] && x < chunks[i].end[0] && y >= chunks[i].start[1] && y < chunks[i].end[1] && z >= chunks[i].start[2] && z < chunks[i].end[2]) chunks[i].dirty = true;else if (x >= chunks[i].start[0] && x < chunks[i].end[0] && y >= chunks[i].start[1] && y < chunks[i].end[1] && (z >= chunks[i].end[2] || z == chunks[i].start[2] - 1)) chunks[i].dirty = true;else if (x >= chunks[i].start[0] && x < chunks[i].end[0] && z >= chunks[i].start[2] && z < chunks[i].end[2] && (y == chunks[i].end[1] || y == chunks[i].start[1] - 1)) chunks[i].dirty = true;else if (y >= chunks[i].start[1] && y < chunks[i].end[1] && z >= chunks[i].start[2] && z < chunks[i].end[2] && (x == chunks[i].end[0] || x == chunks[i].start[0] - 1)) chunks[i].dirty = true;
  }
}; // Attach World and Build Chunks


scene.setWorld = function (world, chunkSize) {
  impl.world = world;
  world.setScene(scene);
  impl.chunkSize = chunkSize; // Create chunk list

  var chunks = impl.chunks = [];

  for (var x = 0; x < world.sx; x += chunkSize) {
    for (var y = 0; y < world.sy; y += chunkSize) {
      for (var z = 0; z < world.sz; z += chunkSize) {
        chunks.push({
          start: [x, y, z],
          end: [Math.min(world.sx, x + chunkSize), Math.min(world.sy, y + chunkSize), Math.min(world.sz, z + chunkSize)],
          dirty: true
        });
      }
    }
  }
}; // Load Scene Textures


scene.loadTextures = function (engine) {
  var gl = engine.gl; // Create 1px white texture for pure vertex color operations (e.g. picking)

  var white = new Uint8Array([255, 255, 255, 255]);
  impl.texWhite = engine.blankTexture(white, gl.TEXTURE0); // Load Image Textures

  impl.texTerrain = engine.loadTexture("media/terrain.png");
  impl.texPlayer = engine.loadTexture("media/player.png");
}; // Render Loop


scene.render = function (engine, now) {
  // Simulate Physics for Game
  impl.physics.simulate(); // Update Player Position

  impl.player.update(); // Build

  scene.buildChunks(1);
  engine.setCamera(impl.player.getEyePos().toArray(), impl.player.angles); // Draw Frame

  scene.draw(engine); // Update for next frame

  var deltaTime = impl.from === null ? 0 : now - impl.from;
  impl.from = now;
  impl.squareRotation += deltaTime * 0.001;
}; // Pick Block in Scene


scene.pickAt = function (min, max, mx, my) {
  var engine = impl.engine,
      world = impl.world;
  var gl = engine.gl; // Create framebuffer for picking render

  var fbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  var bt = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, bt);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 512, 512, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  var renderbuffer = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, 512, 512);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, bt, 0);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer); // Build buffer with block pick candidates

  var vertices = [];

  for (var x = min.x; x <= max.x; x++) {
    for (var y = min.y; y <= max.y; y++) {
      for (var z = min.z; z <= max.z; z++) {
        if (world.getBlock(x, y, z) != _blocks["default"].AIR) _blocks["default"].pushPickingVertices(vertices, x, y, z);
      }
    }
  }

  var buffer = gl.createBuffer();
  buffer.vertices = vertices.length / 9;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STREAM_DRAW); // Draw buffer

  gl.bindTexture(gl.TEXTURE_2D, impl.texWhite);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  engine.drawBuffer(buffer); // Read pixel

  var pixel = new Uint8Array(4);
  gl.readPixels(mx / gl.viewportWidth * gl.viewportWidth, (1 - my / gl.viewportHeight) * gl.viewportWidth, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel); // Reset states

  gl.bindTexture(gl.TEXTURE_2D, impl.texTerrain);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null); // Clean up

  gl.deleteBuffer(buffer);
  gl.deleteRenderbuffer(renderbuffer);
  gl.deleteTexture(bt);
  gl.deleteFramebuffer(fbo); // Build result

  if (pixel[0] != 255) {
    var normal;
    if (pixel[3] == 1) normal = new _vector.Vector(0, 0, 1);else if (pixel[3] == 2) normal = new _vector.Vector(0, 0, -1);else if (pixel[3] == 3) normal = new _vector.Vector(0, -1, 0);else if (pixel[3] == 4) normal = new _vector.Vector(0, 1, 0);else if (pixel[3] == 5) normal = new _vector.Vector(-1, 0, 0);else if (pixel[3] == 6) normal = new _vector.Vector(1, 0, 0);
    return {
      x: pixel[0],
      y: pixel[1],
      z: pixel[2],
      n: normal
    };
  } else {
    return false;
  }
}; // Draw Scene


scene.draw = function (engine) {
  var gl = engine.gl,
      programInfo = engine.programInfo;
  engine.clearScreen(); // Draw Terrain chunks (NOT WORKING for Texture)

  var chunks = impl.chunks;
  gl.bindTexture(gl.TEXTURE_2D, impl.texTerrain);

  if (chunks != null) {
    for (var i = 0; i < chunks.length; i++) {
      if (chunks[i].buffer != null) engine.drawBuffer(chunks[i].buffer);
    }
  } // Update Model


  var uModelMat = (0, _matrix.create)();
  gl.uniformMatrix4fv(programInfo.attribLocations.uModelMat, false, uModelMat);
}; // Keyboard handler for Scene


scene.onKeyEvent = function (key, down) {
  console.log("-----", key);
  impl.player.onKeyEvent(key, down);
}; // Mouse Handler for Scene


scene.onMouseEvent = function (x, y, type, rmb, e) {
  console.log();
  impl.player.onMouseEvent(x, y, type, rmb);
};

var _default = scene;
exports["default"] = _default;