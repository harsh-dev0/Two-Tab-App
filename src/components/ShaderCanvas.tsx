"use client"

import type React from "react"
import { useEffect, useRef } from "react"

interface ShaderParams {
  speed: number
  intensity: number
  colorR: number
  colorG: number
  colorB: number
}

interface ShaderCanvasProps {
  fragmentShader: string
  onError?: (errorMessage: string) => void
  shaderParams?: ShaderParams
}

const defaultVertexShader = `
  attribute vec3 position;
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`

const ShaderCanvas: React.FC<ShaderCanvasProps> = ({
  fragmentShader,
  onError,
  shaderParams = {
    speed: 1.0,
    intensity: 0.5,
    colorR: 1.0,
    colorG: 0.5,
    colorB: 0.8,
  },
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const programRef = useRef<WebGLProgram | null>(null)
  const glRef = useRef<WebGLRenderingContext | null>(null)
  const startTimeRef = useRef<number>(Date.now())

  // Setup WebGL context and program
  useEffect(() => {
    if (!canvasRef.current || !fragmentShader) return

    const canvas = canvasRef.current
    const gl = canvas.getContext("webgl")

    if (!gl) {
      console.error("WebGL not supported")
      if (onError) onError("WebGL not supported in your browser")
      return
    }

    glRef.current = gl

    // Resize canvas to match container
    const resizeCanvas = () => {
      const container = canvas.parentElement
      if (container) {
        canvas.width = container.clientWidth
        canvas.height = container.clientHeight
        gl.viewport(0, 0, canvas.width, canvas.height)
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Compile shaders
    const vertShader = gl.createShader(gl.VERTEX_SHADER)
    const fragShader = gl.createShader(gl.FRAGMENT_SHADER)

    if (!vertShader || !fragShader) {
      console.error("Unable to create shader objects")
      if (onError) onError("Unable to create shader objects")
      return
    }

    // Set shader source and compile
    gl.shaderSource(vertShader, defaultVertexShader)
    gl.compileShader(vertShader)

    // Check for vertex shader compilation errors
    if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
      const errorMessage =
        gl.getShaderInfoLog(vertShader) || "Unknown vertex shader error"
      console.error("Vertex shader compilation error:", errorMessage)
      if (onError) onError(errorMessage)
      return
    }

    try {
      gl.shaderSource(fragShader, fragmentShader)
      gl.compileShader(fragShader)

      // Check for fragment shader compilation errors
      if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
        const errorMessage =
          gl.getShaderInfoLog(fragShader) ||
          "Unknown fragment shader error"
        throw new Error(errorMessage)
      }

      // Create and link program
      const program = gl.createProgram()
      if (!program) {
        throw new Error("Unable to create program")
      }

      gl.attachShader(program, vertShader)
      gl.attachShader(program, fragShader)
      gl.linkProgram(program)

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const errorMessage =
          gl.getProgramInfoLog(program) || "Unknown program linking error"
        throw new Error(errorMessage)
      }

      programRef.current = program

      // Set up geometry
      const vertices = new Float32Array([
        -1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0,
      ])

      const vertexBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

      // Get attribute location
      const positionLocation = gl.getAttribLocation(program, "position")
      gl.enableVertexAttribArray(positionLocation)
      gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0)

      // Use program
      gl.useProgram(program)

      // Reset start time for animations
      startTimeRef.current = Date.now()

      // Start animation loop
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      render()
    } catch (error: any) {
      console.error("Shader error:", error)
      if (onError) onError(error.message || "Unknown shader error")
    }

    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener("resize", resizeCanvas)
      // Clean up WebGL resources
      gl.deleteShader(vertShader)
      gl.deleteShader(fragShader)
    }
  }, [fragmentShader, onError])

  // Animation loop function
  const render = () => {
    const gl = glRef.current
    const program = programRef.current

    if (!gl || !program) return

    const currentTime = (Date.now() - startTimeRef.current) / 1000

    // Update uniforms
    const timeLocation = gl.getUniformLocation(program, "u_time")
    const resolutionLocation = gl.getUniformLocation(
      program,
      "u_resolution"
    )
    const speedLocation = gl.getUniformLocation(program, "u_speed")
    const intensityLocation = gl.getUniformLocation(program, "u_intensity")
    const colorLocation = gl.getUniformLocation(program, "u_color")

    if (timeLocation) {
      gl.uniform1f(timeLocation, currentTime)
    }

    if (resolutionLocation && canvasRef.current) {
      gl.uniform2f(
        resolutionLocation,
        canvasRef.current.width,
        canvasRef.current.height
      )
    }

    // Set custom shader parameters
    if (speedLocation) {
      gl.uniform1f(speedLocation, shaderParams.speed)
    }

    if (intensityLocation) {
      gl.uniform1f(intensityLocation, shaderParams.intensity)
    }

    if (colorLocation) {
      gl.uniform3f(
        colorLocation,
        shaderParams.colorR,
        shaderParams.colorG,
        shaderParams.colorB
      )
    }

    // Draw
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLES, 0, 6)

    animationRef.current = requestAnimationFrame(render)
  }

  // Update render loop when shader parameters change
  useEffect(() => {
    if (glRef.current && programRef.current) {
      render()
    }
  }, [shaderParams])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full bg-black rounded-lg"
    />
  )
}

export default ShaderCanvas
