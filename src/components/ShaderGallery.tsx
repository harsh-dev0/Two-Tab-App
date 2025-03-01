"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Share, Star, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ShaderCanvas } from "./shader/Shader-canvas"

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

export default function ShaderGallery() {
  const [shaders, setShaders] = useState<Shader[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Fetch shaders on component mount
  useEffect(() => {
    const fetchShaders = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/shaders", { cache: "no-store" })

        if (!response.ok) {
          throw new Error("Failed to fetch shaders")
        }

        const data = await response.json()

        const regular = data.filter((shader: Shader) => !shader.featured)

        setShaders(regular)
      } catch (err: any) {
        console.error("Error fetching shaders:", err)
        setError(err.message || "Failed to load shaders")
      } finally {
        setIsLoading(false)
      }
    }

    fetchShaders()
  }, [])

  // Share shader link
  const shareShader = (id: string) => {
    const shareableLink = `${window.location.origin}/shader/${id}`
    navigator.clipboard.writeText(shareableLink)

    toast({
      title: "Link copied",
      description: "Shareable link copied to clipboard",
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-4 sm:p-8 bg-red-900/20 rounded-lg border border-red-700">
        <h3 className="text-xl font-bold text-red-500 mb-2">
          Error Loading Shaders
        </h3>
        <p className="text-white">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-8 w-full mx-auto px-0">
      <Tabs defaultValue="all">
        <TabsContent value="all" className="w-full p-0">
          {shaders.length === 0 ? (
            <div className="text-center p-4 sm:p-8 bg-gray-800 rounded-lg">
              <p className="text-gray-400">
                No shaders available. Create one!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
              {shaders.map((shader) => (
                <ShaderCard
                  key={shader._id}
                  shader={shader}
                  onShare={shareShader}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Shader Card Component
function ShaderCard({
  shader,
  onShare,
}: {
  shader: Shader
  onShare: (id: string) => void
}) {
  return (
    <Card className="bg-gray-800 border-gray-700 overflow-hidden w-full">
      <CardHeader className="p-3 pb-0 sm:p-4 sm:pb-0">
        <CardTitle className="text-base sm:text-lg flex items-center justify-between">
          <span className="truncate">{shader.title}</span>
          {shader.featured && (
            <Star className="h-4 w-4 text-yellow-400 ml-2 flex-shrink-0" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4">
        <div className="aspect-video bg-black rounded-lg w-full h-[120px] xs:h-[140px] sm:h-[160px] md:h-[180px] mb-2">
          <ShaderCanvas
            fragmentShader={shader.code}
            shaderParams={shader.params}
          />
        </div>
        <p className="text-xs sm:text-sm text-gray-400 line-clamp-2">
          {shader.description}
        </p>
      </CardContent>
      <CardFooter className="p-3 pt-0 sm:p-4 sm:pt-0 flex justify-between">
        <Button
          variant="outline"
          size="sm"
          className="text-xs sm:text-sm px-2 sm:px-3 py-1"
          onClick={() => window.open(`/shader/${shader._id}`, "_blank")}
        >
          View
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 bg-slate-300 text-xs sm:text-sm px-2 sm:px-3 py-1"
          onClick={() => onShare(shader._id)}
        >
          <Share className="h-3 w-3 sm:h-4 sm:w-4" />
          Share
        </Button>
      </CardFooter>
    </Card>
  )
}
