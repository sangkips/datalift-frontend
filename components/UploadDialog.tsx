"use client"

import type React from "react"

import { useState, useRef } from "react"
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material"
import { CloudUpload as UploadIcon } from "@mui/icons-material"

interface UploadDialogProps {
  open: boolean
  onClose: () => void
  onUpload: (file: File) => Promise<void>
  title: string
  acceptedFileTypes: string
  uploadType: "document" | "csv"
}

export default function UploadDialog({
  open,
  onClose,
  onUpload,
  title,
  acceptedFileTypes,
  uploadType,
}: UploadDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      setSelectedFile(files[0])
      setError(null)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const files = event.dataTransfer.files
    if (files && files.length > 0) {
      setSelectedFile(files[0])
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file to upload")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      await onUpload(selectedFile)
      handleClose()
    } catch (error) {
      console.error("Upload error:", error)
      setError(error instanceof Error ? error.message : "Failed to upload file")
    } finally {
      setIsUploading(false)
    }
  }

  const handleClose = () => {
    if (!isUploading) {
      setSelectedFile(null)
      setError(null)
      onClose()
    }
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box
          sx={{
            border: "2px dashed",
            borderColor: "divider",
            borderRadius: 2,
            p: 3,
            textAlign: "center",
            cursor: "pointer",
            "&:hover": {
              borderColor: "primary.main",
              bgcolor: "rgba(0, 0, 0, 0.01)",
            },
          }}
          onClick={handleBrowseClick}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
            accept={acceptedFileTypes}
          />
          <UploadIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Drag & Drop {uploadType === "csv" ? "CSV file" : "document"} here
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            or
          </Typography>
          <Button variant="outlined" component="span" sx={{ mt: 1 }}>
            Browse Files
          </Button>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Accepted file types: {acceptedFileTypes.replace(/\./g, "").toUpperCase()}
          </Typography>
        </Box>

        {selectedFile && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">
              Selected file: <strong>{selectedFile.name}</strong> ({(selectedFile.size / 1024).toFixed(2)} KB)
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isUploading}>
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          disabled={!selectedFile || isUploading}
          startIcon={isUploading ? <CircularProgress size={20} /> : null}
        >
          {isUploading ? "Uploading..." : "Upload"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

