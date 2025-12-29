// Default Word templates embedded as base64
// These templates will be used when user hasn't uploaded their own templates

// Function to convert base64 to ArrayBuffer
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes.buffer
}

// URLs to fetch default templates from public folder
const DEFAULT_TEMPLATE_URLS = {
  meeting: "/templates/mau-bien-ban-hop-to.docx",
  event: "/templates/mau-ke-hoach-ngoai-khoa.docx",
  lesson: "/templates/mau-ke-hoach-day-hoc.docx",
}

// Cache for loaded templates
const templateCache: { [key: string]: ArrayBuffer | null } = {}

// Check if template exists in public folder and load it
export async function loadDefaultTemplate(
  type: "meeting" | "event" | "lesson",
): Promise<{ name: string; data: ArrayBuffer } | null> {
  // Check cache first
  if (templateCache[type]) {
    return {
      name: `Mẫu mặc định - ${type === "meeting" ? "Biên bản họp" : type === "event" ? "Kế hoạch ngoại khóa" : "Kế hoạch dạy học"}.docx`,
      data: templateCache[type]!,
    }
  }

  try {
    const url = DEFAULT_TEMPLATE_URLS[type]
    const response = await fetch(url)

    if (!response.ok) {
      console.log(`[v0] Default template not found: ${url}`)
      return null
    }

    const arrayBuffer = await response.arrayBuffer()
    templateCache[type] = arrayBuffer

    return {
      name: `Mẫu mặc định - ${type === "meeting" ? "Biên bản họp" : type === "event" ? "Kế hoạch ngoại khóa" : "Kế hoạch dạy học"}.docx`,
      data: arrayBuffer,
    }
  } catch (error) {
    console.log(`[v0] Error loading default template: ${error}`)
    return null
  }
}

// Check if any default templates are available
export async function hasDefaultTemplates(): Promise<{
  meeting: boolean
  event: boolean
  lesson: boolean
}> {
  const results = await Promise.all([
    loadDefaultTemplate("meeting").then((t) => !!t),
    loadDefaultTemplate("event").then((t) => !!t),
    loadDefaultTemplate("lesson").then((t) => !!t),
  ])

  return {
    meeting: results[0],
    event: results[1],
    lesson: results[2],
  }
}
