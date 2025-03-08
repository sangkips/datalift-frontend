"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Button,
  Checkbox,
  IconButton,
  Typography,
  Paper,
  Box,
  Link,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material"
import {
  KeyboardArrowDown as ChevronDownIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  AccessTime as ClockIcon,
  Description as FileTextIcon,
  InsertDriveFile as FileIcon,
  Chat as ChatIcon,
  Visibility as VisibilityIcon,
  PictureAsPdf as PdfIcon,
  Label as LabelIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Upload as UploadIcon,
} from "@mui/icons-material"
import type { Document } from "@/lib/types"

interface DocumentsViewProps {
  documents: Document[]
  onAddClick: () => void
  onUploadCsv: () => void
  onDeleteDocument: (id: string) => Promise<void>
  onRenameDocument: (id: string, newName: string) => Promise<void>
  onAddLabel: (id: string, label: string) => Promise<void>
  onRefresh: () => Promise<void>
}

export default function DocumentsView({
  documents,
  onAddClick,
  onUploadCsv,
  onDeleteDocument,
  onRenameDocument,
  onAddLabel,
  onRefresh,
}: DocumentsViewProps) {
  const [selectedDocs, setSelectedDocs] = useState<string[]>([])
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null)
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null)
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [isAddLabelDialogOpen, setIsAddLabelDialogOpen] = useState(false)
  const [renameValue, setRenameValue] = useState("")
  const [labelValue, setLabelValue] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  // Debug effect to log documents when they change
  useEffect(() => {
    console.log("DocumentsView received documents:", documents)
  }, [documents])

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedDocs(documents.map((doc) => doc.id !== undefined ? doc.id : null).filter((id) => id !== null))
    } else {
      setSelectedDocs([])
    }
  }

  const handleSelectDocument = (id: string) => {
    if (selectedDocs.includes(id)) {
      setSelectedDocs(selectedDocs.filter((docId) => docId !== id))
    } else {
      setSelectedDocs([...selectedDocs, id])
    }
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, documentId: string) => {
    setMenuAnchorEl(event.currentTarget)
    setActiveDocumentId(documentId)
  }

  const handleMenuClose = () => {
    setMenuAnchorEl(null)
  }

  const handleOpenChat = () => {
    console.log("Open chat for document:", activeDocumentId)
    handleMenuClose()
    // This would open the chat interface
  }

  const handleShowDetails = () => {
    console.log("Show details for document:", activeDocumentId)
    handleMenuClose()
    // This would show document details
  }

  const handleOpenPdfViewer = () => {
    console.log("Open PDF viewer for document:", activeDocumentId)
    handleMenuClose()
    // This would open the PDF viewer
  }

  const handleAddLabel = () => {
    setIsAddLabelDialogOpen(true)
    handleMenuClose()
  }

  const handleRename = () => {
    const document = documents.find((doc) => doc.id === activeDocumentId)
    if (document) {
      setRenameValue(document.name)
      setIsRenameDialogOpen(true)
    }
    handleMenuClose()
  }

  const handleDelete = async () => {
    if (activeDocumentId) {
      setIsProcessing(true)
      setActionError(null)
      try {
        await onDeleteDocument(activeDocumentId)
      } catch (error) {
        setActionError("Failed to delete document")
      } finally {
        setIsProcessing(false)
      }
    }
    handleMenuClose()
  }

  const handleRefresh = async () => {
    setIsProcessing(true)
    setActionError(null)
    try {
      await onRefresh()
    } catch (error) {
      setActionError("Failed to refresh documents")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSubmitRename = async () => {
    if (activeDocumentId && renameValue.trim()) {
      setIsProcessing(true)
      setActionError(null)
      try {
        await onRenameDocument(activeDocumentId, renameValue.trim())
        setIsRenameDialogOpen(false)
        setRenameValue("")
      } catch (error) {
        setActionError("Failed to rename document")
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const handleSubmitLabel = async () => {
    if (activeDocumentId && labelValue.trim()) {
      setIsProcessing(true)
      setActionError(null)
      try {
        await onAddLabel(activeDocumentId, labelValue.trim())
        setIsAddLabelDialogOpen(false)
        setLabelValue("")
      } catch (error) {
        setActionError("Failed to add label")
      } finally {
        setIsProcessing(false)
      }
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 0.5 }}>
            Documents
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Overview of the documents in Personal 1 workspace
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            onClick={onUploadCsv}
            disabled={isProcessing}
            sx={{
              textTransform: "none",
            }}
          >
            Upload CSV
          </Button>
          <IconButton size="small" color="default" onClick={handleRefresh} disabled={isProcessing}>
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Action Error */}
      {actionError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setActionError(null)}>
          {actionError}
        </Alert>
      )}

      {/* Select All */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Checkbox
          size="small"
          checked={documents.length > 0 && selectedDocs.length === documents.length}
          indeterminate={selectedDocs.length > 0 && selectedDocs.length < documents.length}
          onChange={handleSelectAll}
          disabled={isProcessing || documents.length === 0}
        />
        <Typography variant="body2" color="text.secondary">
          Select all
        </Typography>
      </Box>

      {/* Filters */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mb: 2 }}>
        <Button
          variant="outlined"
          endIcon={<ChevronDownIcon />}
          size="small"
          disabled={isProcessing}
          sx={{ textTransform: "none", color: "text.secondary" }}
        >
          Labels
        </Button>
        <Button
          variant="outlined"
          endIcon={<ChevronDownIcon />}
          size="small"
          disabled={isProcessing}
          sx={{ textTransform: "none", color: "text.secondary" }}
        >
          Pages
        </Button>
        <Button
          variant="outlined"
          endIcon={<ChevronDownIcon />}
          size="small"
          disabled={isProcessing}
          sx={{ textTransform: "none", color: "text.secondary" }}
        >
          Dates
        </Button>
      </Box>

      {/* Community Plan Notice */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: "#FEF9C3",
          border: "1px solid #FEF08A",
          p: 2,
          borderRadius: 2,
          mb: 3,
        }}
      >
        <Typography variant="body2">
          This is a free community plan, documents and associated chats will be removed after 7 days of inactivity.
          <Link href="#" sx={{ ml: 0.5 }}>
            Upgrade your plan
          </Link>{" "}
          to ensure your documents and chats are stored securely without any time limits.
        </Typography>
      </Paper>

      {/* Processing Indicator */}
      {isProcessing && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {/* Documents List */}
      {!documents || documents.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 6,
            color: "text.secondary",
          }}
        >
          <FileIcon sx={{ fontSize: 48, mb: 2 }} />
          <Typography>No documents found. Click the Add button to upload your first document.</Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {documents.map((doc) => (
            <Paper
              key={doc.id}
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                p: 2,
                borderRadius: 2,
                "&:hover": { bgcolor: "rgba(0, 0, 0, 0.02)" },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Checkbox
                  size="small"
                  checked={selectedDocs.includes(doc.id ?? '')}
                  onChange={() => handleSelectDocument(doc.id ?? '')}
                  disabled={isProcessing}
                />
                <FileTextIcon sx={{ color: "text.disabled" }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1">{doc.name}</Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 3, mt: 1 }}>
                    {/* <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <ClockIcon fontSize="small" color="disabled" />
                      <Typography variant="body2" color="text.secondary">
                        {doc.daysAgo} days ago
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <FileTextIcon fontSize="small" color="disabled" />
                      <Typography variant="body2" color="text.secondary">
                        {doc.pages} pages
                      </Typography>
                    </Box> */}
                  </Box>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setActiveDocumentId(doc.id ?? '')
                    setIsAddLabelDialogOpen(true)
                  }}
                  disabled={isProcessing}
                  sx={{ textTransform: "none" }}
                >
                  Add label
                </Button>
                <IconButton size="small" onClick={(e) => handleMenuOpen(e, doc.id ?? '')} disabled={isProcessing}>
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      {/* Upload Limit Notice */}
      <Paper
        elevation={0}
        sx={{
          mt: 3,
          bgcolor: "#F3E8FF",
          p: 2,
          borderRadius: 2,
        }}
      >
        <Typography variant="body2">You have 3 uploads left today with your current community plan.</Typography>
      </Paper>

      {/* Document Actions Menu */}
      <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleOpenChat} disabled={isProcessing}>
          <ChatIcon fontSize="small" sx={{ mr: 1 }} /> Open Chat
        </MenuItem>
        <MenuItem onClick={handleShowDetails} disabled={isProcessing}>
          <VisibilityIcon fontSize="small" sx={{ mr: 1 }} /> Show Details
        </MenuItem>
        <MenuItem onClick={handleOpenPdfViewer} disabled={isProcessing}>
          <PdfIcon fontSize="small" sx={{ mr: 1 }} /> Open PDF Viewer
        </MenuItem>
        <MenuItem onClick={handleAddLabel} disabled={isProcessing}>
          <LabelIcon fontSize="small" sx={{ mr: 1 }} /> Add Label
        </MenuItem>
        <MenuItem onClick={handleRename} disabled={isProcessing}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} /> Rename
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDelete} disabled={isProcessing} sx={{ color: "error.main" }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      {/* Rename Dialog */}
      <Dialog open={isRenameDialogOpen} onClose={() => !isProcessing && setIsRenameDialogOpen(false)}>
        <DialogTitle>Rename Document</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Document Name"
            fullWidth
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            disabled={isProcessing}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsRenameDialogOpen(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={handleSubmitRename} variant="contained" disabled={isProcessing || !renameValue.trim()}>
            {isProcessing ? <CircularProgress size={24} /> : "Rename"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Label Dialog */}
      <Dialog open={isAddLabelDialogOpen} onClose={() => !isProcessing && setIsAddLabelDialogOpen(false)}>
        <DialogTitle>Add Label</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Label Name"
            fullWidth
            value={labelValue}
            onChange={(e) => setLabelValue(e.target.value)}
            disabled={isProcessing}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddLabelDialogOpen(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={handleSubmitLabel} variant="contained" disabled={isProcessing || !labelValue.trim()}>
            {isProcessing ? <CircularProgress size={24} /> : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

