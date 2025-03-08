import { NextResponse } from 'next/server'
import type { Document } from '@/lib/types'

// This would be replaced with a database in a real application
let documents: Document[] = [
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

export async function GET() {
  return NextResponse.json(documents)
}

export async function POST(request: Request) {
  try {
    const document = await request.json()
    
    // Validate document
    if (!document.name) {
      return NextResponse.json(
        { error: 'Document name is required' },
        { status: 400 }
      )
    }
    
    // Add document
    const newDocument: Document = {
      id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: document.name,
      content: document.content || null,
      daysAgo: 0,
      pages: document.pages || 1,
      labels: document.labels || [],
      uploadDate: new Date().toISOString()
    }
    
    documents.push(newDocument)
    
    return NextResponse.json(newDocument, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create document' },
      { status: 500 }
    )
  }
}