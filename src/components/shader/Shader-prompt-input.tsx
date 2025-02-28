"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

interface ShaderPromptInputProps {
  prompt: string
  onPromptChange: (prompt: string) => void
  onGenerate: () => void
  isLoading: boolean
  showEmptyPromptAlert: boolean
}

export function ShaderPromptInput({
  prompt,
  onPromptChange,
  onGenerate,
  isLoading,
  showEmptyPromptAlert,
}: ShaderPromptInputProps) {
  return (
    <Card className="bg-gray-800 shadow-xl border-gray-700">
      <CardContent className="p-6">
        <div className="flex gap-4">
          <Input
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder="Describe the shader (e.g., 'A rotating cube with gradient background')"
            className="flex-1 bg-gray-700 text-white px-4 py-3 rounded-md border-gray-600"
          />
          <Button
            onClick={onGenerate}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 px-6 whitespace-nowrap text-white font-medium"
          >
            {isLoading ? "Generating..." : "Generate"}
          </Button>
        </div>

        {showEmptyPromptAlert && (
          <Alert variant="destructive" className="mt-4 bg-amber-900 border-amber-700 text-white">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Please enter a prompt before generating</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

