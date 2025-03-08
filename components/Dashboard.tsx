"use client"

import { useState, useEffect } from "react"
import { Box, CircularProgress, Snackbar, Alert } from "@mui/material"
import DocumentsView from "@/components/DocumentsView"
import UploadDialog from "@/components/UploadDialog"
import {
  fetchDocuments,
  deleteDocument,
  renameDocument,
  addLabelToDocument,
  uploadDocument,
  uploadCsvFile,
} from "@/lib/api/documents"
import type { Document } from "@/lib/types"

export default function DashboardPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [isCsvUploadDialogOpen, setIsCsvUploadDialogOpen] = useState(false)
  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: "success" | "error" | "info" | "warning"
  }>({
    open: false,
    message: "",
    severity: "info",
  })

  // Fetch documents on component mount
  useEffect(() => {
    loadDocuments()
  }, [])

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  const showSnackbar = (message: string, severity: "success" | "error" | "info" | "warning") => {
    setSnackbar({
      open: true,
      message,
      severity,
    })
  }

  const loadDocuments = async () => {
    setIsLoading(true)
    try {
      const data = await fetchDocuments()
      console.log("Fetched documents:", data)
      setDocuments(data)
    } catch (error) {
      console.error("Error fetching documents:", error)
      showSnackbar("Failed to load documents. Please try again.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddDocument = () => {
    setIsUploadDialogOpen(true)
  }

  const handleUploadCsv = () => {
    setIsCsvUploadDialogOpen(true)
  }

  const handleDocumentUpload = async (file: File) => {
    try {
      const response = await uploadDocument(file)
      if (response.document) {
        setDocuments([...documents, response.document])
        showSnackbar("Document uploaded successfully", "success")
      } else {
        console.error("No document returned from uploadDocument")
        showSnackbar("Failed to upload document. Please try again.", "error")
      }
      
    } catch (error) {
      console.error("Error uploading document:", error)
      showSnackbar("Failed to upload document. Please try again.", "error")
      throw error
    }
  }

  const handleCsvUpload = async (file: File) => {
    try {
      const response = await uploadCsvFile(file)
      if (response.document) {
        setDocuments([...documents, response.document])
        showSnackbar("CSV file uploaded successfully", "success")
      } else {
        console.error("No document returned from uploadCsvFile")
        showSnackbar("Failed to upload CSV file. Please try again.", "error")
      }
      
    } catch (error) {
      console.error("Error uploading CSV:", error)
      showSnackbar("Failed to upload CSV file. Please try again.", "error")
      throw error
    }
  }

  const handleDeleteDocument = async (id: string) => {
    try {
      await deleteDocument(id)
      setDocuments(documents.filter((doc) => doc.id !== id))
      showSnackbar("Document deleted successfully", "success")
    } catch (error) {
      console.error("Error deleting document:", error)
      showSnackbar("Failed to delete document. Please try again.", "error")
      throw error
    }
  }

  const handleRenameDocument = async (id: string, newName: string) => {
    try {
      await renameDocument(id, newName)
      setDocuments(documents.map((doc) => (doc.id === id ? { ...doc, name: newName } : doc)))
      showSnackbar("Document renamed successfully", "success")
    } catch (error) {
      console.error("Error renaming document:", error)
      showSnackbar("Failed to rename document. Please try again.", "error")
      throw error
    }
  }

  const handleAddLabel = async (id: string, label: string) => {
    try {
      await addLabelToDocument(id, label)
      setDocuments(
        documents.map((doc) => {
          if (doc.id === id) {
            const labels = doc.labels || []
            return { ...doc, labels: [...labels, label] }
          }
          return doc
        }),
      )
      showSnackbar("Label added successfully", "success")
    } catch (error) {
      console.error("Error adding label:", error)
      showSnackbar("Failed to add label. Please try again.", "error")
      throw error
    }
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "64vh" }}>
          <CircularProgress />
        </Box>
      ) : (
        <DocumentsView
          documents={documents}
          onAddClick={handleAddDocument}
          onUploadCsv={handleUploadCsv}
          onDeleteDocument={handleDeleteDocument}
          onRenameDocument={handleRenameDocument}
          onAddLabel={handleAddLabel}
          onRefresh={loadDocuments}
        />
      )}

      {/* Document Upload Dialog */}
      <UploadDialog
        open={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        onUpload={handleDocumentUpload}
        title="Upload Document"
        acceptedFileTypes=".pdf,.doc,.docx,.txt"
        uploadType="document"
      />

      {/* CSV Upload Dialog */}
      <UploadDialog
        open={isCsvUploadDialogOpen}
        onClose={() => setIsCsvUploadDialogOpen(false)}
        onUpload={handleCsvUpload}
        title="Upload CSV File"
        acceptedFileTypes=".csv"
        uploadType="csv"
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

