// import { NextResponse } from "next/server"
// import { getMockDocuments } from "@/lib/api/documents"

// /**
//  * GET handler for /api/documents/[id]
//  * Returns a single document by ID
//  */
// export async function GET(request: Request, { params }: { params: { id: string } }) {
//   try {
//     const id = params.id

//     // In a real application, you would fetch the document from your database
//     // For now, we'll use mock data
//     const documents = getMockDocuments()
//     const document = documents.find((doc) => doc.id === id)

//     if (!document) {
//       return NextResponse.json({ message: `Document with ID ${id} not found` }, { status: 404 })
//     }

//     return NextResponse.json(document)
//   } catch (error) {
//     console.error(`Error in GET /api/documents/${params.id}:`, error)
//     return NextResponse.json({ message: "Failed to fetch document" }, { status: 500 })
//   }
// }

// /**
//  * PUT handler for /api/documents/[id]
//  * Updates a document by ID
//  */
// export async function PUT(request: Request, { params }: { params: { id: string } }) {
//   try {
//     const id = params.id
//     const body = await request.json()

//     // In a real application, you would update the document in your database
//     // For now, we'll use mock data
//     const documents = getMockDocuments()
//     const documentIndex = documents.findIndex((doc) => doc.id === id)

//     if (documentIndex === -1) {
//       return NextResponse.json({ message: `Document with ID ${id} not found` }, { status: 404 })
//     }

//     // Update the document
//     const updatedDocument = {
//       ...documents[documentIndex],
//       ...body,
//       id, // Ensure ID doesn't change
//     }

//     return NextResponse.json(updatedDocument)
//   } catch (error) {
//     console.error(`Error in PUT /api/documents/${params.id}:`, error)
//     return NextResponse.json({ message: "Failed to update document" }, { status: 500 })
//   }
// }

// /**
//  * DELETE handler for /api/documents/[id]
//  * Deletes a document by ID
//  */
// export async function DELETE(request: Request, { params }: { params: { id: string } }) {
//   try {
//     const id = params.id

//     // In a real application, you would delete the document from your database
//     // For now, we'll just return a success response

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error(`Error in DELETE /api/documents/${params.id}:`, error)
//     return NextResponse.json({ message: "Failed to delete document" }, { status: 500 })
//   }
// }

