"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ShaderCanvas } from "./Shader-canvas"
import type { ShaderParams } from "./types"

interface ShaderPreviewProps {
  shaderCode: string | null
  shaderParams: ShaderParams
  isCompileError: boolean
  onError: (error: string) => void
}

export function ShaderPreview({
  shaderCode,
  shaderParams,
  isCompileError,
  onError,
}: ShaderPreviewProps) {
  if (!shaderCode) return null

  return (
    <Card className="bg-gray-800 shadow-xl border-gray-700">
      <CardContent className="p-2 sm:p-4 md:p-6">
        <div className="aspect-video bg-black rounded-lg w-full h-[200px] sm:h-[250px] md:h-[300px]">
          {!isCompileError && (
            <ShaderCanvas
              fragmentShader={shaderCode}
              onError={onError}
              shaderParams={shaderParams}
            />
          )}
          {isCompileError && (
            <div className="w-full h-full flex items-center justify-center bg-red-900/20 text-red-400 p-2 sm:p-4 rounded-lg overflow-auto text-xs sm:text-sm md:text-base">
              <p>Shader compilation failed. See error below.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
