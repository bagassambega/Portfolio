export enum WORK_STATUS {
    ONGOING = "Ongoing",
    FINISHED = "Finished",
}

export enum WORK_LOCATION {
    WFA = "Hybrid",
    WFH = "Online",
    WFO = "Offline",
}

export enum WORK_TYPE {
    INTERNSHIP = "Internship",
    PARTTIME = "Part-TIme",
    FULLTIME = "Full-Time",
}

export const CACHE_TAGS = {
    PROJECTS: "projects",
    PROJECT_TYPES: "project-types",
    TECHSTACKS: "techstacks",
    MEDIA: "media",
    WORK_EXPERIENCES: "work-experiences",
    ORGANIZATION_EXPERIENCES: "organization-experiences",
    HERO: "hero",
    CORPORATIONS: "corporations",
    EDUCATION: "education",
    PUBLICATIONS: "publications",
    SOCIAL_MEDIA: "social-media",
} as const
