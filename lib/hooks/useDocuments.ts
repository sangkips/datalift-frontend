"use client"

import { useState, useEffect, useCallback } from "react"
import type { Document } from "@/lib/types"
import {
  fetchDocuments,
  updateDocument,
  createDocument,
  deleteDocument as deleteDocumentApi,
  addLabelToDocument as addLabelApi,
} from "@/lib/api/documents"

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch documents on component mount - client-side only
  useEffect(() => {
    let isMounted = true

    const loadDocuments = async () => {
      try {
        setIsLoading(true)
        setError(null)

        let data: Document[]

        try {
          // Try to fetch from API first
          data = await fetchDocuments()
          console.log("Successfully fetched documents from API:", data)

          // Validate that we got an array of documents with required fields
          if (!Array.isArray(data)) {
            console.error("API did not return an array:", data)
            throw new Error("API did not return an array of documents")
          }

          // Check if any documents are missing required fields
          const invalidDocs = data.filter((doc) => !doc.id || !doc.name)
          if (invalidDocs.length > 0) {
            console.error("Some documents are missing required fields:", invalidDocs)
          }
        } catch (apiError) {
          console.error("API fetch failed:", apiError)
          setError(`Failed to connect to API: ${apiError instanceof Error ? apiError.message : String(apiError)}`)
          // Use empty array for now
          data = []
        }

        // Only update state if component is still mounted
        if (isMounted) {
          setDocuments(data)
          setIsLoading(false)
        }
      } catch (err) {
        console.error("Error in loadDocuments:", err)
        // Only update state if component is still mounted
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load documents")
          setIsLoading(false)
        }
      }
    }

    loadDocuments()

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false
    }
  }, [])

  // Add a new document
  const addDocument = useCallback(async (document: Partial<Document>) => {
    try {
      setError(null)
      const newDocument = await createDocument(document)
      setDocuments((prev) => [...prev, newDocument])
      return newDocument
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add document")
      throw err
    }
  }, [])

  // Delete a document
  const deleteDocument = useCallback(async (id: string) => {
    try {
      setError(null)
      await deleteDocumentApi(id)
      setDocuments((prev) => prev.filter((doc) => doc.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete document")
      throw err
    }
  }, [])

  // Rename a document
  const renameDocument = useCallback(async (id: string, newName: string) => {
    try {
      setError(null)
      const updatedDocument = await updateDocument(id, { name: newName })
      setDocuments((prev) => prev.map((doc) => (doc.id === id ? updatedDocument : doc)))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to rename document")
      throw err
    }
  }, [])

  // Add a label to a document
  const addLabelToDocument = useCallback(async (id: string, label: string) => {
    try {
      setError(null)
      const updatedDocument = await addLabelApi(id, label)
      setDocuments((prev) => prev.map((doc) => (doc.id === id ? updatedDocument : doc)))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add label")
      throw err
    }
  }, [])

  // Refresh documents
  const refreshDocuments = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await fetchDocuments()
      setDocuments(data)
      setIsLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refresh documents")
      setIsLoading(false)
    }
  }, [])

  return {
    documents,
    isLoading,
    error,
    addDocument,
    deleteDocument,
    renameDocument,
    addLabelToDocument,
    refreshDocuments,
  }
}

