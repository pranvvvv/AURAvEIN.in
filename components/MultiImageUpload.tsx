"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X, Upload, Star } from "lucide-react"

interface ImageData {
  id: string
  url: string
  isPrimary: boolean
}

interface MultiImageUploadProps {
  initialImages?: string[]
  onImageChange: (images: string[], primaryImage: string) => void
}

export default function MultiImageUpload({ initialImages = [], onImageChange }: MultiImageUploadProps) {
  const [images, setImages] = useState<ImageData[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)

  useEffect(() => {
    if (initialImages.length > 0) {
      const imageData = initialImages.map((url, index) => ({
        id: Date.now().toString() + index,
        url,
        isPrimary: index === 0,
      }))
      setImages(imageData)
    }
  }, [initialImages])

  const processFiles = async (files: File[]) => {
    if (!files.length) return

    setIsUploading(true)

    try {
      // Filter for image files only
      const imageFiles = files.filter(file => file.type.startsWith('image/'))
      
      if (imageFiles.length === 0) {
        console.warn('No valid image files selected')
        return
      }

      // Process all files and wait for all to complete
      const newImagePromises = imageFiles.map((file, index) => {
        return new Promise<ImageData>((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => {
            const base64String = reader.result as string
            resolve({
              id: Date.now().toString() + Math.random() + index,
              url: base64String,
              isPrimary: images.length === 0 && index === 0, // First image is primary if no existing images
            })
          }
          reader.onerror = () => reject(new Error('Failed to read file'))
          reader.readAsDataURL(file)
        })
      })

      // Wait for all images to be processed
      const newImages = await Promise.all(newImagePromises)
      
      // Update state with all new images at once
      const updatedImages = [...images, ...newImages]
      setImages(updatedImages)
      updateParent(updatedImages)
    } catch (error) {
      console.error('Error processing images:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    await processFiles(files)
    // Clear the input to allow selecting the same files again if needed
    e.target.value = ''
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    await processFiles(files)
  }

  const removeImage = (imageId: string) => {
    const updatedImages = images.filter(img => img.id !== imageId)
    
    // If primary image was removed, make the first remaining image primary
    if (updatedImages.length > 0 && !updatedImages.some(img => img.isPrimary)) {
      updatedImages[0].isPrimary = true
    }
    
    setImages(updatedImages)
    updateParent(updatedImages)
  }

  const setPrimaryImage = (imageId: string) => {
    const updatedImages = images.map(img => ({
      ...img,
      isPrimary: img.id === imageId
    }))
    setImages(updatedImages)
    updateParent(updatedImages)
  }

  const updateParent = (imageList: ImageData[]) => {
    const urls = imageList.map(img => img.url)
    const primaryImage = imageList.find(img => img.isPrimary)?.url || urls[0] || ""
    onImageChange(urls, primaryImage)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Product Images</label>
        
        {/* Drag and Drop Area */}
        <div 
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragOver 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          } ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isUploading && document.getElementById('file-upload')?.click()}
        >
          <Input 
            id="file-upload"
            type="file" 
            accept="image/*" 
            multiple 
            onChange={handleFileChange} 
            disabled={isUploading}
            className="hidden"
          />
          
          <div className="space-y-2">
            <Upload className="w-8 h-8 mx-auto text-gray-400" />
            <div className="text-sm text-gray-600">
              {isUploading ? (
                <span>Processing images...</span>
              ) : (
                <>
                  <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                </>
              )}
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF up to 10MB each
            </p>
          </div>
        </div>
        
        {/* Image count display */}
        {images.length > 0 && (
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-gray-600">
              {images.length} image{images.length !== 1 ? 's' : ''} selected
            </span>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              onClick={() => !isUploading && document.getElementById('file-upload')?.click()}
              disabled={isUploading}
            >
              <Upload className="w-3 h-3 mr-1" />
              Add More
            </Button>
          </div>
        )}
        
        <p className="text-xs text-gray-500 mt-1">
          The first image or the one marked with a star will be the primary image.
        </p>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.id} className="relative group">
              <div className="relative w-full h-32 rounded-lg overflow-hidden border">
                <img 
                  src={image.url} 
                  alt="Product" 
                  className="w-full h-full object-cover"
                />
                
                {/* Primary badge */}
                {image.isPrimary && (
                  <Badge className="absolute top-2 left-2 bg-yellow-500 text-black">
                    <Star className="w-3 h-3 mr-1" />
                    Primary
                  </Badge>
                )}

                {/* Action buttons */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200">
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                    {!image.isPrimary && (
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => setPrimaryImage(image.id)}
                        title="Set as primary"
                      >
                        <Star className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => removeImage(image.id)}
                      title="Remove image"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
