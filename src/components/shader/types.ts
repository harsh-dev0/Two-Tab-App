export interface ShaderParams {
  speed: number
  intensity: number
  colorR: number
  colorG: number
  colorB: number
}

export interface Shader {
  _id?: string
  title: string
  description: string
  code: string
  params: ShaderParams
  createdAt: Date
  featured?: boolean
}

