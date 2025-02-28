"use client"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

function Calculator() {
  const [expression, setExpression] = useState("")
  const [result, setResult] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [wasmModule, setWasmModule] = useState<any>(null)

  useEffect(() => {
    // Initialize WASM module
    import("../../rust-calculator/pkg/rust_calculator")
      .then(async (module) => {
        await module.default()
        setWasmModule(module)
      })
      .catch((err) => {
        console.error("Failed to load WASM module:", err)
        setError("Failed to initialize calculator")
      })
  }, [])

  const calculateResult = () => {
    if (!wasmModule || !expression.trim()) return
    try {
      setError(null)
      console.log("Calculating expression:", expression)
      const result = wasmModule.calculate(expression)
      console.log("Result:", result)
      if (isNaN(result) || !isFinite(result)) {
        throw new Error("Invalid calculation result")
      }
      setResult(result)
    } catch (err) {
      console.error("Calculation error:", err)
      setError("Invalid expression")
      setResult(null)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      calculateResult()
    }
  }

  return (
    <div className="w-full">
      <Card className="bg-gray-800 shadow-xl border-gray-700">
        <CardContent className="p-6">
          <div className="space-y-8">
            <div className="flex gap-4">
              <Input
                type="text"
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter expression (e.g., 2+2, 3*(4+5))"
                className="flex-1 bg-gray-700 text-white px-4 py-3 rounded-md text-lg border-gray-600"
              />
              <Button
                onClick={calculateResult}
                disabled={!wasmModule}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 text-white font-medium"
              >
                Calculate
              </Button>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {result !== null && (
              <div className="mt-6 text-7xl font-bold text-center py-12 bg-gray-700/50 rounded-lg">
                {result}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Calculator
