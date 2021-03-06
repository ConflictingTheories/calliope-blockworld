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

const EPSILON = 0.000001;

const create = () => {
  let matrix = new Float32Array(16);
  matrix[0] = 1;
  matrix[5] = 1;
  matrix[10] = 1;
  matrix[15] = 1;
  return matrix;
};

const perspective = (fovy, aspect, near, far) => {
  let matrix = new Float32Array(16);
  let f = 1.0 / Math.tan(fovy / 2);
  matrix[0] = f / aspect;
  matrix[1] = 0;
  matrix[2] = 0;
  matrix[3] = 0;
  matrix[4] = 0;
  matrix[5] = f;
  matrix[6] = 0;
  matrix[7] = 0;
  matrix[8] = 0;
  matrix[9] = 0;
  matrix[10] = -1;
  matrix[11] = -1;
  matrix[12] = 0;
  matrix[13] = 0;
  matrix[14] = -2 * near;
  matrix[15] = 0;
  if (far != null && far !== Infinity && far !== near) {
    const nf = 1 / (near - far);
    matrix[10] = (far + near) * nf;
    matrix[14] = 2 * far * near * nf;
  }
  return matrix;
};

const translate = (m1, m2, v) => {
  let matrix = m1;
  let [x, y, z] = v;

  let [a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23] = m2;
  if (m1 !== m2) {
    matrix[0] = a00;
    matrix[1] = a01;
    matrix[2] = a02;
    matrix[3] = a03;
    matrix[4] = a10;
    matrix[5] = a11;
    matrix[6] = a12;
    matrix[7] = a13;
    matrix[8] = a20;
    matrix[9] = a21;
    matrix[10] = a22;
    matrix[11] = a23;
  }
  matrix[12] = a00 * x + a10 * y + a20 * z + m2[12];
  matrix[13] = a01 * x + a11 * y + a21 * z + m2[13];
  matrix[14] = a02 * x + a12 * y + a22 * z + m2[14];
  matrix[15] = a03 * x + a13 * y + a23 * z + m2[15];
  return matrix;
};

const rotate = (m1, m2, rad, axis) => {
  let matrix = m1;
  let [x, y, z] = axis;
  let len = Math.hypot(x, y, z);

  if (len < EPSILON) {
    throw new Error('Matrix4*4 rotate has wrong axis');
  }

  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;

  let s = Math.sin(rad);
  let c = Math.cos(rad);
  let t = 1 - c;

  let [a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23] = m2;

  let b00 = x * x * t + c;
  let b01 = y * x * t + z * s;
  let b02 = z * x * t - y * s;
  let b10 = x * y * t - z * s;
  let b11 = y * y * t + c;
  let b12 = z * y * t + x * s;
  let b20 = x * z * t + y * s;
  let b21 = y * z * t - x * s;
  let b22 = z * z * t + c;

  matrix[0] = a00 * b00 + a10 * b01 + a20 * b02;
  matrix[1] = a01 * b00 + a11 * b01 + a21 * b02;
  matrix[2] = a02 * b00 + a12 * b01 + a22 * b02;
  matrix[3] = a03 * b00 + a13 * b01 + a23 * b02;
  matrix[4] = a00 * b10 + a10 * b11 + a20 * b12;
  matrix[5] = a01 * b10 + a11 * b11 + a21 * b12;
  matrix[6] = a02 * b10 + a12 * b11 + a22 * b12;
  matrix[7] = a03 * b10 + a13 * b11 + a23 * b12;
  matrix[8] = a00 * b20 + a10 * b21 + a20 * b22;
  matrix[9] = a01 * b20 + a11 * b21 + a21 * b22;
  matrix[10] = a02 * b20 + a12 * b21 + a22 * b22;
  matrix[11] = a03 * b20 + a13 * b21 + a23 * b22;

  if (m2 !== m1) {
    matrix[12] = m2[12];
    matrix[13] = m2[13];
    matrix[14] = m2[14];
    matrix[15] = m2[15];
  }
  return matrix;
};

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}

export { create, perspective, translate, rotate, isPowerOf2 };
