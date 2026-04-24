/**
 * Shared admin session helpers using sessionStorage so a user authenticated on
 * /admin does not need to re-enter the password on /admin/events and vice versa.
 *
 * Uses sessionStorage (cleared when the browser tab is closed) rather than
 * localStorage so the session does not persist across browser restarts.
 */

const SESSION_KEY = "admin_session_password"

export function getStoredAdminPassword(): string {
  if (typeof window === "undefined") return ""
  try {
    return sessionStorage.getItem(SESSION_KEY) ?? ""
  } catch {
    return ""
  }
}

export function storeAdminPassword(password: string): void {
  if (typeof window === "undefined") return
  try {
    sessionStorage.setItem(SESSION_KEY, password)
  } catch { /* ignore */ }
}

export function clearAdminPassword(): void {
  if (typeof window === "undefined") return
  try {
    sessionStorage.removeItem(SESSION_KEY)
  } catch { /* ignore */ }
}
