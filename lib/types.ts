export interface Document {
    id: string
    name: string
    content: any // This would be the parsed CSV data
    daysAgo: number
    pages: number
    labels: string[]
    uploadDate: string
  }