import { NextResponse } from "next/server"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const id = params.id
  const body = await request.json()

  // Validate request body
  if (!body.name) {
    return NextResponse.json({ error: "Document name is required" }, { status: 400 })
  }

  // In a real app, you'd update the document in your database
  // For this example, we'll just return success

  return NextResponse.json({ success: true })
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  // In a real app, you'd delete the document from your database
  // For this example, we'll just return success

  return NextResponse.json({ success: true })
}

