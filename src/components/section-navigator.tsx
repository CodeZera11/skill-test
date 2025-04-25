"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Section {
  id: string
  name: string
  totalQuestions: number
  firstQuestionNumber: number
}

interface SectionNavigatorProps {
  sections: Section[]
  currentSection: string
  onSectionChange: (sectionId: string) => void
  onQuestionNavigate: (questionNumber: number) => void
}

export function SectionNavigator({
  sections,
  currentSection,
  onSectionChange,
  onQuestionNavigate,
}: SectionNavigatorProps) {
  const [activeTab, setActiveTab] = useState(currentSection)

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    onSectionChange(value)
  }

  const getCurrentSection = () => {
    return sections.find((section) => section.id === activeTab)
  }

  const currentSectionData = getCurrentSection()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Sections</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid" style={{ gridTemplateColumns: `repeat(${sections.length}, 1fr)` }}>
            {sections.map((section) => (
              <TabsTrigger key={section.id} value={section.id}>
                {section.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {sections.map((section) => (
            <TabsContent key={section.id} value={section.id} className="space-y-4">
              <div className="text-sm">
                <p>Total Questions: {section.totalQuestions}</p>
                <p>
                  Question Range: {section.firstQuestionNumber} -{" "}
                  {section.firstQuestionNumber + section.totalQuestions - 1}
                </p>
              </div>

              <div className="grid grid-cols-5 gap-2 max-h-[200px] overflow-y-auto p-1">
                {Array.from({ length: section.totalQuestions }, (_, i) => {
                  const questionNumber = section.firstQuestionNumber + i
                  return (
                    <Button
                      key={i}
                      variant="outline"
                      className="h-8 w-8 p-0 text-xs"
                      onClick={() => onQuestionNavigate(questionNumber)}
                    >
                      {questionNumber}
                    </Button>
                  )
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {currentSectionData && (
          <div className="flex justify-between mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onQuestionNavigate(currentSectionData.firstQuestionNumber)}
            >
              First in Section
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onQuestionNavigate(currentSectionData.firstQuestionNumber + currentSectionData.totalQuestions - 1)
              }
            >
              Last in Section
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
