export interface PersonalInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  title: string
  photo: string
}

export interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  current: boolean
  description: string
  tasks: string[]
}

export interface Education {
  id: string
  school: string
  degree: string
  field: string
  startDate: string
  endDate: string
}

export interface SkillCategory {
  id: string
  category: string
  items: string[]
}

export interface Language {
  id: string
  language: string
  level: 'Débutant' | 'Intermédiaire' | 'Courant' | 'Natif'
}

export interface CVColors {
  primary: string
  secondary: string
  accent: string
}

export interface CV {
  id: string
  userId: string | null
  templateId: string
  title: string
  personalInfo: PersonalInfo
  profile: string
  experience: Experience[]
  education: Education[]
  skills: SkillCategory[]
  languages: Language[]
  interests: string[]
  colors: CVColors
  createdAt: string
  updatedAt: string
}

export interface Template {
  id: string
  name: string
  description: string
  preview: string
  category: string
  layout: string
  fonts: { heading: string; body: string }
  defaultColors: CVColors
}
