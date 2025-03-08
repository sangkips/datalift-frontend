'use client'

import { useState, useEffect } from 'react'
import { Document } from '@/lib/types'

// Mock initial documents
const initialDocuments: Document[] = [
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

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    // Simulate loading documents from an API
    const loadDocuments = async () => {
      try {
        // In a real app, this would be a fetch call to your API
        await new Promise(resolve => setTimeout(resolve, 1000))
        setDocuments(initialDocuments)
        setIsLoading(false)
      } catch (err) {
        setError('Failed to load documents')
        setIsLoading(false)
      }
    }
    
    loadDocuments()
  }, [])
  
  const addDocument = (document: Document) => {
    setDocuments(prev => [...prev, document])
  }
  
  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id))
  }
  
  const renameDocument = (id: string, newName: string) => {
    setDocuments(prev => 
      prev.map(doc => 
        doc.id === id ? { ...doc, name: newName } : doc
      )
    )
  }
  
  const addLabelToDocument = (id: string, label: string) => {
    setDocuments(prev => 
      prev.map(doc => {
        if (doc.id === id && !doc.labels.includes(label)) {
          return { ...doc, labels: [...doc.labels, label] }
        }
        return doc
      })
    )
  }
  
  return {
    documents,
    isLoading,
    error,
    addDocument,
    deleteDocument,
    renameDocument,
    addLabelToDocument
  }
}