// Define Document type with optional fields to handle API variations
export interface Document {
  id?: string
  _id?: string
  name: string
  filename?: string // Add filename field
  uploaded_at?: string // Add uploaded_at field
  daysAgo: number
  pages: number
  labels?: string[]
  [key: string]: any // Allow for additional properties from the API
}

// API response types
export interface DocumentsResponse {
  documents?: Document[]
  [key: string]: any // Allow for different response structures
}

export interface DocumentResponse {
  document?: Document
  [key: string]: any // Allow for different response structures
}

export interface ApiError {
  error: string
}

export interface ApiSuccess {
  success: boolean
}

