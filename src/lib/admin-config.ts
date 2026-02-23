import path from "path"
import fs from "fs/promises"

export interface AdminConfig {
  fonts: {
    heading: string | null
    body: string | null
    button: string | null
    headingBold: boolean
    bodyBold: boolean
    buttonBold: boolean
  }
  images: {
    logo: string | null
    heroPoster: string | null
  }
}

const DEFAULT_CONFIG: AdminConfig = {
  fonts: { heading: null, body: null, button: null, headingBold: false, bodyBold: false, buttonBold: false },
  images: { logo: null, heroPoster: null },
}

const CONFIG_PATH = path.join(process.cwd(), "data", "admin-config.json")

export async function getAdminConfig(): Promise<AdminConfig> {
  try {
    const raw = await fs.readFile(CONFIG_PATH, "utf-8")
    const parsed = JSON.parse(raw)
    // Merge with defaults so missing keys are always present
    return {
      fonts: { ...DEFAULT_CONFIG.fonts, ...parsed.fonts },
      images: { ...DEFAULT_CONFIG.images, ...parsed.images },
    }
  } catch {
    return DEFAULT_CONFIG
  }
}

export async function setAdminConfig(config: AdminConfig): Promise<void> {
  await fs.mkdir(path.dirname(CONFIG_PATH), { recursive: true })
  await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8")
}
