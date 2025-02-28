export class ShaderProgram {
  private gl: WebGLRenderingContext
  private program: WebGLProgram

  constructor(gl: WebGLRenderingContext) {
    this.gl = gl
    this.program = gl.createProgram()!
  }

  createShader(type: number, source: string): WebGLShader | null {
    const shader = this.gl.createShader(type)
    if (!shader) return null

    this.gl.shaderSource(shader, source)
    this.gl.compileShader(shader)

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error("Shader compile error:", this.gl.getShaderInfoLog(shader))
      this.gl.deleteShader(shader)
      return null
    }

    return shader
  }

  createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null {
    if (!this.program) return null

    this.gl.attachShader(this.program, vertexShader)
    this.gl.attachShader(this.program, fragmentShader)
    this.gl.linkProgram(this.program)

    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      console.error("Program link error:", this.gl.getProgramInfoLog(this.program))
      this.gl.deleteProgram(this.program)
      return null
    }

    return this.program
  }

  use() {
    this.gl.useProgram(this.program)
  }

  getProgram(): WebGLProgram {
    return this.program
  }

  deleteProgram() {
    if (this.program) {
      this.gl.deleteProgram(this.program)
    }
  }
}


