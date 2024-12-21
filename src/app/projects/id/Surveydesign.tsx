'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from 'src/components/ui/button'
import { Input } from 'src/components/ui/input'
import { Label } from 'src/components/ui/label'
import { Textarea } from 'src/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'src/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { X, Plus, Trash2, ChevronDown, ChevronUp, GripVertical } from 'lucide-react'

type QuestionType = {
  id: string;
  text: string;
  type: 'multiple_choice' | 'short_answer' | 'all_of_the_above';
  choices: string[];
  isExpanded: boolean;
}

interface TagSelectProps {
  options: Array<{ value: string; label: string }>;
  selected: string[];
  onSelect: (value: string) => void;
  onRemove: (value: string) => void;
}

const TagSelect: React.FC<TagSelectProps> = ({ options, selected, onSelect, onRemove }) => {
  return (
    <div className="relative">
      <Select
        onValueChange={(value: string) => onSelect(value)}
        value={selected.length > 0 ? selected[selected.length - 1] : undefined}
      >
        <SelectTrigger className="w-full">
          <div className="flex flex-wrap gap-1 overflow-hidden">
            {selected.map((item) => (
              <span
                key={`${item}-tag`}
                className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full flex items-center"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(item);
                }}
              >
                {item}
                <span className="ml-1 cursor-pointer">
                  <X size={12} />
                </span>
              </span>
            ))}
            {selected.length === 0 && <span className="text-muted-foreground">Select options</span>}
          </div>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default function SurveyDesignPage({ params }: { params: { id: string } }) {
  const [surveyTitle, setSurveyTitle] = useState('')
  const [topic, setTopic] = useState('')
  const [target, setTarget] = useState('')
  const [demographics, setDemographics] = useState<string[]>([])
  const [tone, setTone] = useState<string[]>([])
  const [questions, setQuestions] = useState<QuestionType[]>([])
  const [previewSurvey, setPreviewSurvey] = useState<string>('')

  const router = useRouter()

  const demographicOptions = [
    { value: 'age', label: 'Age' },
    { value: 'gender', label: 'Gender' },
    { value: 'sex', label: 'Sex' },
    { value: 'zipcode', label: 'Zip Code' },
  ]

  const toneOptions = [
    { value: 'professional', label: 'Professional' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'concise', label: 'Concise' },
  ]

  const handleAddQuestion = () => {
    setQuestions([...questions, { id: Date.now().toString(), text: '', type: 'short_answer', choices: [], isExpanded: true }])
  }

  const handleQuestionChange = (id: string, field: string, value: string | string[] | boolean) => {
    setQuestions(questions.map(q => {
      if (q.id === id) {
        return { ...q, [field]: value }
      }
      return q
    }))
  }

  const handleAddChoice = (questionId: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return { ...q, choices: [...q.choices, ''] }
      }
      return q
    }))
  }

  const handleChoiceChange = (questionId: string, index: number, value: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newChoices = [...q.choices]
        newChoices[index] = value
        return { ...q, choices: newChoices }
      }
      return q
    }))
  }

  const handleRemoveChoice = (questionId: string, index: number) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newChoices = q.choices.filter((_, i) => i !== index)
        return { ...q, choices: newChoices }
      }
      return q
    }))
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return
    const items = Array.from(questions)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    setQuestions(items)
  }

  const handleSaveAndGenerate = () => {
    const preview = `
      Survey Title: ${surveyTitle}
      Topic: ${topic}
      Target: ${target}
      Demographics: ${demographics.join(', ')}
      Tone: ${tone.join(', ')}
      
      Questions:
      ${questions.map((q, index) => `
        ${index + 1}. ${q.text}
        Type: ${q.type}
        ${q.choices.length > 0 ? `Choices:
  ${q.choices.map((choice, i) => `          ${i + 1}. ${choice}`).join('\n')}` : ''}
      `).join('\n')}
    `
    setPreviewSurvey(preview)
  }

  return (
    <div className="flex h-screen">
      <div className="w-2/3 p-4 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">Design Your Survey</h1>
        <div className="space-y-4">
          <div>
            <Label htmlFor="surveyTitle">Survey Title</Label>
            <Input
              id="surveyTitle"
              value={surveyTitle}
              onChange={(e) => setSurveyTitle(e.target.value)}
              placeholder="Enter survey title"
              className="text-sm"
            />
          </div>
          <div>
            <Label htmlFor="topic">What is the topic of your conversational study today?</Label>
            <Textarea
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter your topic"
              className="text-sm"
            />
          </div>
          <div>
            <Label htmlFor="target">Who are you targeting?</Label>
            <Input
              id="target"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="Enter your target audience"
              className="text-sm"
            />
          </div>
          <div>
            <Label htmlFor="demographics">Any demographic data that you need collected?</Label>
            <TagSelect
              options={demographicOptions}
              selected={demographics}
              onSelect={(value) => setDemographics(prev => prev.includes(value) ? prev : [...prev, value])}
              onRemove={(value) => setDemographics(demographics.filter(d => d !== value))}
            />
          </div>
          <div>
            <Label htmlFor="tone">What should the tone of voice be?</Label>
            <TagSelect
              options={toneOptions}
              selected={tone}
              onSelect={(value) => setTone(prev => prev.includes(value) ? prev : [...prev, value])}
              onRemove={(value) => setTone(tone.filter(t => t !== value))}
            />
          </div>
          <div>
            <Label>Specific questions you want included?</Label>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="questions">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                    {questions.map((question, index) => (
                      <Draggable key={question.id} draggableId={question.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="border rounded-lg overflow-hidden bg-white shadow-sm"
                          >
                            <div className="flex items-center p-3 bg-gray-50 cursor-move" {...provided.dragHandleProps}>
                              <GripVertical className="h-5 w-5 text-gray-500 mr-2" />
                              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-2">
                                {index + 1}
                              </div>
                              <div className="flex-grow">
                                <Input
                                  value={question.text}
                                  onChange={(e) => handleQuestionChange(question.id, 'text', e.target.value)}
                                  placeholder="Enter your question"
                                  className="text-sm border-none bg-transparent"
                                />
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleQuestionChange(question.id, 'isExpanded', !question.isExpanded)}
                                className="ml-2"
                              >
                                {question.isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="ml-2 text-red-500 hover:text-red-700"
                                onClick={() => setQuestions(questions.filter(q => q.id !== question.id))}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            {question.isExpanded && (
                              <div className="p-3">
                                <Select
                                  onValueChange={(value) => handleQuestionChange(question.id, 'type', value as QuestionType['type'])}
                                >
                                  <SelectTrigger className="text-sm mb-2">
                                    <SelectValue placeholder="Select question type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                                    <SelectItem value="short_answer">Short Answer</SelectItem>
                                    <SelectItem value="all_of_the_above">All of the Above</SelectItem>
                                  </SelectContent>
                                </Select>
                                {(question.type === 'multiple_choice' || question.type === 'all_of_the_above') && (
                                  <div className="space-y-2">
                                    {question.choices.map((choice, choiceIndex) => (
                                      <div key={choiceIndex} className="flex items-center space-x-2">
                                        <Input
                                          value={choice}
                                          onChange={(e) => handleChoiceChange(question.id, choiceIndex, e.target.value)}
                                          placeholder={`Choice ${choiceIndex + 1}`}
                                          className="text-sm"
                                        />
                                        <Button
                                          variant="outline"
                                          size="icon"
                                          onClick={() => handleRemoveChoice(question.id, choiceIndex)}
                                          className="h-8 w-8"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    ))}
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleAddChoice(question.id)}
                                      className="mt-2"
                                    >
                                      <Plus className="h-4 w-4 mr-2" />
                                      Add Choice
                                    </Button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            <Button onClick={handleAddQuestion} className="mt-4" variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </div>
        </div>
        <div className="mt-6 space-x-4">
          <Button onClick={handleSaveAndGenerate} variant="default">Save and Generate</Button>
          <Button variant="default" onClick={() => router.push('/home')}>Save and Exit</Button>
          <Button variant="default">Publish</Button>
        </div>
      </div>
      <div className="w-1/3 p-4 bg-gray-100 overflow-y-auto">
        <Card>
          <CardHeader>
            <CardTitle>Survey Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap">{previewSurvey}</pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

