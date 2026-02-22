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

export enum PROJECT_TYPE {
    ACADEMIC = "Academic Project",
    PERSONAL = "Personal Project",
    ORGANIZATION = "Organization Project",
}

export const CACHE_TAGS = {
    PROJECTS: "projects",
    TECHSTACKS: "techstacks",
    MEDIA: "media",
    WORK_EXPERIENCES: "work-experiences",
    HERO: "hero",
    CORPORATIONS: "corporations",
    EDUCATION: "education",
    PUBLICATIONS: "publications",
    SOCIAL_MEDIA: "social-media",
} as const
