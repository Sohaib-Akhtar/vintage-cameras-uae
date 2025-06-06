"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, ChevronLeft, Calendar, Info, CheckCircle, ArrowLeft, ZoomIn } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { getListings, type Listing } from "@/lib/supabase"

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [relatedListings, setRelatedListings] = useState<Listing[]>([])

  useEffect(() => {
    const id = params.id as string
    loadListing(id)
  }, [params.id])

  const loadListing = async (id: string) => {
    try {
      setLoading(true)
      const allListings = await getListings()
      const currentListing = allListings.find((item) => item.id === id)

      if (currentListing) {
        setListing(currentListing)
        // Find related listings (same brand or similar price range)
        const related = allListings
          .filter(
            (item) =>
              item.id !== id &&
              (item.brand === currentListing.brand ||
                Math.abs(item.price - currentListing.price) < currentListing.price * 0.3),
          )
          .slice(0, 3)
        setRelatedListings(related)
      } else {
        // Fallback to localStorage for development
        const savedListings = localStorage.getItem("cameraListings")
        if (savedListings) {
          const parsedListings = JSON.parse(savedListings)
          const localListing = parsedListings.find((item: Listing) => item.id === id)
          if (localListing) {
            setListing(localListing)
            // Find related listings
            const related = parsedListings
              .filter(
                (item: Listing) =>
                  item.id !== id &&
                  (item.brand === localListing.brand ||
                    Math.abs(item.price - localListing.price) < localListing.price * 0.3),
              )
              .slice(0, 3)
            setRelatedListings(related)
          } else {
            router.push("/listings")
          }
        } else {
          router.push("/listings")
        }
      }
    } catch (error) {
      console.error("Error loading listing:", error)
      router.push("/listings")
    } finally {
      setLoading(false)
    }
  }

  const handleWhatsAppContact = () => {
    if (!listing) return

    const message = `Hi! I'm interested in the ${listing.title} (AED ${listing.price.toLocaleString()}). Could you provide more details?`
    const whatsappUrl = `https://wa.me/971522083985?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <Camera className="h-16 w-16 text-amber-600 mx-auto mb-4 animate-spin" />
          <p className="text-xl text-gray-600">Loading camera details...</p>
        </div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
            <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-4">Camera not found</h3>
            <p className="text-gray-500 mb-6">The camera you're looking for is no longer available.</p>
            <Button asChild>
              <Link href="/listings">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Collection
              </Link>
            </Button>
          </div>
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
              <Link href="/listings" className="text-gray-700 hover:text-amber-600 transition-colors">
                Collection
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center text-sm text-gray-500">
            <Link href="/" className="hover:text-amber-600 transition-colors">
              Home
            </Link>
            <ChevronLeft className="h-4 w-4 mx-2 rotate-180" />
            <Link href="/listings" className="hover:text-amber-600 transition-colors">
              Collection
            </Link>
            <ChevronLeft className="h-4 w-4 mx-2 rotate-180" />
            <span className="text-gray-900 font-medium">{listing.title}</span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div className="space-y-6">
              <div className="relative bg-white rounded-lg overflow-hidden shadow-lg aspect-[4/3]">
                <Image
                  src={selectedImage || listing.images[0] || "/placeholder.svg"}
                  alt={listing.title}
                  fill
                  className="object-contain"
                />
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full"
                    >
                      <ZoomIn className="h-4 w-4 mr-2" />
                      Zoom
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-5xl max-h-[90vh] p-0">
                    <div className="relative">
                      <Image
                        src={selectedImage || listing.images[0] || "/placeholder.svg"}
                        alt={listing.title}
                        width={1200}
                        height={900}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Thumbnails */}
              {listing.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {listing.images.map((image, index) => (
                    <button
                      key={index}
                      className={`relative rounded-md overflow-hidden border-2 transition-all ${
                        (selectedImage || listing.images[0]) === image
                          ? "border-amber-500 shadow-md"
                          : "border-transparent hover:border-amber-300"
                      }`}
                      onClick={() => setSelectedImage(image)}
                    >
                      <div className="aspect-square relative">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`${listing.title} - View ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              <div>
                <div className="flex items-center justify-between">
                  <Badge className="bg-amber-600 hover:bg-amber-700 mb-3">{listing.condition}</Badge>
                  {listing.year && (
                    <Badge variant="outline" className="mb-3">
                      <Calendar className="h-3 w-3 mr-1" />
                      {listing.year}
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{listing.title}</h1>
                <div className="flex items-center text-gray-500 mb-4">
                  <span className="font-medium text-gray-700">{listing.brand}</span>
                </div>
                <div className="text-3xl font-bold text-amber-600 mb-6">AED {listing.price.toLocaleString()}</div>
                <p className="text-gray-600 leading-relaxed">{listing.description}</p>
              </div>

              <Separator />

              {/* Specifications */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Info className="h-5 w-5 mr-2 text-amber-600" />
                  Specifications
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Brand</p>
                      <p className="text-gray-600">{listing.brand}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Condition</p>
                      <p className="text-gray-600">{listing.condition}</p>
                    </div>
                  </div>
                  {listing.year && (
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Year</p>
                        <p className="text-gray-600">{listing.year}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Type</p>
                      <p className="text-gray-600">Vintage Camera</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Actions */}
              <div className="flex flex-col gap-4">
                <Button
                  onClick={handleWhatsAppContact}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white py-4 px-6 text-lg font-medium"
                >
                  <img src="/icons/whatsapp.png" alt="WhatsApp" className="h-6 w-6 mr-3" />
                  Contact via WhatsApp
                </Button>
                <Button asChild variant="outline" size="lg" className="py-4 px-6 text-lg font-medium">
                  <Link href="/listings">
                    <ArrowLeft className="h-6 w-6 mr-3" />
                    Back to Collection
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full md:w-auto grid-cols-3 mb-8">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
              <TabsTrigger value="warranty">Warranty</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-4">
              <h3 className="text-xl font-semibold">Product Details</h3>
              <p className="text-gray-600">
                This {listing.title} is a {listing.condition.toLowerCase()} condition vintage camera from{" "}
                {listing.year || "the golden era of photography"}. It has been carefully inspected and tested to ensure
                it meets our quality standards.
              </p>
              <p className="text-gray-600">
                Each vintage camera in our collection has its own unique history and character. This particular model is
                known for its reliability, precision, and exceptional build quality that has stood the test of time.
              </p>
              <p className="text-gray-600">
                Whether you're a collector, enthusiast, or professional photographer looking to experience the charm of
                film photography, this camera offers an authentic experience that digital simply cannot replicate.
              </p>
            </TabsContent>
            <TabsContent value="shipping" className="space-y-4">
              <h3 className="text-xl font-semibold">Shipping Information</h3>
              <p className="text-gray-600">
                Shipping available across the UAE. Contact for more details on WhatsApp via the button above.
              </p>
              <p className="text-gray-600">
                All cameras are carefully packaged to ensure they arrive safely. We use premium packaging materials and
                secure shipping methods to protect your vintage purchase.
              </p>
              <p className="text-gray-600">
                International shipping is available upon request. Please contact us via WhatsApp for international
                shipping rates and estimated delivery times.
              </p>
            </TabsContent>
            <TabsContent value="warranty" className="space-y-4">
              <h3 className="text-xl font-semibold">Warranty & Returns</h3>
              <p className="text-gray-600">
                While these are vintage items, we stand behind their functionality. Each camera has been tested and
                verified to be in working condition as described. Any known issues or quirks are clearly mentioned in
                the product description.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Related Products */}
      {relatedListings.length > 0 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedListings.map((item) => (
                <Link
                  key={item.id}
                  href={`/product/${item.id}`}
                  className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-48">
                    <Image
                      src={item.images[0] || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-2 left-2 bg-amber-600">{item.condition}</Badge>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-gray-500 text-sm">{item.brand}</span>
                      <span className="font-bold text-amber-600">AED {item.price.toLocaleString()}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Camera className="h-6 w-6 text-amber-400" />
              <span className="text-xl font-bold">古カメラ Vintage Cameras UAE</span>
            </div>
            <p className="text-gray-400 text-center md:text-right">
              © 2025 Vintage Japanese Cameras UAE. Preserving photographic heritage.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
