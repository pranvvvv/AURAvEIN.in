
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Image as ImageIcon } from "lucide-react"

interface ImageUploadProps {
  onImageUpload: (url: string) => void
}

export default function ImageUpload({ onImageUpload }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      const base64String = reader.result as string
      setPreview(base64String)
      onImageUpload(base64String)
      setIsUploading(false)
    }
  }

  const removeImage = () => {
    setPreview(null)
    onImageUpload("")
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium mb-2">Product Image</label>
      <div className="flex items-center gap-4">
        <Input type="file" accept="image/*" onChange={handleFileChange} disabled={isUploading} />
      </div>
      {isUploading && <p className="text-sm text-gray-500">Uploading...</p>}
      {preview && (
        <div className="relative w-32 h-32 mt-2">
          <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-md" />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-1 right-1 h-6 w-6"
            onClick={removeImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

