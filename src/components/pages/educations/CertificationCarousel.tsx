"use client"

import {
  Award,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import { cn } from "@/lib/utils"

const AUTO_ADVANCE_MS = 6500

const certifications = [
  {
    title: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    issuedAt: "May 2026",
    status: "Active",
    summary:
      "Foundational validation of cloud concepts, AWS services, security, architecture, pricing, and support.",
    skills: ["Cloud", "AWS", "Security", "Architecture"],
    accent: "from-orange-400 to-amber-500",
  },
  {
    title: "Meta Front-End Developer",
    issuer: "Meta",
    issuedAt: "Feb 2026",
    status: "Credential",
    summary:
      "Hands-on front-end certification covering React, component architecture, accessibility, and production UI workflows.",
    skills: ["React", "Accessibility", "UI Engineering", "JavaScript"],
    accent: "from-blue-500 to-cyan-400",
  },
  {
    title: "Google Data Analytics Certificate",
    issuer: "Google Career Certificates",
    issuedAt: "Nov 2025",
    status: "Completed",
    summary:
      "Practical data analysis credential focused on analytical thinking, SQL, visualization, and communicating insights.",
    skills: ["SQL", "Analytics", "Visualization", "Reporting"],
    accent: "from-emerald-400 to-teal-500",
  },
]

export default function CertificationCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  const activeCertification = certifications[activeIndex]

  useEffect(() => {
    const startedAt = performance.now()

    const interval = window.setInterval(() => {
      const elapsed = performance.now() - startedAt
      const nextProgress = Math.min(100, (elapsed / AUTO_ADVANCE_MS) * 100)

      setProgress(nextProgress)

      if (nextProgress >= 100) {
        setProgress(0)
        setActiveIndex((current) => (current + 1) % certifications.length)
      }
    }, 80)

    return () => window.clearInterval(interval)
  }, [activeIndex])

  const goTo = (index: number) => {
    setProgress(0)
    setActiveIndex((index + certifications.length) % certifications.length)
  }

  const progressLabels = useMemo(
    () =>
      certifications.map((certification, index) => ({
        id: certification.title,
        value:
          index < activeIndex ? 100 : index === activeIndex ? progress : 0,
      })),
    [activeIndex, progress]
  )

  return (
    <section className="w-full">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-4xl">
            Certifications
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous certification"
            onClick={() => goTo(activeIndex - 1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 shadow-sm transition-colors hover:cursor-pointer hover:border-blue-300 hover:text-blue-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-blue-500/50 dark:hover:text-blue-300"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next certification"
            onClick={() => goTo(activeIndex + 1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 shadow-sm transition-colors hover:cursor-pointer hover:border-blue-300 hover:text-blue-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-blue-500/50 dark:hover:text-blue-300"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <article className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div
            className={cn("h-2 bg-gradient-to-r", activeCertification.accent)}
          />
          <div className="grid gap-6 p-5 md:grid-cols-[auto_1fr] md:p-7">
            <div
              className={cn(
                "flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg md:h-24 md:w-24",
                activeCertification.accent
              )}
            >
              <Award className="h-10 w-10" />
            </div>

            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                  {activeCertification.issuer}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {activeCertification.issuedAt}
                </span>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                  {activeCertification.status}
                </span>
              </div>

              <h3 className="text-2xl font-semibold leading-tight text-zinc-950 dark:text-zinc-50 md:text-3xl">
                {activeCertification.title}
              </h3>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 md:text-base">
                {activeCertification.summary}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {activeCertification.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-zinc-200 px-3 py-1 text-xs text-zinc-600 dark:border-zinc-700 dark:text-zinc-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <button
                type="button"
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:cursor-pointer hover:border-blue-300 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-blue-500/50 dark:hover:text-blue-300"
              >
                View credential
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </div>
        </article>

        <div className="grid gap-3 md:grid-cols-3">
          {progressLabels.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => goTo(index)}
              className="block min-w-0 rounded-xl border border-zinc-200 bg-white/70 p-3 text-left transition-colors hover:cursor-pointer hover:border-blue-300 dark:border-zinc-800 dark:bg-zinc-900/55 dark:hover:border-blue-500/50"
              aria-label={`Show ${item.id}`}
            >
              <div className="mb-2 flex items-center justify-between gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                <span className="truncate">{item.id}</span>
                <span>{index + 1}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                <div
                  className={cn(
                    "h-full rounded-full bg-gradient-to-r transition-[width] duration-100",
                    certifications[index].accent
                  )}
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
