"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Camera, Plus, Edit, Trash2, Eye, EyeOff, Upload, X, ImageIcon, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getListings, createListing, updateListing, deleteListing, type Listing, uploadImage } from "@/lib/supabase"
import { DatabaseStatus } from "@/components/database-status"

// Image Upload Component (inline to avoid import issues)
function ImageUpload({
  onImagesChange,
  existingImages = [],
  urlImages = "",
  onUrlImagesChange,
}: {
  onImagesChange: (images: string[]) => void
  existingImages?: string[]
  urlImages?: string
  onUrlImagesChange?: (urls: string) => void
}) {
  const [draggedImages, setDraggedImages] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>(existingImages)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const handleImageUpload = async (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    const imageFiles = fileArray.filter((file) => file.type.startsWith("image/"))

    if (imageFiles.length === 0) {
      toast({
        title: "Invalid files",
        description: "Please select only image files",
        variant: "destructive",
      })
      return
    }

    if (imageFiles.length > 10) {
      toast({
        title: "Too many files",
        description: "Please select no more than 10 images at once",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    setDraggedImages((prev) => [...prev, ...imageFiles])

    const newPreviewUrls: string[] = []

    for (const file of imageFiles) {
      try {
        const uploadedUrl = await uploadImage(file)

        if (uploadedUrl) {
          newPreviewUrls.push(uploadedUrl)
        } else {
          const reader = new FileReader()
          reader.onload = (e) => {
            if (e.target?.result) {
              newPreviewUrls.push(e.target.result as string)
            }
          }
          reader.onerror = () => {
            console.error("Failed to read file")
            toast({
              title: "Upload error",
              description: `Failed to process ${file.name}`,
              variant: "destructive",
            })
          }
          reader.readAsDataURL(file)
        }
      } catch (error) {
        console.error("Error processing file:", error)
        toast({
          title: "Upload error",
          description: `Failed to process ${file.name}`,
          variant: "destructive",
        })
      }
    }

    const updatedUrls = [...imagePreviewUrls, ...newPreviewUrls]
    setImagePreviewUrls(updatedUrls)
    onImagesChange(updatedUrls)
    setIsUploading(false)

    toast({
      title: "Images uploaded",
      description: `Successfully added ${newPreviewUrls.length} image(s)`,
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    handleImageUpload(files)
  }

  const removeImage = (index: number) => {
    const updatedUrls = imagePreviewUrls.filter((_, i) => i !== index)
    const updatedFiles = draggedImages.filter((_, i) => i !== index)

    setImagePreviewUrls(updatedUrls)
    setDraggedImages(updatedFiles)
    onImagesChange(updatedUrls)

    toast({
      title: "Image removed",
      description: "Image has been removed from the listing",
    })
  }

  const clearAllImages = () => {
    setDraggedImages([])
    setImagePreviewUrls([])
    onImagesChange([])

    toast({
      title: "All images cleared",
      description: "All uploaded images have been removed",
    })
  }

  return (
    <div className="space-y-4">
      <Label>Images</Label>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
          isDragging
            ? "border-amber-500 bg-amber-50 scale-105"
            : "border-gray-300 hover:border-amber-400 hover:bg-amber-50/50"
        } ${isUploading ? "pointer-events-none opacity-70" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isUploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 mx-auto mb-4 text-amber-500 animate-spin" />
            <p className="text-lg font-medium mb-2">Processing images...</p>
          </div>
        ) : (
          <>
            <Upload
              className={`h-12 w-12 mx-auto mb-4 transition-all duration-300 ${
                isDragging ? "text-amber-500 scale-110" : "text-gray-400"
              }`}
            />
            <p className="text-lg font-medium mb-2">{isDragging ? "Drop images here" : "Drag & drop images here"}</p>
            <p className="text-gray-500 mb-4">Supports JPG, PNG, WebP (max 10 files)</p>
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("file-upload")?.click()}
              className="border-amber-300 text-amber-600 hover:bg-amber-50 transition-all duration-200 hover:scale-105"
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Browse Files
            </Button>
          </>
        )}
        <input
          id="file-upload"
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
        />
      </div>

      {imagePreviewUrls.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Uploaded Images ({imagePreviewUrls.length})</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clearAllImages}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-64 overflow-y-auto p-2 border rounded-lg bg-gray-50">
            {imagePreviewUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url || "/placeholder.svg"}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-20 object-cover rounded-lg border border-gray-200 transition-transform duration-200 hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8 rounded-full p-0"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <Label htmlFor="images" className="text-sm">
          Or add image URLs (comma-separated)
        </Label>
        <Textarea
          id="images"
          value={urlImages}
          onChange={(e) => onUrlImagesChange?.(e.target.value)}
          placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
          rows={2}
          className="mt-1"
        />
        <p className="text-xs text-gray-500 mt-1">You can mix uploaded images with URL images</p>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [listings, setListings] = useState<Listing[]>([])
  const [isAddingListing, setIsAddingListing] = useState(false)
  const [editingListing, setEditingListing] = useState<Listing | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    images: [] as string[],
    urlImages: "",
    condition: "",
    year: "",
    brand: "",
  })
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const authStatus = localStorage.getItem("adminAuth")
    if (authStatus === "true") {
      setIsAuthenticated(true)
      loadListings()
    }
  }, [])

  const loadListings = async () => {
    setIsLoading(true)
    try {
      const data = await getListings()
      setListings(data)
    } catch (error) {
      toast({
        title: "Error loading listings",
        description: "Failed to load listings from the database.",
        variant: "destructive",
      })
      console.error("Error loading listings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === "admin" && password === "vintage123") {
      setIsAuthenticated(true)
      localStorage.setItem("adminAuth", "true")
      loadListings()
      toast({
        title: "Login successful",
        description: "Welcome to the admin panel",
      })
    } else {
      toast({
        title: "Login failed",
        description: "Invalid credentials",
        variant: "destructive",
      })
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("adminAuth")
    setUsername("")
    setPassword("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const urlImageArray = formData.urlImages
        .split(",")
        .map((img) => img.trim())
        .filter((img) => img)

      const allImages = [...formData.images, ...urlImageArray]

      if (editingListing) {
        // For updates, include the ID
        const updatedListing = await updateListing(editingListing.id, {
          title: formData.title,
          description: formData.description,
          price: Number.parseFloat(formData.price),
          images: allImages,
          condition: formData.condition,
          year: formData.year,
          brand: formData.brand,
        })

        if (updatedListing) {
          setListings((prevListings) =>
            prevListings.map((listing) => (listing.id === editingListing.id ? updatedListing : listing)),
          )
          toast({
            title: "Listing updated",
            description: "The camera listing has been updated successfully",
          })
        }
      } else {
        // For new listings, don't include an ID - let Supabase generate it
        const newListing = {
          title: formData.title,
          description: formData.description,
          price: Number.parseFloat(formData.price),
          images: allImages,
          condition: formData.condition,
          year: formData.year,
          brand: formData.brand,
        }

        const createdListing = await createListing(newListing)
        if (createdListing) {
          setListings((prevListings) => [...prevListings, createdListing])
          toast({
            title: "Listing added",
            description: "New camera listing has been added successfully",
          })
        }
      }
    } catch (error) {
      toast({
        title: editingListing ? "Update failed" : "Add failed",
        description: "Failed to save the listing.",
        variant: "destructive",
      })
      console.error("Error saving listing:", error)
    } finally {
      setFormData({
        title: "",
        description: "",
        price: "",
        images: [],
        urlImages: "",
        condition: "",
        year: "",
        brand: "",
      })
      setIsAddingListing(false)
      setEditingListing(null)
      setIsLoading(false)
    }
  }

  const handleEdit = (listing: Listing) => {
    if (!listing) return

    setEditingListing(listing)
    setFormData({
      title: listing.title || "",
      description: listing.description || "",
      price: listing.price?.toString() || "",
      images: listing.images?.filter((img) => img.startsWith("data:")) || [],
      urlImages: listing.images?.filter((img) => !img.startsWith("data:")).join(", ") || "",
      condition: listing.condition || "",
      year: listing.year || "",
      brand: listing.brand || "",
    })
    setIsAddingListing(true)
  }

  const handleDelete = async (id: string) => {
    setIsLoading(true)
    try {
      await deleteListing(id)
      setListings((prevListings) => prevListings.filter((listing) => listing.id !== id))
      toast({
        title: "Listing deleted",
        description: "The camera listing has been deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Failed to delete the listing.",
        variant: "destructive",
      })
      console.error("Error deleting listing:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Camera className="h-12 w-12 text-amber-600 mx-auto mb-4" />
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <p className="text-gray-600">管理者ログイン</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <nav className="border-b border-amber-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Camera className="h-8 w-8 text-amber-600" />
              <span className="text-2xl font-bold text-gray-900">Admin Panel</span>
            </div>
            <div className="flex items-center space-x-4">
              <DatabaseStatus />
              <Button variant="outline" asChild>
                <a href="/listings" target="_blank" rel="noreferrer">
                  View Site
                </a>
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Camera Listings</h1>
            <p className="text-gray-600">Manage your vintage camera collection</p>
          </div>
          <Dialog open={isAddingListing} onOpenChange={setIsAddingListing}>
            <DialogTrigger asChild>
              <Button className="bg-amber-600 hover:bg-amber-700" disabled={isLoading}>
                <Plus className="h-4 w-4 mr-2" />
                Add Listing
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingListing ? "Edit Listing" : "Add New Listing"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price">Price (AED)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="condition">Condition</Label>
                    <Select
                      value={formData.condition}
                      onValueChange={(value) => setFormData({ ...formData, condition: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mint">Mint</SelectItem>
                        <SelectItem value="Excellent">Excellent</SelectItem>
                        <SelectItem value="Very Good">Very Good</SelectItem>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="Fair">Fair</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      placeholder="e.g., 1981"
                    />
                  </div>
                </div>

                <ImageUpload
                  onImagesChange={(images) => setFormData({ ...formData, images })}
                  existingImages={formData.images}
                  urlImages={formData.urlImages}
                  onUrlImagesChange={(urls) => setFormData({ ...formData, urlImages: urls })}
                />

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsAddingListing(false)
                      setEditingListing(null)
                      setFormData({
                        title: "",
                        description: "",
                        price: "",
                        images: [],
                        urlImages: "",
                        condition: "",
                        year: "",
                        brand: "",
                      })
                    }}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-amber-600 hover:bg-amber-700" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : editingListing ? (
                      "Update"
                    ) : (
                      "Add"
                    )}{" "}
                    Listing
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Card key={listing.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg">{listing.title}</h3>
                    <Badge variant="secondary">{listing.condition}</Badge>
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-2">{listing.description}</p>

                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{listing.brand}</span>
                    <span>AED {listing.price.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(listing)} disabled={isLoading}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(listing.id)}
                      className="text-red-600 hover:text-red-700"
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {isLoading && listings.length > 0 && (
          <div className="flex justify-center items-center mt-4">
            <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        )}

        {listings.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No listings yet</h3>
            <p className="text-gray-500">Add your first camera listing to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}
