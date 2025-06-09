import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, Star, ArrowRight, Mountain, Cherry } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Navigation */}
      <nav className="border-b border-amber-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Camera className="h-8 w-8 text-amber-600" />
              <span className="text-2xl font-bold text-gray-900">古カメラ</span>
              <span className="text-sm text-gray-600 hidden sm:block">Vintage Cameras UAE</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/admin" className="text-gray-700 hover:text-amber-600 transition-colors">
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-100/50 to-orange-100/50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                  Timeless
                  <span className="block text-amber-600">Photography</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-lg">
                  Discover authentic vintage Japanese cameras that capture the essence of traditional craftsmanship in
                  the UAE
                </p>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Cherry className="h-4 w-4 text-pink-400" />
                  <span>職人の技 - Artisan Craftsmanship</span>
                </div>
              </div>

              <div>
                <Link
                  href="/listings"
                  className="inline-flex items-center justify-center bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-amber-200 active:scale-95 relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></span>
                  <span className="relative z-10 flex items-center">
                    View Collection
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </div>
            </div>

            <div className="relative animate-float">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-3xl blur-3xl" />
              <Image
                src="/images/hero-camera.png"
                alt="Vintage Panasonic RX14 Camera"
                width={500}
                height={600}
                className="relative rounded-3xl shadow-2xl object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Our Collection</h2>
            <p className="text-xl text-gray-600">Each camera tells a story of Japanese precision and artistry</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-amber-200 transition-colors">
                  <Star className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Authentic Quality</h3>
                <p className="text-gray-600">
                  Every camera is carefully inspected and authenticated for genuine vintage quality
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-amber-200 transition-colors">
                  <Mountain className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Heritage Craftsmanship</h3>
                <p className="text-gray-600">
                  Experience the legendary Japanese attention to detail and precision engineering
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-amber-200 transition-colors">
                  <Cherry className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Curated Selection</h3>
                <p className="text-gray-600">Hand-picked cameras from the golden age of Japanese photography</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-amber-600 to-orange-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">Start Your Photography Journey</h2>
          <p className="text-xl text-amber-100 mb-8">
            Discover cameras that have captured decades of memories and are ready to create new ones
          </p>
          <Link
            href="/listings"
            className="inline-flex items-center justify-center bg-white text-amber-600 hover:bg-amber-50 hover:text-amber-700 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-amber-200 active:scale-95"
          >
            Browse Collection
            <ArrowRight className="ml-3 h-6 w-6 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
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
