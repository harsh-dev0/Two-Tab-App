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
      <header className="w-full bg-gray-800 px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-700">
        <div className="container mx-auto">
          <h1 className="text-2xl sm:text-4xl font-bold">Two Tab App</h1>
          <p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">
            A calculator and shader generator powered by WASM and LLMs
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full">
        <Tabs defaultValue="calculator" className="w-full">
          {/* Tab Navigation */}
          <div className="w-full bg-gray-800 border-b border-gray-700">
            <div className="container mx-auto px-4 sm:px-8">
              <TabsList className="flex space-x-2 sm:space-x-4 bg-transparent -mb-px">
                <TabsTrigger
                  value="calculator"
                  className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-lg rounded-t-lg 
                    data-[state=active]:bg-white data-[state=active]:text-blue-400
                    data-[state=active]:border-blue-400
                    text-gray-400 bg-transparent transition-all"
                >
                  Calculator
                </TabsTrigger>
                <TabsTrigger
                  value="shader"
                  className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-lg rounded-t-lg
                    data-[state=active]:bg-white data-[state=active]:text-blue-400
                    data-[state=active]:border-blue-400
                    text-gray-400 bg-transparent transition-all"
                >
                  Shader Generator
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          {/* Tab Content */}
          <div className="container mx-auto p-4 sm:p-8">
            <TabsContent
              value="calculator"
              className="focus-visible:outline-none"
            >
              <Calculator />
            </TabsContent>
            <TabsContent
              value="shader"
              className="focus-visible:outline-none"
            >
              <ShaderGenerator />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  )
}

export default Home
