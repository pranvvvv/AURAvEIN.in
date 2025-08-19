"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle } from "lucide-react"

interface WhatsAppOrderProps {
  product: any
  selectedSize: string
  selectedColor: string
  quantity: number
}

export default function WhatsAppOrder({ product, selectedSize, quantity }: WhatsAppOrderProps) {
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    address: "",
  })

  const handleWhatsAppOrder = () => {
    // Format message in bullet points
    const message = `Hi I want to place an order:
• Product: ${product.name}
• Size: ${selectedSize}
• Quantity: ${quantity}
• Name: ${customerInfo.name}
• Address: ${customerInfo.address}`

    const whatsappUrl = `https://wa.me/919059731884?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <div className="mt-8 p-6 bg-green-50 rounded-lg border border-green-200">
      <h3 className="text-sm font-medium uppercase tracking-wider mb-4 flex items-center gap-2">
        <MessageCircle className="w-4 h-4 text-green-600" />
        Order via WhatsApp
      </h3>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-medium mb-2">Your Name</label>
          <Input
            value={customerInfo.name}
            onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
            placeholder="Enter your full name"
            className="text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-2">Delivery Address</label>
          <Textarea
            value={customerInfo.address}
            onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
            placeholder="Enter your complete address"
            rows={3}
            className="text-sm"
          />
        </div>
      </div>

      <Button
        onClick={handleWhatsAppOrder}
        className="w-full bg-green-600 hover:bg-green-700 text-white text-xs uppercase tracking-wider"
        disabled={!customerInfo.name || !customerInfo.address}
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        Send Order to WhatsApp
      </Button>
    </div>
  )
}
