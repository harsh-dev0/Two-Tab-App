"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ShaderPromptInput } from "./Shader-prompt-input"
import { ShaderPreview } from "./Shader-preview"
import { ShaderCodeEditor } from "./Shader-code-editor"
import ShaderGallery from "../ShaderGallery"
import type { ShaderParams, Shader } from "./types"

export default function ShaderGenerator() {
  const [prompt, setPrompt] = useState("")
  const [shaderCode, setShaderCode] = useState<string | null>(null)
  const [editedShaderCode, setEditedShaderCode] = useState<string | null>(
    null
  )
  const [displayedShaderCode, setDisplayedShaderCode] = useState<
    string | null
  >(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isCompileError, setIsCompileError] = useState(false)
  const [showEmptyPromptAlert, setShowEmptyPromptAlert] = useState(false)
  const [shaderTitle, setShaderTitle] = useState("")
  const [activeTab, setActiveTab] = useState("create")
  const { toast } = useToast()

  const [shaderParams, setShaderParams] = useState<ShaderParams>({
    speed: 1.0,
    intensity: 0.5,
    colorR: 1.0,
    colorG: 0.5,
    colorB: 0.8,
  })

  useEffect(() => {
    if (shaderCode) {
      setEditedShaderCode(shaderCode)
      setDisplayedShaderCode(shaderCode)
    }
  }, [shaderCode])

  const generateShader = async (prompt: string) => {
    try {
      const response = await fetch(
        "https://shader-generatorbackend.onrender.com/api/generate-shader",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        }
      )

      if (!response.ok) {
        throw new Error("Failed to generate shader")
      }

      const data = await response.json()
      return data.shader_code
    } catch (error) {
      throw error
    }
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setShowEmptyPromptAlert(true)
      setTimeout(() => setShowEmptyPromptAlert(false), 3000)
      return
    }

    setIsLoading(true)
    setError(null)
    setIsCompileError(false)

    try {
      const generatedCode = await generateShader(prompt)
      setShaderCode(generatedCode)
      setShaderTitle(prompt.split(" ").slice(0, 3).join(" ") + "...")
    } catch (err: any) {
      setError(err.message || "Failed to generate shader")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompileError = (errorMessage: string) => {
    setIsCompileError(true)
    setError(`Compilation error: ${errorMessage}`)
  }

  const handleApplyChanges = () => {
    if (editedShaderCode) {
      setDisplayedShaderCode(editedShaderCode)
      setIsCompileError(false)
      setError(null)
    }
  }

  const handleSave = async () => {
    if (!displayedShaderCode || !shaderTitle) {
      toast({
        title: "Error",
        description: "Shader title and code are required",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const shaderData: Omit<Shader, "_id"> = {
        title: shaderTitle,
        description: prompt,
        code: displayedShaderCode,
        params: shaderParams,
        createdAt: new Date(),
      }

      const response = await fetch("/api/shaders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shaderData),
      })

      if (!response.ok) {
        throw new Error("Failed to save shader")
      }

      const data = await response.json()

      toast({
        title: "Success",
        description: "Shader saved successfully!",
      })

      const shareableLink = `${window.location.origin}/shader/${data._id}`
      navigator.clipboard.writeText(shareableLink)

      toast({
        title: "Link copied",
        description: "Shareable link copied to clipboard",
      })
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to save shader",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleRandomizeParams = () => {
    setShaderParams({
      speed: Math.random() * 2,
      intensity: Math.random(),
      colorR: Math.random(),
      colorG: Math.random(),
      colorB: Math.random(),
    })
  }

  return (
    <div className="container mx-auto p-4">
      <Tabs
        defaultValue="create"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="create">Create Shader</TabsTrigger>
          <TabsTrigger value="gallery">Shader Gallery</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              <ShaderPromptInput
                prompt={prompt}
                onPromptChange={setPrompt}
                onGenerate={handleGenerate}
                isLoading={isLoading}
                showEmptyPromptAlert={showEmptyPromptAlert}
              />

              {displayedShaderCode && (
                <>
                  <ShaderPreview
                    shaderCode={displayedShaderCode}
                    shaderParams={shaderParams}
                    isCompileError={isCompileError}
                    onError={handleCompileError}
                  />
                </>
              )}

              {error && (
                <Alert
                  variant="destructive"
                  className="bg-red-900 border-red-700 text-white"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription className="whitespace-pre-wrap">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Right Column */}
            <ShaderCodeEditor
              code={editedShaderCode}
              title={shaderTitle}
              onCodeChange={setEditedShaderCode}
              onTitleChange={setShaderTitle}
              onApplyChanges={handleApplyChanges}
              onSave={handleSave}
              isSaving={isSaving}
              isCompileError={isCompileError}
            />
          </div>
        </TabsContent>

        <TabsContent value="gallery">
          <ShaderGallery />
        </TabsContent>
      </Tabs>
    </div>
  )
}
