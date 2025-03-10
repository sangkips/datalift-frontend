import { NextResponse } from "next/server"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const id = params.id
  const body = await request.json()

  // Validate request body
  if (!body.label) {
    return NextResponse.json({ error: "Label is required" }, { status: 400 })
  }

  // In a real app, you'd add the label to the document in your database
  // For this example, we'll just return success

  return NextResponse.json({ success: true })
}

