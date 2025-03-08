import { NextResponse } from 'next/server'

// This would be replaced with a database in a real application
let documents = [
  {
    id: 'doc-1',
    name: 'System_Architecture_Question to Tech Team.docx',
    content: null,
    daysAgo: 2,
    pages: 3,
    labels: [],
    uploadDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'doc-2',
    name: 'System_Architecture_Question to Tech Team.docx',
    content: null,
    daysAgo: 2,
    pages: 3,
    labels: [],
    uploadDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
]

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const document = documents.find(doc => doc.id === params.id)
  
  if (!document) {
    return NextResponse.json(
      { error: 'Document not found' },
      { status: 404 }
    )
  }
  
  return NextResponse.json(document)
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json()
    const index = documents.findIndex(doc => doc.id === params.id)
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }
    
    // Update document
    documents[index] = {
      ...documents[index],
      ...updates,
    }
    
    return NextResponse.json(documents[index])
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update document' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const index = documents.findIndex(doc => doc.id === params.id)
  
  if (index === -1) {
    return NextResponse.json(
      { error: 'Document not found' },
      { status: 404 }
    )
  }
  
  // Remove document
  documents = documents.filter(doc => doc.id !== params.id)
  
  return NextResponse.json({ success: true })
}