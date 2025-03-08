// import { NextResponse } from "next/server"

// /**
//  * POST handler for /api/documents/upload
//  * Uploads one or more documents
//  */
// export async function POST(request: Request) {
//   try {
//     // In a real application, you would:
//     // 1. Parse the multipart form data
//     // 2. Process and store the files
//     // 3. Create document records in your database

//     // For now, we'll just return mock data with fixed IDs and dates
//     const mockUploadedDocuments = [
//       {
//         id: "upload-1",
//         name: "Uploaded Document 1.pdf",
//         daysAgo: 0,
//         pages: 5,
//         labels: [],
//         uploadDate: "2025-03-08T12:00:00Z",
//       },
//       {
//         id: "upload-2",
//         name: "Uploaded Document 2.pdf",
//         daysAgo: 0,
//         pages: 8,
//         labels: [],
//         uploadDate: "2025-03-08T12:00:00Z",
//       },
//     ]

//     // Simulate processing time
//     await new Promise((resolve) => setTimeout(resolve, 1000))

//     return NextResponse.json(mockUploadedDocuments, { status: 201 })
//   } catch (error) {
//     console.error("Error in POST /api/documents/upload:", error)
//     return NextResponse.json({ message: "Failed to upload documents" }, { status: 500 })
//   }
// }

// // Need to disable the default body parser for file uploads
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// }

