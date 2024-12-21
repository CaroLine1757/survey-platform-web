import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, Copy, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export default function SharingPage({ params }: { params: { id: string } }) {
  const [isSurveyPublic, setIsSurveyPublic] = useState(true)
  const [allowAnonymous, setAllowAnonymous] = useState(false)
  
  const surveyLink = `https://conversify.app/survey/${params.id}`
  const embedCode = `<iframe src="${surveyLink}/embed" width="100%" height="600" frameborder="0"></iframe>`

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  const handleSocialShare = (platform: string) => {
    // Implement social sharing logic
    console.log(`Sharing to ${platform}`)
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Project Name 1</h1>
        <Link href="/home">
          <Button variant="outline">
            Back to My Projects
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Share via Link</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Copy and share this unique link:
            </p>
            <div className="flex space-x-2">
              <Input 
                value={surveyLink}
                readOnly
                className="font-mono text-sm"
              />
              <Button onClick={() => handleCopy(surveyLink)}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Share on Social Media</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleSocialShare('facebook')}
              >
                <Facebook className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleSocialShare('twitter')}
              >
                <Twitter className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleSocialShare('linkedin')}
              >
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleSocialShare('instagram')}
              >
                <Instagram className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Embed Code</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Copy and embed the code below:
            </p>
            <div className="flex space-x-2">
              <Input 
                value={embedCode}
                readOnly
                className="font-mono text-sm"
              />
              <Button onClick={() => handleCopy(embedCode)}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Privacy Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Make Survey Public</Label>
                <p className="text-sm text-muted-foreground">
                  Allow anyone with the link to view and respond
                </p>
              </div>
              <Switch
                checked={isSurveyPublic}
                onCheckedChange={setIsSurveyPublic}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Allow Anonymous Responses</Label>
                <p className="text-sm text-muted-foreground">
                  Let users respond without identifying themselves
                </p>
              </div>
              <Switch
                checked={allowAnonymous}
                onCheckedChange={setAllowAnonymous}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

