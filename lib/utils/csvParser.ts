/**
 * Simple CSV parser
 * In a real application, you might want to use a library like Papa Parse
 */
export function parseCSV(csvText: string): any[] {
    const lines = csvText.split('\n')
    const result = []
    
    // Extract headers
    const headers = lines[0].split(',').map(header => header.trim())
    
    // Process data rows
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue
      
      const values = line.split(',')
      const row: Record<string, string> = {}
      
      for (let j = 0; j < headers.length; j++) {
        row[headers[j]] = values[j]?.trim() || ''
      }
      
      result.push(row)
    }
    
    return result
  }