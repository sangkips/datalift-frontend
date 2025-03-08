import type { Document, DocumentsResponse, DocumentResponse, ApiSuccess } from "@/lib/types"

const API_BASE_URL = "http://127.0.0.1:8000"

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `API error: ${response.status}`)
  }
  return response.json() as Promise<T>
}

// Fetch all documents
export async function fetchDocuments(): Promise<Document[]> {
  const response = await fetch(`${API_BASE_URL}/api/documents`)
  const data = await handleResponse<DocumentsResponse>(response)

  // Debug log the raw response
  console.log("Raw API response:", data)

  // Map the API response to our Document type
  if (Array.isArray(data)) {
    // If the response is an array directly
    return data.map((doc) => ({
      id: doc.id || doc._id || String(Math.random()),
      name: doc.filename || doc.name || "Unnamed Document", // Try filename first
      daysAgo: calculateDaysAgo(doc.uploaded_at), // Calculate days ago from uploaded_at
      pages: doc.pages || 0,
      labels: doc.labels || [],
      uploaded_at: doc.uploaded_at, // Keep the original timestamp
    }))
  } else if (data.documents && Array.isArray(data.documents)) {
    // If the response has a documents property
    return data.documents.map((doc) => ({
      id: doc.id || doc._id || String(Math.random()),
      name: doc.filename || doc.name || "Unnamed Document",
      daysAgo: calculateDaysAgo(doc.uploaded_at),
      pages: doc.pages || 0,
      labels: doc.labels || [],
      uploaded_at: doc.uploaded_at,
    }))
  }

  return []
}

// Helper function to calculate days ago from a timestamp
function calculateDaysAgo(timestamp: string | undefined): number {
  if (!timestamp) return 0
  const uploadDate = new Date(timestamp)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - uploadDate.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// Rest of the API functions remain the same...
export async function deleteDocument(id: string): Promise<ApiSuccess> {
  const response = await fetch(`${API_BASE_URL}/api/documents/${id}`, {
    method: "DELETE",
  })
  return handleResponse<ApiSuccess>(response)
}

export async function renameDocument(id: string, newName: string): Promise<ApiSuccess> {
  const response = await fetch(`${API_BASE_URL}/api/documents/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: newName }),
  })
  return handleResponse<ApiSuccess>(response)
}

export async function addLabelToDocument(id: string, label: string): Promise<ApiSuccess> {
  const response = await fetch(`${API_BASE_URL}/api/documents/${id}/labels`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ label }),
  })
  return handleResponse<ApiSuccess>(response)
}

export async function uploadCsvFile(file: File): Promise<DocumentResponse> {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch(`${API_BASE_URL}/api/upload-csv`, {
    method: "POST",
    body: formData,
  })
  return handleResponse<DocumentResponse>(response)
}

export async function uploadDocument(file: File): Promise<DocumentResponse> {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch(`${API_BASE_URL}/api/documents`, {
    method: "POST",
    body: formData,
  })
  return handleResponse<DocumentResponse>(response)
}

