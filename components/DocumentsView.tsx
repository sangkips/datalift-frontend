'use client'

import { useState } from 'react'
import { 
  Checkbox, 
  Button, 
  IconButton, 
  Menu, 
  MenuItem,
  CircularProgress,
  Alert
} from '@mui/material'
import { 
  Refresh, 
  MoreVert, 
  Description, 
  AccessTime, 
  FileCopy,
  Chat,
  Visibility,
  PictureAsPdf,
  Label,
  Edit,
  DocumentScanner,
  Delete
} from '@mui/icons-material'
import FilterDropdown from './FilterDropdown'
import { Document } from '@/lib/types'

interface DocumentsViewProps {
  documents: Document[]
  isLoading: boolean
  error: string | null
  onAddClick: () => void
  onDeleteDocument: (id: string) => void
  onRenameDocument: (id: string, newName: string) => void
  onAddLabel: (id: string, label: string) => void
}

export default function DocumentsView({
  documents,
  isLoading,
  error,
  onAddClick,
  onDeleteDocument,
  onRenameDocument,
  onAddLabel
}: DocumentsViewProps) {
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null)
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null)
  const [labelInputValue, setLabelInputValue] = useState('')
  const [renameInputValue, setRenameInputValue] = useState('')
  const [isRenaming, setIsRenaming] = useState(false)
  const [isAddingLabel, setIsAddingLabel] = useState(false)
  
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedDocuments(documents.map(doc => doc.id))
    } else {
      setSelectedDocuments([])
    }
  }
  
  const handleSelectDocument = (id: string) => {
    if (selectedDocuments.includes(id)) {
      setSelectedDocuments(selectedDocuments.filter(docId => docId !== id))
    } else {
      setSelectedDocuments([...selectedDocuments, id])
    }
  }
  
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, documentId: string) => {
    setMenuAnchorEl(event.currentTarget)
    setActiveDocumentId(documentId)
  }
  
  const handleMenuClose = () => {
    setMenuAnchorEl(null)
    setActiveDocumentId(null)
  }
  
  const handleOpenChat = () => {
    console.log('Open chat for document:', activeDocumentId)
    handleMenuClose()
    // This would open the chat interface
  }
  
  const handleShowDetails = () => {
    console.log('Show details for document:', activeDocumentId)
    handleMenuClose()
    // This would show document details
  }
  
  const handleOpenPdfViewer = () => {
    console.log('Open PDF viewer for document:', activeDocumentId)
    handleMenuClose()
    // This would open the PDF viewer
  }
  
  const handleAddLabel = () => {
    setIsAddingLabel(true)
    handleMenuClose()
  }
  
  const handleRename = () => {
    const document = documents.find(doc => doc.id === activeDocumentId)
    if (document) {
      setRenameInputValue(document.name)
      setIsRenaming(true)
    }
    handleMenuClose()
  }
  
  const handleOcrDocument = () => {
    console.log('OCR document:', activeDocumentId)
    handleMenuClose()
    // This would trigger OCR processing
  }
  
  const handleDelete = () => {
    if (activeDocumentId) {
      onDeleteDocument(activeDocumentId)
    }
    handleMenuClose()
  }
  
  const handleSubmitLabel = (e: React.FormEvent) => {
    e.preventDefault()
    if (activeDocumentId && labelInputValue.trim()) {
      onAddLabel(activeDocumentId, labelInputValue.trim())
      setLabelInputValue('')
      setIsAddingLabel(false)
    }
  }
  
  const handleSubmitRename = (e: React.FormEvent) => {
    e.preventDefault()
    if (activeDocumentId && renameInputValue.trim()) {
      onRenameDocument(activeDocumentId, renameInputValue.trim())
      setRenameInputValue('')
      setIsRenaming(false)
    }
  }
  
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-2xl font-bold">Documents</h1>
          <p className="text-gray-600">Overview of the documents in Personal 1 workspace</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="contained" 
            startIcon={<span className="text-xl">+</span>}
            className="add-button"
            onClick={onAddClick}
          >
            Add
          </Button>
          <IconButton>
            <Refresh />
          </IconButton>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex justify-end gap-2 mb-4">
        <FilterDropdown label="Labels" options={['All', 'Important', 'Work', 'Personal']} />
        <FilterDropdown label="Pages" options={['All', '1-5', '6-10', '10+']} />
        <FilterDropdown label="Dates" options={['All', 'Today', 'This Week', 'This Month']} />
      </div>
      
      {/* Select All */}
      <div className="mb-4">
        <label className="flex items-center">
          <Checkbox 
            checked={selectedDocuments.length === documents.length && documents.length > 0}
            indeterminate={selectedDocuments.length > 0 && selectedDocuments.length < documents.length}
            onChange={handleSelectAll}
          />
          <span>Select all</span>
        </label>
      </div>
      
      {/* Free Plan Notice */}
      <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-md mb-4">
        <p className="text-sm">
          This is a free community plan, documents and associated chats will be removed after 7 days of inactivity. 
          <a href="#" className="text-blue-600 ml-1">Upgrade your plan</a> to ensure your documents and chats remain without any time limits.
        </p>
      </div>
      
      {/* Documents List */}
      {isLoading ? (
        <div className="flex justify-center my-12">
          <CircularProgress />
        </div>
      ) : error ? (
        <Alert severity="error" className="my-4">{error}</Alert>
      ) : documents.length === 0 ? (
        <div className="text-center my-12 text-gray-500">
          <Description style={{ fontSize: 48 }} className="mx-auto mb-4 opacity-50" />
          <p>No documents found. Click the Add button to upload your first document.</p>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          {documents.map(document => (
            <div key={document.id} className="document-row border-b last:border-b-0 p-4 flex items-center">
              <Checkbox 
                checked={selectedDocuments.includes(document.id)}
                onChange={() => handleSelectDocument(document.id)}
              />
              <Description className="text-blue-600 mx-3" />
              <div className="flex-1">
                <p className="font-medium">{document.name}</p>
              </div>
              <div className="flex items-center text-gray-500 mr-4">
                <AccessTime className="w-4 h-4 mr-1" />
                <span className="text-sm">{document.daysAgo} days ago</span>
              </div>
              <div className="flex items-center text-gray-500 mr-4">
                <FileCopy className="w-4 h-4 mr-1" />
                <span className="text-sm">{document.pages} pages</span>
              </div>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => onAddLabel(document.id, 'New Label')}
              >
                Add label
              </Button>
              <IconButton onClick={(e) => handleMenuOpen(e, document.id)}>
                <MoreVert />
              </IconButton>
            </div>
          ))}
        </div>
      )}
      
      {/* Upload Limit Notice */}
      <div className="bg-purple-50 border border-purple-100 p-4 rounded-md mt-4">
        <p>You have 3 uploads left today with your current community plan.</p>
      </div>
      
      {/* Document Actions Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        className="dropdown-menu"
      >
        <MenuItem onClick={handleOpenChat} className="dropdown-item">
          <Chat className="mr-2" /> Open Chat
        </MenuItem>
        <MenuItem onClick={handleShowDetails} className="dropdown-item">
          <Visibility className="mr-2" /> Show Details
        </MenuItem>
        <MenuItem onClick={handleOpenPdfViewer} className="dropdown-item">
          <PictureAsPdf className="mr-2" /> Open PDF Viewer
        </MenuItem>
        <MenuItem onClick={handleAddLabel} className="dropdown-item">
          <Label className="mr-2" /> Add Label
        </MenuItem>
        <MenuItem onClick={handleRename} className="dropdown-item">
          <Edit className="mr-2" /> Rename
        </MenuItem>
        <MenuItem onClick={handleOcrDocument} className="dropdown-item">
          <DocumentScanner className="mr-2" /> OCR Document
        </MenuItem>
        <MenuItem onClick={handleDelete} className="dropdown-item text-red-600">
          <Delete className="mr-2" /> Delete
        </MenuItem>
      </Menu>
      
      {/* Add Label Dialog */}
      {isAddingLabel && activeDocumentId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add Label</h2>
            <form onSubmit={handleSubmitLabel}>
              <input
                type="text"
                value={labelInputValue}
                onChange={(e) => setLabelInputValue(e.target.value)}
                placeholder="Enter label name"
                className="w-full p-2 border rounded mb-4"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outlined" 
                  onClick={() => setIsAddingLabel(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="contained" 
                  type="submit"
                  className="add-button"
                >
                  Add
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Rename Dialog */}
      {isRenaming && activeDocumentId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Rename Document</h2>
            <form onSubmit={handleSubmitRename}>
              <input
                type="text"
                value={renameInputValue}
                onChange={(e) => setRenameInputValue(e.target.value)}
                placeholder="Enter new name"
                className="w-full p-2 border rounded mb-4"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outlined" 
                  onClick={() => setIsRenaming(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="contained" 
                  type="submit"
                  className="add-button"
                >
                  Rename
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}