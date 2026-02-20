"use client"

import { useEffect } from "react"


export default function ProjectsPage() {
  useEffect(() => {
    const fetchData = async() => {
      const req = await fetch('/api/projects')
      console.log(req)
    }

    fetchData()
  }
  )
  return (
    <main className="flex flex-col items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-2">

        </div>
      </div>
    </main>
  )
}
