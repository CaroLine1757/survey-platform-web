'use client'

import { useState } from 'react'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlusCircle, Send } from 'lucide-react'
import { Clock, UserCheck, UserX } from 'lucide-react'
import Link from 'next/link';

// Mock data for the chart
const initialData = [
  { question: 'Q1', positive: 40, neutral: 30, negative: 30 },
  { question: 'Q2', positive: 60, neutral: 25, negative: 15 },
  { question: 'Q3', positive: 45, neutral: 40, negative: 15 },
  { question: 'Q4', positive: 70, neutral: 20, negative: 10 },
  { question: 'Q5', positive: 55, neutral: 35, negative: 10 },
]

type Message = {
  role: 'user' | 'assistant'
  content: string
}

type Figure = {
  id: string
  type: 'bar' | 'pie' // Add more types as needed
  data: any
  title: string
}

export default function DashboardPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState(initialData)
  const [chatHistory, setChatHistory] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [figures, setFigures] = useState<Figure[]>([])
  const [completedSurveys, setCompletedSurveys] = useState(150)
  const [inProgressSurveys, setInProgressSurveys] = useState(30)
  const [averageCompletionTime, setAverageCompletionTime] = useState('4m 30s')

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return

    const newUserMessage: Message = { role: 'user', content: inputMessage }
    setChatHistory(prev => [...prev, newUserMessage])

    // Mock AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage)
      setChatHistory(prev => [...prev, { role: 'assistant', content: aiResponse.message }])
      if (aiResponse.figure) {
        setFigures(prev => [...prev, aiResponse.figure].filter((fig): fig is Figure => fig !== undefined))
      }
    }, 1000)

    setInputMessage('')
  }

  const generateAIResponse = (message: string): { message: string, figure?: Figure } => {
    // This is a mock function. In a real application, this would call an AI service.
    if (message.toLowerCase().includes('pie chart')) {
      const newFigure: Figure = {
        id: Date.now().toString(),
        type: 'pie',
        data: [
          { name: 'Category A', value: 400 },
          { name: 'Category B', value: 300 },
          { name: 'Category C', value: 300 },
          { name: 'Category D', value: 200 },
        ],
        title: 'Sample Pie Chart'
      }
      return {
        message: "I've created a pie chart based on your request. Would you like to add it to your dashboard?",
        figure: newFigure
      }
    }
    return { message: "I'm sorry, I couldn't generate a figure based on your request. Could you please provide more specific information?" }
  }

  const addFigureToDashboard = (figure: Figure) => {
    setData(prev => [...prev, { question: figure.title, positive: 50, neutral: 30, negative: 20 }])
  }

  return (
    <div className="flex h-screen">
      <div className="w-[70%] p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Survey Results Dashboard</h1>
          <Link href="/home">
            <Button variant="outline" className="px-6">
              Back to My Projects
            </Button>
          </Link>
        </div>

        <div className="flex space-x-4">
          <Link href={`/projects/${params.id}/sharing`}>
            <Button variant="outline" className="w-full">
              Survey sharing and permissions
            </Button>
          </Link>
          <Link href={`/projects/${params.id}/responses`}>
            <Button variant="outline" className="w-full">
              See your responses
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0">
              <CardTitle className="text-sm font-medium">Completed Surveys</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-0 pt-2">
              <div className="text-xl font-bold">{completedSurveys}</div>
            </CardContent>
          </Card>
          <Card className="p-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0">
              <CardTitle className="text-sm font-medium">In-Progress/Abandoned</CardTitle>
              <UserX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-0 pt-2">
              <div className="text-xl font-bold">{inProgressSurveys}</div>
            </CardContent>
          </Card>
          <Card className="p-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0">
              <CardTitle className="text-sm font-medium">Avg. Completion Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-0 pt-2">
              <div className="text-xl font-bold">{averageCompletionTime}</div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Response Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="question" />
              <YAxis />
              <Bar dataKey="positive" fill="#4CAF50" stackId="stack" />
              <Bar dataKey="neutral" fill="#FFC107" stackId="stack" />
              <Bar dataKey="negative" fill="#F44336" stackId="stack" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Key Insights</h2>
          <ul className="list-disc pl-5">
            <li>80% of respondents reported high satisfaction with the product</li>
            <li>The most common suggestion for improvement was related to user interface</li>
            <li>95% of users would recommend the product to others</li>
          </ul>
        </div>
      </div>
      <div className="w-[30%] p-4 bg-gray-100">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Chat Assistant</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col">
            <ScrollArea className="flex-grow mb-4">
              {chatHistory.map((message, index) => (
                <div key={index} className={`mb-2 ${message.role === 'assistant' ? 'text-blue-600' : 'text-gray-800'}`}>
                  <strong>{message.role === 'assistant' ? 'AI: ' : 'You: '}</strong>
                  {message.content}
                </div>
              ))}
            </ScrollArea>
            <div className="flex items-center">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about your survey..."
                className="flex-grow mr-2"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button onClick={handleSendMessage} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
        {figures.length > 0 && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Suggested Figures</CardTitle>
            </CardHeader>
            <CardContent>
              {figures.map((figure) => (
                <div key={figure.id} className="flex items-center justify-between mb-2">
                  <span>{figure.title}</span>
                  <Button onClick={() => addFigureToDashboard(figure)} size="sm">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add to Dashboard
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

