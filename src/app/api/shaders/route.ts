import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

// GET /api/shaders - Get all shaders
export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db()

    const shaders = await db.collection("shaders").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(shaders)
  } catch (error) {
    console.error("Error fetching shaders:", error)
    return NextResponse.json({ error: "Failed to fetch shaders" }, { status: 500 })
  }
}

// POST /api/shaders - Create a new shader
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.code) {
      return NextResponse.json({ error: "Title and code are required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()

    const result = await db.collection("shaders").insertOne({
      title: body.title,
      description: body.description || "",
      code: body.code,
      params: body.params || {
        speed: 1.0,
        intensity: 0.5,
        colorR: 1.0,
        colorG: 0.5,
        colorB: 0.8,
      },
      createdAt: new Date(),
      featured: false,
    })

    return NextResponse.json({
      _id: result.insertedId,
      ...body,
      createdAt: new Date(),
    })
  } catch (error) {
    console.error("Error creating shader:", error)
    return NextResponse.json({ error: "Failed to create shader" }, { status: 500 })
  }
}

