// IndexedDB storage for .docx templates
const DB_NAME = "SmartDocTeacherDB"
const DB_VERSION = 6 // Increment version to add PPCT storage
const STORE_NAME = "templates"
const PPCT_STORE_NAME = "ppct" // New store for PPCT

export type TemplateType = "meeting" | "event" | "lesson" | "default_meeting" | "default_event" | "default_lesson"

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

import { loadDefaultTemplate } from "./default-templates"

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      // Templates store
      if (db.objectStoreNames.contains(STORE_NAME)) {
        db.deleteObjectStore(STORE_NAME)
      }
      db.createObjectStore(STORE_NAME, { keyPath: "type" })

      if (db.objectStoreNames.contains(PPCT_STORE_NAME)) {
        db.deleteObjectStore(PPCT_STORE_NAME)
      }
      db.createObjectStore(PPCT_STORE_NAME, { keyPath: "grade" })
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

export async function getEffectiveTemplate(type: "meeting" | "event" | "lesson"): Promise<TemplateInfo | null> {
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

  const builtInTemplate = await loadDefaultTemplate(type)
  return builtInTemplate
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
