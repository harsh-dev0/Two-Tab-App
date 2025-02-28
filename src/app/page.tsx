import Calculator from "@/components/Calculator"
import ShaderGenerator from "@/components/shader/Shader-generator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

function Home() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-900 text-white">
      {/* Header Section */}
      <header className="w-full bg-gray-800 px-8 py-6 border-b border-gray-700">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold">Two Tab App</h1>
          <p className="text-gray-400 mt-2">
            A calculator and shader generator powered by WASM and LLMs
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full">
        <Tabs defaultValue="calculator" className="w-full">
          {/* Tab Navigation */}
          <div className="w-full bg-gray-800 border-b border-gray-700">
            <div className="container mx-auto px-8">
              <TabsList className="flex space-x-4 bg-transparent">
                <TabsTrigger
                  value="calculator"
                  className="px-6 py-3 text-lg data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-400 text-gray-400 bg-transparent"
                >
                  Calculator
                </TabsTrigger>
                <TabsTrigger
                  value="shader"
                  className="px-6 py-3 text-lg data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-400 text-gray-400 bg-transparent"
                >
                  Shader Generator
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          {/* Tab Content */}
          <div className="container mx-auto p-8">
            <TabsContent value="calculator">
              <Calculator />
            </TabsContent>
            <TabsContent value="shader">
              <ShaderGenerator />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  )
}

export default Home
