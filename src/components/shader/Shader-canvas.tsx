"use client"

import { useEffect, useRef } from "react"
import { ShaderProgram } from "./webgl/Shader-program"
import { UniformManager } from "./webgl/Uniform-manager"
import { Geometry } from "./webgl/Geometry"
import type { ShaderParams } from "./types"

const defaultVertexShader = `
  attribute vec3 position;
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`

interface ShaderCanvasProps {
  fragmentShader: string
  onError?: (errorMessage: string) => void
  shaderParams?: ShaderParams
}

export function ShaderCanvas({
  fragmentShader,
  onError,
  shaderParams = {
    speed: 1.0,
    intensity: 0.5,
    colorR: 1.0,
    colorG: 0.5,
    colorB: 0.8,
  },
}: ShaderCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const startTimeRef = useRef<number>(Date.now())

  const programRef = useRef<ShaderProgram | null>(null)
  const uniformsRef = useRef<UniformManager | null>(null)
  const geometryRef = useRef<Geometry | null>(null)

  useEffect(() => {
    if (!canvasRef.current || !fragmentShader) return

    const canvas = canvasRef.current
    const gl = canvas.getContext("webgl")

    if (!gl) {
      console.error("WebGL not supported")
      onError?.("WebGL not supported in your browser")
      return
    }

    // Resize canvas
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

    try {
      const program = new ShaderProgram(gl)

      const vertexShader = program.createShader(
        gl.VERTEX_SHADER,
        defaultVertexShader
      )
      if (!vertexShader) throw new Error("Failed to create vertex shader.")

      const compiledFragmentShader = program.createShader(
        gl.FRAGMENT_SHADER,
        fragmentShader
      )
      if (!compiledFragmentShader)
        throw new Error("Failed to create fragment shader.")

      const glProgram = program.createProgram(
        vertexShader,
        compiledFragmentShader
      )
      if (!glProgram) throw new Error("Failed to create shader program.")

      programRef.current = program
      program.use()

      uniformsRef.current = new UniformManager(gl, glProgram)
      geometryRef.current = new Geometry(gl)
      geometryRef.current.createQuad()

      const positionLocation = gl.getAttribLocation(glProgram, "position")
      gl.enableVertexAttribArray(positionLocation)
      gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0)

      startTimeRef.current = Date.now()
      render()
    } catch (error: any) {
      console.error("Shader error:", error)
      onError?.(error.message || "Unknown shader error")
    }

    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener("resize", resizeCanvas)

      if (programRef.current) {
        programRef.current.deleteProgram() // Properly delete the WebGL program
      }

      geometryRef.current?.cleanup()
    }
  }, [fragmentShader, onError])

  const render = () => {
    const canvas = canvasRef.current
    if (!canvas || !uniformsRef.current) return

    const currentTime = (Date.now() - startTimeRef.current) / 1000

    // Update uniforms
    uniformsRef.current.setFloat("u_time", currentTime)
    uniformsRef.current.setVec2(
      "u_resolution",
      canvas.width,
      canvas.height
    )
    uniformsRef.current.setFloat("u_speed", shaderParams.speed)
    uniformsRef.current.setFloat("u_intensity", shaderParams.intensity)
    uniformsRef.current.setVec3(
      "u_color",
      shaderParams.colorR,
      shaderParams.colorG,
      shaderParams.colorB
    )

    // Draw
    const gl = canvas.getContext("webgl")
    if (gl) {
      gl.clearColor(0, 0, 0, 1)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
    }

    animationRef.current = requestAnimationFrame(render)
  }

  useEffect(() => {
    if (uniformsRef.current) {
      render()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full bg-black rounded-lg"
    />
  )
}
