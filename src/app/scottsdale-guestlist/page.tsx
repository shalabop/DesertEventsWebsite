import { getAdminConfig } from "@/lib/admin-config"
import ScottsdaleGuestlistClient from "./ScottsdaleGuestlistClient"
import type { AdminConfig } from "@/lib/admin-config"

export const metadata = {
  title: "Nightlife • Desert Events",
  description: "Priority entry and bottle service at Old Town's top venues.",
}

export default async function Page() {
  const config: AdminConfig = await getAdminConfig()
  return <ScottsdaleGuestlistClient config={config} />
}
