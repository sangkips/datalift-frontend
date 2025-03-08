// import { NextResponse } from "next/server"
// import { getMockDocuments } from "@/lib/api/documents"

// /**
//  * GET handler for /api/documents
//  * Returns a list of all documents
//  */
// export async function GET() {
//   try {
//     // In a real application, you would fetch documents from your database
//     // For now, we'll use mock data
//     const documents = getMockDocuments()

//     return NextResponse.json(documents)
//   } catch (error) {
//     console.error("Error in GET /api/documents:", error)
//     return NextResponse.json({ message: "Failed to fetch documents" }, { status: 500 })
//   }
// }

// /**
//  * POST handler for /api/documents
//  * Creates a new document
//  */
// export async function POST(request: Request) {
//   try {
//     const body = await request.json()

//     // In a real application, you would save the document to your database
//     // For now, we'll just return the document with a generated ID
//     const newDocument = {
//       id: `mock-${Date.now()}`,
//       name: body.name || "Untitled Document",
//       daysAgo: 0,
//       pages: body.pages || 1,
//       labels: body.labels || [],
//       uploadDate: "2025-03-08T12:00:00Z", // Fixed date to avoid hydration issues
//     }

//     return NextResponse.json(newDocument, { status: 201 })
//   } catch (error) {
//     console.error("Error in POST /api/documents:", error)
//     return NextResponse.json({ message: "Failed to create document" }, { status: 500 })
//   }
// }

