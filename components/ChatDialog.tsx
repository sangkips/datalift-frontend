'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  Dialog, 
  DialogTitle, 
  DialogContent,
  IconButton,
  TextField,
  Button,
  CircularProgress
} from '@mui/material'
import { Close, Send } from '@mui/icons-material'
import { Document } from '@/lib/types'

interface Message {
  id: string
  sender: 'user' | 'ai'
  text: string
  timestamp: Date
}

interface ChatDialogProps {
  open: boolean
  onClose: () => void
  document: Document | null
}

export default function ChatDialog({ 
  open, 
  onClose,
  document
}: ChatDialogProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Add initial welcome message when chat opens
  useEffect(() => {
    if (open && document) {
      setMessages([
        {
          id: 'welcome',
          sender: 'ai',
          text: `Hello! I'm your AI assistant. I've analyzed "${document.name}" and I'm ready to help you with any questions about this document.`,
          timestamp: new Date()
        }
      ])
    }
  }, [open, document])
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  const handleSendMessage = async () => {
    if (!inputValue.trim() || !document) return
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: inputValue,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)
    
    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: generateAIResponse(inputValue, document),
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
    }, 1500)
  }
  
  const generateAIResponse = (query: string, doc: Document): string => {
    // This is a simple simulation - in a real app, you'd call an AI API
    const responses = [
      `Based on the data in "${doc.name}", I can see that ${query} relates to columns ${Math.floor(Math.random() * 5) + 1} and ${Math.floor(Math.random() * 5) + 6}.`,
      `Looking at "${doc.name}", I found ${Math.floor(Math.random() * 10) + 1} entries that match your query about ${query}.`,
      `The document "${doc.name}" contains information that suggests ${query} has a positive correlation with the data in rows ${Math.floor(Math.random() * 20) + 10}-${Math.floor(Math.random() * 20) + 30}.`,
      `I've analyzed "${doc.name}" and can tell you that ${query} appears ${Math.floor(Math.random() * 15) + 2} times throughout the document.`
    ]
    
    return responses[Math.floor(Math.random() * responses.length)]
  }
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="flex justify-between items-center">
        <div>
          Chat with {document?.name}
        </div>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent className="flex flex-col h-[500px]">
        <div className="flex-1 overflow-y-auto mb-4">
          {messages.map(message => (
            <div 
              key={message.id} 
              className={`mb-4 ${message.sender === 'user' ? 'text-right' : ''}`}
            >
              <div 
                className={`inline-block max-w-[80%] p-3 rounded-lg ${
                  message.sender === 'user' 
                    ? 'bg-blue-100 text-left' 
                    : 'bg-gray-100'
                }`}
              >
                <p>{message.text}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="mb-4">
              <div className="inline-block bg-gray-100 p-3 rounded-lg">
                <CircularProgress size={20} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex gap-2">
          <TextField
            fullWidth
            placeholder="Ask a question about this document..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            multiline
            maxRows={3}
          />
          <Button 
            variant="contained" 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="add-button"
          >
            <Send />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}