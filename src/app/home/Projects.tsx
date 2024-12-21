'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { PlusCircle, BarChart2, Users, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// Mock data for projects
const initialProjects = [
  { id: 1, name: 'Customer Satisfaction Survey', responses: 150, status: 'Active', lastUpdated: '2023-06-15', published: true },
  { id: 2, name: 'Employee Engagement Survey', responses: 75, status: 'Draft', lastUpdated: '2023-06-10', published: false },
  { id: 3, name: 'Product Feedback Survey', responses: 200, status: 'Completed', lastUpdated: '2023-06-05', published: true },
  { id: 4, name: 'Market Research Survey', responses: 50, status: 'Active', lastUpdated: '2023-06-01', published: true },
]

export default function HomePage() {
  const [projects, setProjects] = useState(initialProjects)
  const [newProjectName, setNewProjectName] = useState('')
  // const dialogRef = useRef<HTMLDialogElement>(null) // Removed as per update 3

  const handleCreateProject = () => {
    if (newProjectName.trim() !== '') {
      const newProject = {
        id: projects.length + 1,
        name: newProjectName,
        responses: 0,
        status: 'Draft',
        lastUpdated: new Date().toISOString().split('T')[0],
        published: false,
      }
      setProjects([...projects, newProject])
      setNewProjectName('')
      // dialogRef.current?.close() // Removed as per update 3
    }
  }

  const handlePublishToggle = (id: number) => {
    setProjects(projects.map(project =>
      project.id === id ? { 
        ...project, 
        published: !project.published,
        status: project.published ? 'Draft' : 'Active'
      } : project
    ))
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Projects</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new project</DialogTitle>
              <DialogDescription>
                Give your new survey project a name to get started.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateProject}>Create Project</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <CardTitle className="text-lg">{project.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <Users className="mr-2 h-4 w-4" />
                <span>{project.responses} Responses</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <Clock className="mr-2 h-4 w-4" />
                <span>Last updated: {project.lastUpdated}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  project.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {project.published ? 'Active' : 'Draft'}
                </span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <div className="flex space-x-2">
                <Link href={`/projects/${project.id}`}>
                  <Button variant="outline" size="sm">Edit</Button>
                </Link>
                <Link href={`/projects/${project.id}/dashboard`}>
                  <Button variant="outline" size="sm">
                    <BarChart2 className="mr-2 h-4 w-4" />
                    Go to Dashboard
                  </Button>
                </Link>
                <Button
                  variant={project.published ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePublishToggle(project.id)}
                >
                  {project.published ? 'Unpublish' : 'Publish'}
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

