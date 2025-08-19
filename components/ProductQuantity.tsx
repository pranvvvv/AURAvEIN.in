"use client"

import { Badge } from "@/components/ui/badge"
import { Crown, Package } from "lucide-react"

interface ProductQuantityProps {
  quantity: number
  isLimitedEdition: boolean
}

export default function ProductQuantity({ quantity, isLimitedEdition }: ProductQuantityProps) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <div className="flex items-center gap-1">
        <Package size={16} className="text-gray-600" />
        <span className="text-sm font-medium text-gray-700">
          Quantity: {quantity}
        </span>
      </div>
      
      {isLimitedEdition && (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Crown size={12} />
          Limited Edition
        </Badge>
      )}
    </div>
  )
} 