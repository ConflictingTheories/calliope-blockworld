"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _matrix = require("./utils/matrix4");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var GLEngine = /*#__PURE__*/function () {
  function GLEngine(canvas, width, height) {
    var _this = this;

    _classCallCheck(this, GLEngine);

    _defineProperty(this, "initShaderProgram", function (gl, _ref) {
      var vsSource = _ref.vs,
          fsSource = _ref.fs;

      var vertexShader = _this.loadShader(gl, gl.VERTEX_SHADER, vsSource);

      var fragmentShader = _this.loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

      var shaderProgram = gl.createProgram();
      gl.attachShader(shaderProgram, vertexShader);
      gl.attachShader(shaderProgram, fragmentShader);
      gl.linkProgram(shaderProgram); // Could Link

      if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        throw new Error("WebGL unable to initialize the shader program: ".concat(gl.getProgramInfoLog(shaderProgram)));
      } // Use Shader


      gl.useProgram(shaderProgram);
      _this.programInfo = {
        program: shaderProgram,
        attribLocations: {
          aPos: gl.getAttribLocation(shaderProgram, 'aPos'),
          aColor: gl.getAttribLocation(shaderProgram, 'aColor'),
          aTexCoord: gl.getAttribLocation(shaderProgram, 'aTexCoord')
        },
        uniformLocations: {
          uProjMat: gl.getUniformLocation(shaderProgram, 'uProjMatrix'),
          uModelMat: gl.getUniformLocation(shaderProgram, 'uModelMatrix'),
          uViewMat: gl.getUniformLocation(shaderProgram, 'uViewMatrix'),
          uSampler: gl.getUniformLocation(shaderProgram, 'uSampler')
        }
      };
      gl.enableVertexAttribArray(_this.programInfo.attribLocations.aPos);
      gl.enableVertexAttribArray(_this.programInfo.attribLocations.aColor);
      gl.enableVertexAttribArray(_this.programInfo.attribLocations.aTexCoord);
      return shaderProgram;
    });

    this.canvas = canvas;
    this.width = width;
    this.height = height;
  } // Initialize a Scene object


  _createClass(GLEngine, [{
    key: "init",
    value: function init(scene) {
      var gl = this.canvas.getContext('webgl');

      if (!gl) {
        throw new Error('WebGL : unable to initialize');
      }

      this.gl = gl;
      this.scene = scene; // Configure GL

      gl.clearColor(0, 0, 0, 1.0);
      gl.clearDepth(1.0);
      gl.enable(gl.DEPTH_TEST); // gl.enable(gl.CULL_FACE);

      gl.depthFunc(gl.LEQUAL);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); // Initialize Shader

      this.initShaderProgram(gl, scene.shaders); // Initialize Project Matrix

      this.initProjection(gl); // Dummy Model Matrix

      this.modelMatrix = (0, _matrix.create)();
      gl.uniformMatrix4fv(this.programInfo.uniformLocations.uModelMat, false, this.modelMatrix); // Initialize Scene

      scene.init(this); // Render

      this.render = this.render.bind(this);
      this.requestId = requestAnimationFrame(this.render);
    } // Load and Compile Shader Source

  }, {
    key: "loadShader",
    value: function loadShader(gl, type, source) {
      var shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        var log = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error("An error occurred compiling the shaders: ".concat(log));
      }

      return shader;
    }
  }, {
    key: "initProjection",
    value: // Set FOV and Perspective
    function initProjection(gl) {
      var fieldOfView = 60 * Math.PI / 180; // in radians

      var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
      var zNear = 0.1;
      var zFar = 200.0;
      this.uProjMat = (0, _matrix.perspective)(fieldOfView, aspect, zNear, zFar);
      gl.uniformMatrix4fv(this.programInfo.uniformLocations.uProjMat, false, this.uProjMat);
    } // Set Camera Pos & Angle

  }, {
    key: "setCamera",
    value: function setCamera(pos, ang) {
      var gl = this.gl;
      this.camPos = pos;
      this.uViewMat = (0, _matrix.create)();
      (0, _matrix.rotate)(this.uViewMat, this.uViewMat, -ang[0] - Math.PI / 2, [1, 0, 0]);
      (0, _matrix.rotate)(this.uViewMat, this.uViewMat, ang[1], [0, 0, 1]);
      (0, _matrix.rotate)(this.uViewMat, this.uViewMat, -ang[2], [0, 1, 0]);
      (0, _matrix.translate)(this.uViewMat, this.uViewMat, [-pos[0], -pos[1], -pos[2]]);
      gl.uniformMatrix4fv(this.programInfo.uniformLocations.uViewMat, false, this.uViewMat);
    } // Clear Screen with Color (RGBA)

  }, {
    key: "clearScreen",
    value: function clearScreen() {
      var gl = this.gl;
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    } // Render Frame

  }, {
    key: "render",
    value: function render(now) {
      this.scene.render(this, now);
      requestAnimationFrame(this.render);
    } // Build Buffers for Rendering Vertices / Indices

  }, {
    key: "buildBuffers",
    value: function buildBuffers(_ref2) {
      var positions = _ref2.positions,
          colors = _ref2.colors,
          indices = _ref2.indices,
          aTexCoordinates = _ref2.aTexCoordinates;
      var gl = this.gl; // Vertex Buffer

      var vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW); // Colour Buffer

      var colorBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW); // Texture Buffer

      var aTexCoordBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, aTexCoordBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(aTexCoordinates), gl.STATIC_DRAW); // Indices

      var indexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW); // Return

      this.buffers = {
        position: vertexBuffer,
        color: colorBuffer,
        texture: aTexCoordBuffer,
        index: indexBuffer
      };
    } // Draw Chunk Buffer

  }, {
    key: "drawBuffer",
    value: function drawBuffer(buffer) {
      var gl = this.gl;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.vertexAttribPointer(this.programInfo.attribLocations.aPos, 3, gl.FLOAT, false, 9 * 4, 0);
      gl.vertexAttribPointer(this.programInfo.attribLocations.aColor, 4, gl.FLOAT, false, 9 * 4, 5 * 4);
      gl.vertexAttribPointer(this.programInfo.attribLocations.aTexCoord, 2, gl.FLOAT, false, 9 * 4, 3 * 4);
      gl.drawArrays(gl.TRIANGLES, 0, buffer.vertices);
    }
  }, {
    key: "loadTexture",
    value: function loadTexture(url) {
      var gl = this.gl;
      var texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture); // Because images have to be downloaded over the internet
      // they might take a moment until they are ready.
      // Until then put a single pixel in the texture so we can
      // use it immediately. When the image has finished downloading
      // we'll update the texture with the contents of the image.

      var level = 0;
      var internalFormat = gl.RGBA;
      var width = 1;
      var height = 1;
      var border = 0;
      var srcFormat = gl.RGBA;
      var srcType = gl.UNSIGNED_BYTE;
      var pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue

      gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);
      var image = new Image();

      image.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image); // WebGL1 has different requirements for power of 2 images
        // vs non power of 2 images so check if the image is a
        // power of 2 in both dimensions.

        if ((0, _matrix.isPowerOf2)(image.width) && (0, _matrix.isPowerOf2)(image.height)) {
          // Yes, it's a power of 2. Generate mips.
          gl.generateMipmap(gl.TEXTURE_2D);
        } else {
          // No, it's not a power of 2. Turn off mips and set
          // wrapping to clamp to edge
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
      };

      image.src = url;
      return texture;
    } // Load Texture from File

  }, {
    key: "_loadTexture",
    value: function _loadTexture(src) {
      var gl = this.gl;
      var texture = gl.createTexture();
      texture.image = new Image();

      texture.image.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      };

      texture.image.src = src;
      return texture;
    } // Load Texture from File

  }, {
    key: "blankTexture",
    value: function blankTexture(color, unit) {
      var gl = this.gl;
      var texture = gl.createTexture(); // Create 1px white texture for pure vertex color operations (e.g. picking)

      gl.activeTexture(unit);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      var white = new Uint8Array(color);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, white);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.uniform1i(this.programInfo.uniformLocations.uSampler, unit);
      return texture;
    } // Clear Render Loop

  }, {
    key: "close",
    value: function close() {
      cancelAnimationFrame(this.requestId);
    }
  }]);

  return GLEngine;
}();

exports["default"] = GLEngine;