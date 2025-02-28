export class Geometry {
  private gl: WebGLRenderingContext
  private buffer: WebGLBuffer | null = null

  constructor(gl: WebGLRenderingContext) {
    this.gl = gl
  }

  createQuad(): void {
    const vertices = new Float32Array([-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0])

    this.buffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW)
  }

  bind(): void {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer)
  }

  cleanup(): void {
    if (this.buffer) {
      this.gl.deleteBuffer(this.buffer)
    }
  }
}

