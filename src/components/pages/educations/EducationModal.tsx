import RichTextRenderer from "@/components/shared/RichTextRenderer"
import SkeletonImage from "@/components/shared/SkeletonImage"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getOriginalImageUrl } from "@/lib/helpers"
import { EducationListItem } from "@/lib/services/api"
import { Media } from "@/lib/types/payload-types"

export default function EducationalModal({
  educations,
}: {
  educations: EducationListItem[]
}) {
  return educations.map((edu, index) => {
    const logoMedia = edu.logo as Media | undefined
    const logoUrl = logoMedia ? getOriginalImageUrl(logoMedia) : null

    return (
      <Dialog key={edu.id}>
        <DialogTrigger asChild>
          <div
            className="flex flex-col items-center justify-center p-12 bg-zinc-100 dark:bg-[#1a1a1a] border border-zinc-200 dark:border-zinc-800 rounded-[2rem] hover:bg-zinc-200 dark:hover:bg-[#222] hover:cursor-pointer transition-colors duration-300 opacity-0"
            style={{
              animation: `fadeUp 0.5s ease-out forwards`,
              animationDelay: `${index * 100}ms`,
            }}
          >
            {logoUrl ? (
              <div className="relative w-40 h-40 md:w-48 md:h-48 mb-8 drop-shadow-2xl flex items-center justify-center overflow-hidden">
                <SkeletonImage
                  src={logoUrl}
                  alt={logoMedia?.alt || edu.name}
                  width={400}
                  height={400}
                  unoptimized
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-40 h-40 md:w-48 md:h-48 mb-8 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            )}
            <h3 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white text-center mb-2">
              {edu.name}
            </h3>
          </div>
        </DialogTrigger>
        <DialogContent className="max-h-[calc(100vh-8rem)] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{edu.level}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col justify-center items-center font-inter gap-2 mt-4">
            {logoUrl ? (
              <div className="relative w-40 h-40 md:w-48 md:h-48 mb-8 drop-shadow-2xl flex items-center justify-center overflow-hidden">
                <SkeletonImage
                  src={logoUrl}
                  alt={logoMedia?.alt || edu.name}
                  width={400}
                  height={400}
                  unoptimized
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-40 h-40 md:w-48 md:h-48 mb-8 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            )}

            <h1 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white text-center mb-2">
              {edu.name}
            </h1>

            {edu.description && <RichTextRenderer content={edu.description} />}
          </div>
        </DialogContent>
      </Dialog>
    )
  })
}
