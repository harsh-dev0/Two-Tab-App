export class UniformManager {
  private gl: WebGLRenderingContext
  private program: WebGLProgram
  private uniformLocations: Map<string, WebGLUniformLocation | null>

  constructor(gl: WebGLRenderingContext, program: WebGLProgram) {
    this.gl = gl
    this.program = program
    this.uniformLocations = new Map()
  }

  getLocation(name: string): WebGLUniformLocation | null {
    if (!this.uniformLocations.has(name)) {
      const location = this.gl.getUniformLocation(this.program, name)
      this.uniformLocations.set(name, location)
    }
    return this.uniformLocations.get(name) || null
  }

  setFloat(name: string, value: number): void {
    const location = this.getLocation(name)
    if (location) {
      this.gl.uniform1f(location, value)
    }
  }

  setVec2(name: string, x: number, y: number): void {
    const location = this.getLocation(name)
    if (location) {
      this.gl.uniform2f(location, x, y)
    }
  }

  setVec3(name: string, x: number, y: number, z: number): void {
    const location = this.getLocation(name)
    if (location) {
      this.gl.uniform3f(location, x, y, z)
    }
  }
}

