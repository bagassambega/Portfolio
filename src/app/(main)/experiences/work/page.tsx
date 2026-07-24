import type { Metadata } from "next"
import ExperiencesView from "@/components/pages/experiences/ExperiencesView"

export const metadata: Metadata = {
  title: "Work Experiences",
}

export default function WorkExperiencesPage() {
  return <ExperiencesView activeTab="work" />
}
