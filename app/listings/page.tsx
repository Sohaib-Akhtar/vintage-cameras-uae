"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, ZoomIn, ArrowRight } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { getListings, type Listing } from "@/lib/supabase"

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadListings()
  }, [])

  const loadListings = async () => {
    try {
      const data = await getListings()
      setListings(data)
    } catch (error) {
      console.error("Error loading listings:", error)
      // Fallback to localStorage for development
      const savedListings = localStorage.getItem("cameraListings")
      if (savedListings) {
        setListings(JSON.parse(savedListings))
      } else {
        // Sample data with AED pricing
        const sampleListings: Listing[] = [
          {
            id: "1",
            title: "Canon AE-1 Program",
            description: "Classic 35mm SLR camera in excellent condition. Perfect for film photography enthusiasts.",
            price: 1100,
            images: ["/placeholder.svg?height=400&width=400"],
            condition: "Excellent",
            year: "1981",
            brand: "Canon",
          },
          {
            id: "2",
            title: "Nikon FM2",
            description: "Professional mechanical SLR camera. Built like a tank and ready for any adventure.",
            price: 1650,
            images: ["/placeholder.svg?height=400&width=400"],
            condition: "Very Good",
            year: "1982",
            brand: "Nikon",
          },
        ]
        setListings(sampleListings)
        localStorage.setItem("cameraListings", JSON.stringify(sampleListings))
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <Camera className="h-16 w-16 text-amber-600 mx-auto mb-4 animate-spin" />
          <p className="text-xl text-gray-600">Loading camera collection...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Navigation */}
      <nav className="border-b border-amber-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Camera className="h-8 w-8 text-amber-600" />
              <span className="text-2xl font-bold text-gray-900">古カメラ</span>
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/" className="text-gray-700 hover:text-amber-600 transition-colors">
                Home
              </Link>
              <Link href="/admin" className="text-gray-700 hover:text-amber-600 transition-colors">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-16 bg-gradient-to-r from-amber-600 to-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">Camera Collection</h1>
          <p className="text-xl text-amber-100">
            コレクション - Discover authentic vintage Japanese cameras in the UAE
          </p>
        </div>
      </section>

      {/* Listings Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {listings.length === 0 ? (
            <div className="text-center py-16">
              <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No cameras available</h3>
              <p className="text-gray-500">Check back soon for new additions to our collection.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {listings.map((listing) => (
                <Card
                  key={listing.id}
                  className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg overflow-hidden"
                >
                  <div className="relative overflow-hidden">
                    <Image
                      src={listing.images[0] || "/placeholder.svg"}
                      alt={listing.title}
                      width={400}
                      height={300}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
                        >
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
                        <div className="relative">
                          <Image
                            src={listing.images[0] || "/placeholder.svg"}
                            alt={listing.title}
                            width={800}
                            height={600}
                            className="w-full h-auto object-contain"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Badge className="absolute top-4 left-4 bg-amber-600 hover:bg-amber-700">{listing.condition}</Badge>
                  </div>

                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{listing.title}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2">{listing.description}</p>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{listing.brand}</span>
                        {listing.year && <span>{listing.year}</span>}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-amber-600">AED {listing.price.toLocaleString()}</div>
                        <Link
                          href={`/product/${listing.id}`}
                          className="inline-flex items-center justify-center bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-amber-200 active:scale-95 relative overflow-hidden group"
                        >
                          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></span>
                          <span className="relative z-10 flex items-center">
                            View
                            <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                          </span>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
