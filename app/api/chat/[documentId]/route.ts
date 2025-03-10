import { NextResponse } from "next/server"
import * as Papa from "papaparse"
import { promises as fs } from "fs"
import path from "path"

// This would be replaced with your actual data storage solution
const UPLOADS_DIR = path.join(process.cwd(), "uploads")

export async function POST(request: Request, { params }: { params: { documentId: string } }) {
  try {
    const { message } = await request.json()
    const documentId = params.documentId

    // 1. Get the document data
    const csvData = await getDocumentData(documentId)

    // 2. Process the message and generate response
    const response = await processMessage(message, csvData)

    return NextResponse.json(response)
  } catch (error) {
    console.error("Chat error:", error)
    return NextResponse.json({ error: "Failed to process chat message" }, { status: 500 })
  }
}

async function getDocumentData(documentId: string) {
  // In a real application, you would:
  // 1. Fetch the document location from your database
  // 2. Read the file from your storage solution (S3, etc.)
  // For this example, we'll read from the local filesystem

  try {
    const filePath = path.join(UPLOADS_DIR, `${documentId}.csv`)
    const fileContent = await fs.readFile(filePath, "utf-8")
    return Papa.parse(fileContent, { header: true }).data
  } catch (error) {
    console.error("Error reading CSV:", error)
    throw new Error("Failed to read document data")
  }
}

async function processMessage(message: string, data: any[]) {
  // This is where you would integrate with your AI model
  // For this example, we'll provide some basic responses

  const lowercaseMessage = message.toLowerCase()

  // Check for visualization requests
  if (lowercaseMessage.includes("chart") || lowercaseMessage.includes("graph")) {
    if (lowercaseMessage.includes("bar")) {
      return createBarChartResponse(data, message)
    }
    if (lowercaseMessage.includes("line")) {
      return createLineChartResponse(data, message)
    }
    if (lowercaseMessage.includes("scatter")) {
      return createScatterPlotResponse(data, message)
    }
  }

  // Check for analysis requests
  if (lowercaseMessage.includes("average") || lowercaseMessage.includes("mean")) {
    return createAverageResponse(data, message)
  }
  if (lowercaseMessage.includes("count")) {
    return createCountResponse(data, message)
  }

  // Default response
  return {
    text: "I can help you analyze this data. You can ask for charts, averages, counts, or other analysis.",
  }
}

function createBarChartResponse(data: any[], message: string) {
  // This is a simplified example - in a real application,
  // you would use NLP to determine which fields to visualize
  const columns = Object.keys(data[0])
  const numericColumn = columns.find((col) => !isNaN(Number(data[0][col])))
  const categoryColumn = columns.find((col) => isNaN(Number(data[0][col])))

  if (!numericColumn || !categoryColumn) {
    return {
      text: "I couldn't create a bar chart. Please specify which columns to use.",
    }
  }

  // Aggregate data for the chart
  const chartData = data.reduce((acc: any[], row) => {
    const category = row[categoryColumn]
    const existing = acc.find((item) => item.category === category)
    if (existing) {
      existing.value += Number(row[numericColumn])
    } else {
      acc.push({ category, value: Number(row[numericColumn]) })
    }
    return acc
  }, [])

  return {
    text: `Here's a bar chart showing ${numericColumn} by ${categoryColumn}`,
    visualization: {
      type: "bar",
      data: chartData,
      config: {
        xAxis: "category",
        yAxis: "value",
      },
    },
  }
}

function createLineChartResponse(data: any[], message: string) {
  // Similar to bar chart, but for time series data
  const columns = Object.keys(data[0])
  const dateColumn = columns.find((col) => data[0][col].includes("-")) // Simple date detection
  const numericColumn = columns.find((col) => !isNaN(Number(data[0][col])))

  if (!dateColumn || !numericColumn) {
    return {
      text: "I couldn't create a line chart. Please specify which columns to use.",
    }
  }

  const chartData = data.map((row) => ({
    date: row[dateColumn],
    value: Number(row[numericColumn]),
  }))

  return {
    text: `Here's a line chart showing ${numericColumn} over time`,
    visualization: {
      type: "line",
      data: chartData,
      config: {
        xAxis: "date",
        yAxis: "value",
      },
    },
  }
}

function createScatterPlotResponse(data: any[], message: string) {
  const columns = Object.keys(data[0])
  const numericColumns = columns.filter((col) => !isNaN(Number(data[0][col])))

  if (numericColumns.length < 2) {
    return {
      text: "I couldn't create a scatter plot. I need two numeric columns.",
    }
  }

  const chartData = data.map((row) => ({
    x: Number(row[numericColumns[0]]),
    y: Number(row[numericColumns[1]]),
  }))

  return {
    text: `Here's a scatter plot comparing ${numericColumns[0]} and ${numericColumns[1]}`,
    visualization: {
      type: "scatter",
      data: chartData,
      config: {
        xAxis: "x",
        yAxis: "y",
        name: "Data Points",
      },
    },
  }
}

function createAverageResponse(data: any[], message: string) {
  const columns = Object.keys(data[0])
  const numericColumn = columns.find((col) => !isNaN(Number(data[0][col])))

  if (!numericColumn) {
    return {
      text: "I couldn't find any numeric columns to calculate an average.",
    }
  }

  const average = data.reduce((sum, row) => sum + Number(row[numericColumn]), 0) / data.length

  return {
    text: `The average ${numericColumn} is ${average.toFixed(2)}`,
  }
}

function createCountResponse(data: any[], message: string) {
  const columns = Object.keys(data[0])
  const categoryColumn = columns.find((col) => isNaN(Number(data[0][col])))

  if (!categoryColumn) {
    return {
      text: `The total number of records is ${data.length}`,
    }
  }

  const counts = data.reduce((acc: any, row) => {
    const category = row[categoryColumn]
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {})

  const countsText = Object.entries(counts)
    .map(([category, count]) => `${category}: ${count}`)
    .join("\n")

  return {
    text: `Here are the counts by ${categoryColumn}:\n${countsText}`,
  }
}

