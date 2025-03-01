"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowLeft, Share } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ShaderCanvas } from "@/components/shader/Shader-canvas"
import Link from "next/link"

interface ShaderParams {
  speed: number
  intensity: number
  colorR: number
  colorG: number
  colorB: number
}

interface Shader {
  _id: string
  title: string
  description: string
  code: string
  params: ShaderParams
  createdAt: string
  featured?: boolean
}

export default function ShaderPage() {
  const params = useParams()
  const id = params.id as string
  const [shader, setShader] = useState<Shader | null>(null)
  const [shaderParams, setShaderParams] = useState<ShaderParams | null>(
    null
  )
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Fetch shader data
  useEffect(() => {
    const fetchShader = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/shaders/${id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch shader")
        }

        const data = await response.json()
        setShader(data)
        setShaderParams(data.params)
      } catch (err: any) {
        console.error("Error fetching shader:", err)
        setError(err.message || "Failed to load shader")
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchShader()
    }
  }, [id])

  // Share shader link
  const shareShader = () => {
    const shareableLink = window.location.href
    navigator.clipboard.writeText(shareableLink)

    toast({
      title: "Link copied",
      description: "Shareable link copied to clipboard",
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (error || !shader) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4 text-center">
        <h3 className="text-xl font-bold text-red-500 mb-2">
          Error Loading Shader
        </h3>
        <p className="text-white mb-4">{error || "Shader not found"}</p>
        <Link href="/">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-900 ">
      {/* Header */}
      <header className="w-full bg-gray-800 px-6 py-4 border-b border-gray-700 text-center">
        <h1 className="text-3xl font-bold text-white">Shader Generator</h1>
        <p className="text-gray-300 mt-1">
          Generate shaders with AI-powered GLSL
        </p>
      </header>

      {/* Content */}
      <main className="flex-1 container mx-auto p-4 sm:p-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => window.close()}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>

          <Button
            variant="outline"
            onClick={shareShader}
            className="flex items-center gap-2"
          >
            <Share className="h-4 w-4" />
            Share
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-gray-800 shadow-xl border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-lg sm:text-xl">
                  {shader.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-black rounded-lg w-full h-[250px] sm:h-[350px] md:h-[400px]">
                  {shaderParams && (
                    <ShaderCanvas
                      fragmentShader={shader.code}
                      shaderParams={shaderParams}
                    />
                  )}
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2 text-white">
                    Description
                  </h3>
                  <p className="text-gray-300 text-sm sm:text-base">
                    {shader.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="bg-gray-800 shadow-xl border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Shader Code</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-700 rounded-lg p-4 overflow-auto text-xs text-white h-[300px] max-w-full">
                  <code>{shader.code}</code>
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
