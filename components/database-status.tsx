"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { Database, Wifi, WifiOff } from "lucide-react"

export function DatabaseStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    try {
      const { data, error } = await supabase.from("listings").select("count", { count: "exact", head: true })

      if (error) {
        console.error("Database connection error:", error)
        setIsConnected(false)
      } else {
        setIsConnected(true)
      }
    } catch (error) {
      console.error("Connection test failed:", error)
      setIsConnected(false)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Badge variant="outline" className="flex items-center gap-2">
        <Database className="h-3 w-3 animate-pulse" />
        Checking...
      </Badge>
    )
  }

  return (
    <Badge variant={isConnected ? "default" : "destructive"} className="flex items-center gap-2">
      {isConnected ? (
        <>
          <Wifi className="h-3 w-3" />
          Database Connected
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3" />
          Database Offline
        </>
      )}
    </Badge>
  )
}
