import { NextResponse } from "next/server"

// Mock data for demonstration
const mockDocuments = [
  {
    id: "1",
    name: "Project Proposal.pdf",
    daysAgo: 2,
    pages: 5,
    labels: ["Work"],
  },
  {
    id: "2",
    name: "Meeting Notes.pdf",
    daysAgo: 1,
    pages: 3,
    labels: ["Important"],
  },
  {
    id: "3",
    name: "Financial Report.pdf",
    daysAgo: 5,
    pages: 12,
    labels: ["Finance"],
  },
]

export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Return mock data
  return NextResponse.json({ documents: mockDocuments })
}

export async function POST(request: Request) {
  const body = await request.json()

  // Validate request body
  if (!body.name) {
    return NextResponse.json({ error: "Document name is required" }, { status: 400 })
  }

  // Create a new document (in a real app, you'd save to a database)
  const newDocument = {
    id: Date.now().toString(),
    name: body.name,
    daysAgo: 0,
    pages: body.pages || 1,
    labels: body.labels || [],
  }

  return NextResponse.json({ document: newDocument }, { status: 201 })
}

