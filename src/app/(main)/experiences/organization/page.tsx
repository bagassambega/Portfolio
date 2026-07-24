import type { Metadata } from "next"
import ExperiencesView from "@/components/pages/experiences/ExperiencesView"

export const metadata: Metadata = {
  title: "Organizational Experiences",
}

export default function OrganizationExperiencesPage() {
  return <ExperiencesView activeTab="organization" />
}
