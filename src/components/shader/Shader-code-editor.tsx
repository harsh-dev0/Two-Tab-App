"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Save } from "lucide-react"

interface ShaderCodeEditorProps {
  code: string | null
  title: string
  onCodeChange: (code: string) => void
  onTitleChange: (title: string) => void
  onApplyChanges: () => void
  onSave: () => void
  isSaving: boolean
  isCompileError: boolean
}

export function ShaderCodeEditor({
  code,
  title,
  onCodeChange,
  onTitleChange,
  onApplyChanges,
  onSave,
  isSaving,
  isCompileError,
}: ShaderCodeEditorProps) {
  return (
    <Card className="bg-gray-800 shadow-xl border-gray-700 h-full">
      <CardContent className="p-3 sm:p-4 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-2">
          <h3 className="text-lg font-semibold">Shader Code</h3>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {code && (
              <>
                <Button
                  onClick={onApplyChanges}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white flex-1 sm:flex-none"
                >
                  Apply Changes
                </Button>

                <Button
                  onClick={onSave}
                  size="sm"
                  disabled={isSaving || isCompileError}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1 flex-1 sm:flex-none"
                >
                  {isSaving ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>

        {code ? (
          <div className="space-y-4">
            <Input
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Shader Title"
              className="bg-gray-700 text-white border-gray-600"
            />

            <Textarea
              value={code}
              onChange={(e) => onCodeChange(e.target.value)}
              className="bg-gray-700 rounded-lg p-4 h-[300px] sm:h-[350px] md:h-[calc(100vh-450px)] overflow-auto font-mono text-sm text-white resize-none"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-[200px] sm:h-[300px] md:h-[400px] text-gray-400 bg-gray-700 rounded-lg p-4 text-center">
            Generated shader code will appear here
          </div>
        )}
      </CardContent>
    </Card>
  )
}
