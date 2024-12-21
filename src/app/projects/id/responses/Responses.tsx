'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, Download, Filter, LayoutList, LayoutGrid } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Response = {
  id: string
  respondent: string
  completedAt: string
  timeSpent: string
  status: 'completed' | 'partial'
  answers: {
    questionId: string
    question: string
    answer: string
  }[]
}

type Question = {
  id: string
  text: string
  responses: {
    respondent: string
    answer: string
    completedAt: string
  }[]
}

export default function ResponsesPage({ params }: { params: { id: string } }) {
  const [responses] = useState<Response[]>([
    {
      id: '1',
      respondent: 'Anonymous #1',
      completedAt: '2024-01-10 14:30',
      timeSpent: '5m 20s',
      status: 'completed',
      answers: [
        { questionId: 'q1', question: 'How satisfied are you?', answer: 'Very satisfied' },
        { questionId: 'q2', question: 'Would you recommend us?', answer: 'Yes' }
      ]
    },
    {
      id: '2',
      respondent: 'Anonymous #2',
      completedAt: '2024-01-10 15:45',
      timeSpent: '4m 15s',
      status: 'completed',
      answers: [
        { questionId: 'q1', question: 'How satisfied are you?', answer: 'Satisfied' },
        { questionId: 'q2', question: 'Would you recommend us?', answer: 'Maybe' }
      ]
    },
    {
      id: '3',
      respondent: 'Anonymous #3',
      completedAt: '2024-01-10 16:20',
      timeSpent: '2m 45s',
      status: 'partial',
      answers: [
        { questionId: 'q1', question: 'How satisfied are you?', answer: 'Neutral' }
      ]
    },
  ])

  // Transform responses into questions view
  const questions: Question[] = responses.reduce((acc: Question[], response) => {
    response.answers.forEach(answer => {
      const existingQuestion = acc.find(q => q.id === answer.questionId)
      if (existingQuestion) {
        existingQuestion.responses.push({
          respondent: response.respondent,
          answer: answer.answer,
          completedAt: response.completedAt
        })
      } else {
        acc.push({
          id: answer.questionId,
          text: answer.question,
          responses: [{
            respondent: response.respondent,
            answer: answer.answer,
            completedAt: response.completedAt
          }]
        })
      }
    })
    return acc
  }, [])

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <Link href={`/projects/${params.id}/dashboard`}>
          <Button variant="outline" className="mb-4">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Survey Responses</h1>
          <div className="space-x-2">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>All Responses</CardTitle>
            <Tabs defaultValue="by-respondent">
              <TabsList>
                <TabsTrigger value="by-respondent">
                  <LayoutList className="mr-2 h-4 w-4" />
                  By Respondent
                </TabsTrigger>
                <TabsTrigger value="by-question">
                  <LayoutGrid className="mr-2 h-4 w-4" />
                  By Question
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="by-respondent" className="w-full">
            <TabsContent value="by-respondent">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Respondent</TableHead>
                    <TableHead>Completed At</TableHead>
                    <TableHead>Time Spent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {responses.map((response) => (
                    <TableRow key={response.id}>
                      <TableCell>{response.respondent}</TableCell>
                      <TableCell>{response.completedAt}</TableCell>
                      <TableCell>{response.timeSpent}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          response.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {response.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">View Details</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="by-question">
              <div className="space-y-6">
                {questions.map((question) => (
                  <Card key={question.id} className="shadow-md">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">{question.text}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Respondent</TableHead>
                            <TableHead>Answer</TableHead>
                            <TableHead>Submitted At</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {question.responses.map((response, idx) => (
                            <TableRow key={idx}>
                              <TableCell>{response.respondent}</TableCell>
                              <TableCell>{response.answer}</TableCell>
                              <TableCell>{response.completedAt}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

