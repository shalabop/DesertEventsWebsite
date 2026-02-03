import { NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = getServerSupabase()
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true })

    if (error) {
      console.error("Error fetching events:", error)
      return NextResponse.json({ events: [] })
    }

    return NextResponse.json({ events: data || [] })
  } catch (err) {
    console.error("Error in events API:", err)
    return NextResponse.json({ events: [] })
  }
}
