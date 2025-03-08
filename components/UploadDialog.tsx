'use client'

import { useState, useRef } from 'react'
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button,
  LinearProgress,
  Alert
} from '@mui/material'
import { CloudUpload } from '@mui/icons-material'
import { Document } from '@/lib/types'
import { parseCSV } from '@/lib/utils/csvParser'

interface UploadDialogProps {
  open: boolean
  onClose: () => void
  onUploadSuccess: (documents: Document[]) => void
}

export default function UploadDialog({ 
  open, 
  onClose,
  onUploadSuccess
}: UploadDialogProps) {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const fileList = Array.from(event.target.files)
      const csvFiles = fileList.filter(file => file.name.endsWith('.csv'))
      
      if (csvFiles.length !== fileList.length) {
        setError('Only CSV files are supported')
      } else {
        setError(null)
        setFiles(csvFiles)
      }
    }
  }
  
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }
  
  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    
    if (event.dataTransfer.files) {
      const fileList = Array.from(event.dataTransfer.files)
      const csvFiles = fileList.filter(file => file.name.endsWith('.csv'))
      
      if (csvFiles.length !== fileList.length) {
        setError('Only CSV files are supported')
      } else {
        setError(null)
        setFiles(csvFiles)
      }
    }
  }
  
  const handleUpload = async () => {
    if (files.length === 0) return
    
    setUploading(true)
    setUploadProgress(0)
    setError(null)
    
    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 10
          if (newProgress >= 100) {
            clearInterval(progressInterval)
            return 100
          }
          return newProgress
        })
      }, 300)
      
      // Process CSV files
      const newDocuments: Document[] = []
      
      for (const file of files) {
        const content = await file.text()
        const parsedData = parseCSV(content)
        
        // Create a document from the CSV file
        const newDocument: Document = {
          id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          content: parsedData,
          daysAgo: 0,
          pages: Math.ceil(parsedData.length / 10), // Estimate pages based on rows
          labels: [],
          uploadDate: new Date().toISOString()
        }
        
        newDocuments.push(newDocument)
      }
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      clearInterval(progressInterval)
      setUploadProgress(100)
      
      // Wait a bit to show 100% progress
      setTimeout(() => {
        onUploadSuccess(newDocuments)
        setFiles([])
        setUploading(false)
        setUploadProgress(0)
      }, 500)
      
    } catch (err) {
      setError('Failed to upload files. Please try again.')
      setUploading(false)
    }
  }
  
  const handleCancel = () => {
    setFiles([])
    setError(null)
    onClose()
  }
  
  return (
    <Dialog open={open} onClose={uploading ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Upload CSV Documents</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" className="mb-4">{error}</Alert>
        )}
        
        {uploading ? (
          <div className="py-4">
            <p className="mb-2">Uploading {files.length} file(s)...</p>
            <LinearProgress variant="determinate" value={uploadProgress} className="mb-2" />
            <p className="text-right text-sm text-gray-500">{uploadProgress}%</p>
          </div>
        ) : (
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv"
              multiple
              className="hidden"
            />
            <CloudUpload style={{ fontSize: 48 }} className="mx-auto mb-4 text-gray-400" />
            <p className="mb-2">Drag and drop CSV files here, or click to browse</p>
            <p className="text-sm text-gray-500">Only CSV files are supported</p>
          </div>
        )}
        
        {!uploading && files.length > 0 && (
          <div className="mt-4">
            <p className="font-medium mb-2">Selected Files:</p>
            <ul className="list-disc pl-5">
              {files.map((file, index) => (
                <li key={index} className="text-sm">
                  {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </li>
              ))}
            </ul>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} disabled={uploading}>
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={handleUpload} 
          disabled={files.length === 0 || uploading}
          className="add-button"
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  )
}