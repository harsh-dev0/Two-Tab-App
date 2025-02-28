import { type NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// Define Route Context Type
interface RouteContext {
  params: {
    id: string;
  };
}

// GET /api/shaders/[id] - Get a specific shader
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = context.params; // ✅ Explicitly defined

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid shader ID" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const shader = await db.collection("shaders").findOne({ _id: new ObjectId(id) });

    if (!shader) {
      return NextResponse.json({ error: "Shader not found" }, { status: 404 });
    }

    return NextResponse.json(shader);
  } catch (error) {
    console.error("Error fetching shader:", error);
    return NextResponse.json({ error: "Failed to fetch shader" }, { status: 500 });
  }
}
