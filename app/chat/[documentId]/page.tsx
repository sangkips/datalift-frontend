"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Box, Paper, TextField, IconButton, Typography, CircularProgress, Card, CardContent } from "@mui/material"
import { Send as SendIcon } from "@mui/icons-material"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Scatter,
  ScatterChart,
} from "recharts"

interface Message {
  role: "user" | "assistant"
  content: string
  visualization?: {
    type: "bar" | "line" | "scatter"
    data: any[]
    config: any
  }
}

interface ChatPageProps {
  params: {
    documentId: string
  }
}

export default function ChatPage({ params }: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [documentInfo, setDocumentInfo] = useState<any>(null)
  const messagesEndRef = useRef<null | HTMLDivElement>(null)

  // Fetch document info on mount
  useEffect(() => {
    fetchDocumentInfo()
  }, [])

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchDocumentInfo = async () => {
    try {
      const response = await fetch(`/api/documents/${params.documentId}`)
      const data = await response.json()
      setDocumentInfo(data)
    } catch (error) {
      console.error("Error fetching document info:", error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setIsLoading(true)

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])

    try {
      const response = await fetch(`/api/chat/${params.documentId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      })

      if (!response.ok) throw new Error("Failed to send message")

      const data = await response.json()

      // Add assistant's response to chat
      setMessages((prev) => [...prev, { role: "assistant", content: data.text, visualization: data.visualization }])
    } catch (error) {
      console.error("Error sending message:", error)
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error processing your request." },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const renderVisualization = (visualization: Message["visualization"]) => {
    if (!visualization) return null

    const ChartComponent = {
      bar: BarChart,
      line: LineChart,
      scatter: ScatterChart,
    }[visualization.type]

    if (!ChartComponent) return null

    return (
      <Box sx={{ width: "100%", height: 300, mt: 2 }}>
        <ResponsiveContainer>
          <ChartComponent data={visualization.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={visualization.config.xAxis} />
            <YAxis />
            <Tooltip />
            <Legend />
            {visualization.type === "bar" && <Bar dataKey={visualization.config.yAxis} fill="#4ADE80" />}
            {visualization.type === "line" && (
              <Line type="monotone" dataKey={visualization.config.yAxis} stroke="#4ADE80" />
            )}
            {visualization.type === "scatter" && (
              <Scatter name={visualization.config.name} data={visualization.data} fill="#4ADE80" />
            )}
          </ChartComponent>
        </ResponsiveContainer>
      </Box>
    )
  }

  return (
    <Box sx={{ height: "calc(100vh - 64px)", display: "flex", flexDirection: "column", p: 2 }}>
      {/* Document Info */}
      {documentInfo && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6">{documentInfo.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            Analyzing data from this document. Ask questions about the data or request visualizations.
          </Typography>
        </Paper>
      )}

      {/* Messages Container */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          mb: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {messages.map((message, index) => (
          <Card
            key={index}
            sx={{
              alignSelf: message.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "80%",
              bgcolor: message.role === "user" ? "primary.main" : "background.paper",
            }}
          >
            <CardContent>
              <Typography
                sx={{
                  color: message.role === "user" ? "primary.contrastText" : "text.primary",
                }}
              >
                {message.content}
              </Typography>
              {message.visualization && renderVisualization(message.visualization)}
            </CardContent>
          </Card>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Form */}
      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <TextField
          fullWidth
          placeholder="Ask about the data or request visualizations..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          multiline
          maxRows={4}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
        />
        <IconButton
          type="submit"
          disabled={!input.trim() || isLoading}
          color="primary"
          sx={{
            bgcolor: "primary.main",
            color: "white",
            "&:hover": { bgcolor: "primary.dark" },
            "&.Mui-disabled": { bgcolor: "action.disabledBackground" },
          }}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
        </IconButton>
      </Paper>
    </Box>
  )
}

