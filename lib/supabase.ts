import { createClient } from "@supabase/supabase-js"

// Use the provided Supabase credentials
const supabaseUrl = "https://ztoaaoxaesasvtzcrxgo.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0b2Fhb3hhZXNhc3Z0emNyeGdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxOTkxMjIsImV4cCI6MjA2NDc3NTEyMn0.NjpYyQ8wa-kOQB6S7DivI_VsXIqPYSliXNqlMCl-K6w"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Listing {
  id: string
  title: string
  description: string
  price: number
  images: string[]
  condition: string
  year?: string
  brand: string
  created_at?: string
  updated_at?: string
}

// Database functions
export async function getListings(): Promise<Listing[]> {
  const { data, error } = await supabase.from("listings").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching listings:", error)
    return []
  }

  return data || []
}

export async function createListing(
  listing: Omit<Listing, "id" | "created_at" | "updated_at">,
): Promise<Listing | null> {
  const { data, error } = await supabase.from("listings").insert([listing]).select().single()

  if (error) {
    console.error("Error creating listing:", error)
    return null
  }

  return data
}

export async function updateListing(id: string, listing: Partial<Listing>): Promise<Listing | null> {
  const { data, error } = await supabase
    .from("listings")
    .update({ ...listing, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating listing:", error)
    return null
  }

  return data
}

export async function deleteListing(id: string): Promise<boolean> {
  const { error } = await supabase.from("listings").delete().eq("id", id)

  if (error) {
    console.error("Error deleting listing:", error)
    return false
  }

  return true
}

// Enhanced image upload function with Supabase Storage
export async function uploadImage(file: File, bucket = "camera-images"): Promise<string | null> {
  try {
    const fileExt = file.name.split(".").pop()
    const fileName = `uploads/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

    const { data, error } = await supabase.storage.from(bucket).upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Error uploading image:", error)
      return null
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(fileName)

    return publicUrl
  } catch (error) {
    console.error("Error in uploadImage:", error)
    return null
  }
}

// Function to delete image from storage
export async function deleteImage(url: string, bucket = "camera-images"): Promise<boolean> {
  try {
    // Extract filename from URL
    const urlParts = url.split("/")
    const fileName = urlParts[urlParts.length - 1]
    const filePath = `uploads/${fileName}`

    const { error } = await supabase.storage.from(bucket).remove([filePath])

    if (error) {
      console.error("Error deleting image:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in deleteImage:", error)
    return false
  }
}
