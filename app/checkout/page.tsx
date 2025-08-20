"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Tag, Trash2 } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import {
  getCurrentUser,
  saveOrders,
  getOrders,
  validateCoupon,
  applyCoupon,
  calculateDiscount,
  type DeliveryAddress,
  type Order,
} from "@/lib/localStorage"
import DeliveryAddressForm from "@/components/DeliveryAddressForm"

import { sendWhatsAppInvoice, sendCustomerConfirmation, AuraveinWhatsAppOrder } from "@/lib/whatsappInvoice"
import { toast } from "@/components/ui/use-toast"
import jsPDF from "jspdf"

type CheckoutStep = "address" | "payment"

export default function Checkout() {
  const router = useRouter()
  const { cartItems, clearCart } = useCart()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [step, setStep] = useState<CheckoutStep>("address")
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress | null>(null)
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null)
  const [couponLoading, setCouponLoading] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const user = getCurrentUser()
    setCurrentUser(user)
  }, [])

  useEffect(() => {
    if (!currentUser) {
      router.push("/login?redirect=/checkout")
      return
    }

    if (cartItems.length === 0) {
      router.push("/cart")
      return
    }
  }, [currentUser, cartItems, router])

  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const discount = appliedCoupon ? calculateDiscount(appliedCoupon, subtotal) : 0
  const deliveryFee = subtotal > 2000 ? 0 : 99 // Free delivery above ₹2000
  const total = subtotal - discount + deliveryFee

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return

    setCouponLoading(true)
    try {
      const validation = validateCoupon(couponCode, subtotal)

      if (validation.valid && validation.coupon) {
        setAppliedCoupon(validation.coupon)
        toast({
          title: "Coupon Applied!",
          description: `You saved ₹${calculateDiscount(validation.coupon, subtotal)}`,
        })
      } else {
        toast({
          title: "Invalid Coupon",
          description: validation.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to apply coupon",
        variant: "destructive",
      })
    } finally {
      setCouponLoading(false)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode("")
    toast({
      title: "Coupon Removed",
      description: "Coupon has been removed from your order",
    })
  }

  const handleAddressSubmit = (address: DeliveryAddress) => {
    setDeliveryAddress(address)
    setStep("payment")
  }

  const generateInvoicePDF = (order: any) => {
    const doc = new jsPDF()
    let y = 10
    doc.setFontSize(16)
    doc.text("Auravein Order Invoice", 10, y)
    y += 10
    doc.setFontSize(10)
    doc.text(`Order ID: ${order.id}`, 10, y)
    y += 6
    doc.text(`Date: ${new Date(order.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`, 10, y)
    y += 6
    doc.text(`Payment: ${order.paymentMethod.toUpperCase()}`, 10, y)
    y += 6
    doc.text(`Coupon: ${order.couponCode || 'N/A'} (₹${order.discount || 0})`, 10, y)
    y += 8
    doc.text("Customer:", 10, y)
    y += 6
    doc.text(`${order.deliveryAddress.name} | ${order.deliveryAddress.phone} | ${order.deliveryAddress.email}`, 10, y)
    y += 8
    doc.text("Delivery Address:", 10, y)
    y += 6
    doc.text(`${order.deliveryAddress.addressType}: ${order.deliveryAddress.addressLine1}${order.deliveryAddress.floor ? ', Floor: ' + order.deliveryAddress.floor : ''}`, 10, y)
    y += 6
    doc.text(`${order.deliveryAddress.addressLine2}${order.deliveryAddress.landmark ? ', ' + order.deliveryAddress.landmark : ''}, ${order.deliveryAddress.city}, ${order.deliveryAddress.state || ''} - ${order.deliveryAddress.pincode}`, 10, y)
    y += 8
    doc.text("Items:", 10, y)
    y += 6
    order.items.forEach((item: any, idx: number) => {
      doc.text(`${idx + 1}) ${item.name} | ${item.color || ''}/${item.size || ''} | ${item.sku || item.id} | ${item.quantity} × ₹${item.price} = ₹${item.price * item.quantity}`, 10, y)
      y += 6
    })
    y += 2
    doc.text("Totals:", 10, y)
    y += 6
    doc.text(`Subtotal: ₹${order.subtotal}`, 10, y)
    y += 6
    doc.text(`Discount: ₹${order.discount}`, 10, y)
    y += 6
    doc.text(`Shipping: ₹${order.deliveryFee}`, 10, y)
    y += 6
    if (order.codFee) { doc.text(`COD Fee: ₹${order.codFee}`, 10, y); y += 6 }
    if (order.tax) { doc.text(`Tax: ₹${order.tax}`, 10, y); y += 6 }
    doc.text(`Grand Total: ₹${order.total}`, 10, y)
    y += 8
    doc.text(`Delivery: ${order.deliveryMethod || 'Standard'} | ETA: ${order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString('en-IN') : '3-5 days'}`, 10, y)
    y += 6
    if (order.giftMessage) { doc.text(`Gift Message: ${order.giftMessage}`, 10, y); y += 6 }
    return doc
  }

  const handlePaymentSuccess = async (transactionId?: string) => {
    if (!currentUser || !deliveryAddress) return

    setLoading(true)
    try {
      // Apply coupon if used
      if (appliedCoupon) {
        applyCoupon(appliedCoupon.code)
      }

      // Create order
      const order: Order = {
        id: Date.now().toString(),
        userId: currentUser.id,
        items: cartItems.map(item => ({
          ...item,
          productId: item.id
        })),
        subtotal,
        discount,
        couponCode: appliedCoupon?.code,
        deliveryFee,
        total,
        status: "confirmed",
        paymentMethod: transactionId ? "phonepe" : "cod",
        paymentStatus: transactionId ? "paid" : "pending",
        transactionId,
        deliveryAddress,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
      }

      // Save order
      const orders = getOrders()
      orders.push(order)
      saveOrders(orders)

      // Clear cart
      clearCart()

      // Send WhatsApp notifications
      try {
        const message = AuraveinWhatsAppOrder(order)
        const encodedMessage = encodeURIComponent(message)
        const whatsappUrl = `https://wa.me/919095731884?text=${encodedMessage}`
        window.open(whatsappUrl, "_blank")
        // PDF invoice generation
        const doc = generateInvoicePDF(order)
        const pdfBlob = doc.output("blob")
        const pdfUrl = URL.createObjectURL(pdfBlob)
        toast({
          title: "Invoice Ready",
          description: (
            <a href={pdfUrl} download={`Auravein_Invoice_${order.id}.pdf`} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>
              Download Invoice PDF
            </a>
          ),
          duration: 10000,
        })
      } catch (error) {
        console.error("Failed to send WhatsApp notifications or generate invoice:", error)
      }

      toast({
        title: "Order Placed Successfully!",
        description: "You will receive a confirmation message shortly.",
      })

      // Redirect to order confirmation
      router.push(`/order-confirmation/${order.id}`)
    } catch (error) {
      toast({
        title: "Order Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!currentUser || cartItems.length === 0) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step === "address" ? "bg-black text-white" : "bg-gray-200"
              }`}
            >
              1
            </div>
            <span className={step === "address" ? "font-medium" : "text-gray-500"}>Delivery Address</span>
            <div className="w-12 h-px bg-gray-300" />
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step === "payment" ? "bg-black text-white" : "bg-gray-200"
              }`}
            >
              2
            </div>
            <span className={step === "payment" ? "font-medium" : "text-gray-500"}>Payment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === "address" && <DeliveryAddressForm onSubmit={handleAddressSubmit} loading={loading} />}

            {step === "payment" && deliveryAddress && (
              <div className="space-y-6">
                {/* Address Summary */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Delivery Address</CardTitle>
                      <Button variant="outline" size="sm" onClick={() => setStep("address")}>
                        Change
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="font-medium">{deliveryAddress.name}</p>
                      <p className="text-sm text-gray-600">{deliveryAddress.phone}</p>
                      <p className="text-sm">
                        {deliveryAddress.addressLine1}
                        {deliveryAddress.addressLine2 && `, ${deliveryAddress.addressLine2}`}
                      </p>
                      {deliveryAddress.landmark && (
                        <p className="text-sm text-gray-600">Near: {deliveryAddress.landmark}</p>
                      )}
                      <p className="text-sm">
                        {deliveryAddress.city}, {deliveryAddress.state} - {deliveryAddress.pincode}
                      </p>
                      <Badge variant="secondary" className="w-fit">
                        {deliveryAddress.addressType}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
            
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          Size: {item.size} {item.color && `• ${item.color}`}
                        </p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        {item.description && (
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                        )}
                      </div>
                      <p className="text-sm font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Coupon Section */}
                <div className="space-y-3">
                  {!appliedCoupon ? (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="text-sm"
                      />
                      <Button size="sm" onClick={handleApplyCoupon} disabled={couponLoading || !couponCode.trim()}>
                        <Tag className="w-4 h-4 mr-1" />
                        Apply
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">{appliedCoupon.code}</span>
                      </div>
                      <Button size="sm" variant="ghost" onClick={handleRemoveCoupon}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-₹{discount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span>Delivery Fee</span>
                    <span>
                      {deliveryFee === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        <>₹{deliveryFee}</>
                      )}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>

                {deliveryFee === 0 && subtotal >= 2000 && (
                  <div className="text-xs text-green-600 text-center">🎉 You saved ₹99 on delivery!</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
