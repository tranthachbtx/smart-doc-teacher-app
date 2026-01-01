// IndexedDB storage for .docx templates
const DB_NAME = "SmartDocTeacherDB"
const DB_VERSION = 7 // Increment version to add projects storage
const STORE_NAME = "templates"
const PPCT_STORE_NAME = "ppct"
const PROJECT_STORE_NAME = "projects" // New store for History/Projects

export type TemplateType = "meeting" | "event" | "lesson" | "assessment" | "ncbh" | "default_meeting" | "default_event" | "default_lesson" | "default_assessment" | "default_ncbh"

export interface StoredTemplate {
  type: TemplateType
  fileName: string
  data: ArrayBuffer
  uploadedAt: Date
}

export interface TemplateInfo {
  name: string
  data: ArrayBuffer
}

export interface PPCTItem {
  month: string
  theme: string
  periods: number
  notes?: string
  activities?: string[]
  tasks?: {
    name: string
    description: string
  }[]
}

export interface StoredPPCT {
  grade: string
  items: PPCTItem[]
  uploadedAt: Date
}

export interface ProjectHistory {
  id: string
  type: "meeting" | "lesson" | "event" | "assessment" | "ncbh"
  title: string
  data: any
  grade?: string
  month?: string
  createdAt: Date
}

import { loadDefaultTemplate } from "./default-templates"

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "type" })
      }

      if (!db.objectStoreNames.contains(PPCT_STORE_NAME)) {
        db.createObjectStore(PPCT_STORE_NAME, { keyPath: "grade" })
      }

      if (!db.objectStoreNames.contains(PROJECT_STORE_NAME)) {
        db.createObjectStore(PROJECT_STORE_NAME, { keyPath: "id" })
      }
    }
  })
}

export async function saveTemplate(type: TemplateType, fileName: string, data: ArrayBuffer): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite")
    const store = transaction.objectStore(STORE_NAME)

    const template: StoredTemplate = {
      type,
      fileName,
      data,
      uploadedAt: new Date(),
    }

    const request = store.put(template)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

export async function getTemplate(type: TemplateType): Promise<TemplateInfo | null> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly")
    const store = transaction.objectStore(STORE_NAME)

    const request = store.get(type)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const result = request.result as StoredTemplate | undefined
      if (result) {
        resolve({ name: result.fileName, data: result.data })
      } else {
        resolve(null)
      }
    }
  })
}

import { createMeetingTemplate, createLessonTemplate, createNCBHTemplate } from "./docx-templates"

export async function getEffectiveTemplate(type: "meeting" | "event" | "lesson" | "assessment" | "ncbh"): Promise<TemplateInfo | null> {
  // First try to get session template
  const sessionTemplate = await getTemplate(type)
  if (sessionTemplate) {
    return sessionTemplate
  }

  // Then try to get user-uploaded default template
  const defaultType = `default_${type}` as TemplateType
  const defaultTemplate = await getTemplate(defaultType)
  if (defaultTemplate) {
    return defaultTemplate
  }

  // Then try to load from public/templates (via default-templates.ts)
  if (type !== 'ncbh') {
    const builtInTemplate = await loadDefaultTemplate(type as any)
    if (builtInTemplate) return builtInTemplate
  }

  // Finally, fallback to generating one programmatically
  let generatedBlob: Blob | null = null;

  if (type === 'meeting') {
    generatedBlob = await createMeetingTemplate();
  } else if (type === 'lesson') {
    generatedBlob = await createLessonTemplate();
  } else if (type === 'ncbh') {
    generatedBlob = await createNCBHTemplate();
  }
  // Assessment is intentionally excluded - export service creates file directly

  if (generatedBlob) {
    const arrayBuffer = await generatedBlob.arrayBuffer();
    return {
      name: `Mẫu tạo tự động - ${type}.docx`,
      data: arrayBuffer
    }
  }

  return null
}

export async function deleteTemplate(type: TemplateType): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite")
    const store = transaction.objectStore(STORE_NAME)

    const request = store.delete(type)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

export async function getAllTemplates(): Promise<StoredTemplate[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly")
    const store = transaction.objectStore(STORE_NAME)

    const request = store.getAll()
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result || [])
  })
}

export async function savePPCT(grade: string, items: PPCTItem[]): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(PPCT_STORE_NAME, "readwrite")
    const store = transaction.objectStore(PPCT_STORE_NAME)

    const ppct: StoredPPCT = {
      grade,
      items,
      uploadedAt: new Date(),
    }

    const request = store.put(ppct)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

export async function getPPCT(grade: string): Promise<PPCTItem[] | null> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(PPCT_STORE_NAME, "readonly")
    const store = transaction.objectStore(PPCT_STORE_NAME)

    const request = store.get(grade)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const result = request.result as StoredPPCT | undefined
      if (result) {
        resolve(result.items)
      } else {
        resolve(null)
      }
    }
  })
}

export async function getAllPPCT(): Promise<StoredPPCT[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(PPCT_STORE_NAME, "readonly")
    const store = transaction.objectStore(PPCT_STORE_NAME)

    const request = store.getAll()
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result || [])
  })
}

// Project History Management
export async function saveProject(project: Omit<ProjectHistory, "createdAt">): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(PROJECT_STORE_NAME, "readwrite")
    const store = transaction.objectStore(PROJECT_STORE_NAME)

    const entry: ProjectHistory = {
      ...project,
      createdAt: new Date(),
    }

    const request = store.put(entry)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

export async function getAllProjects(): Promise<ProjectHistory[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(PROJECT_STORE_NAME, "readonly")
    const store = transaction.objectStore(PROJECT_STORE_NAME)

    const request = store.getAll()
    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const results = request.result || []
      // Sort by date descending
      resolve(results.sort((a: ProjectHistory, b: ProjectHistory) =>
        b.createdAt.getTime() - a.createdAt.getTime()
      ))
    }
  })
}

export async function deleteProject(id: string): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(PROJECT_STORE_NAME, "readwrite")
    const store = transaction.objectStore(PROJECT_STORE_NAME)

    const request = store.delete(id)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}
