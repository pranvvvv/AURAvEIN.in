"use client"
import Image from "next/image"
import Link from "next/link"
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { useState, useRef, useEffect } from "react"
import { toast } from "@/components/ui/use-toast"
import {
  validateCoupon as validateCouponLS,
  calculateDiscount,
  getCoupons
} from "@/lib/localStorage"

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity } = useCart()

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  const [showCheckout, setShowCheckout] = useState(false)
  const [address, setAddress] = useState({
    type: "Home",
    fullName: "",
    phone: "",
    flat: "",
    floor: "",
    area: "",
    landmark: "",
    city: "",
    pincode: "",
  })
  const [addressSaved, setAddressSaved] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [upiId, setUpiId] = useState("")
  const [paymentDone, setPaymentDone] = useState(false)
  const [coupon, setCoupon] = useState("")
  const [couponError, setCouponError] = useState("")
  const [discount, setDiscount] = useState(0)
  const [finalTotal, setFinalTotal] = useState(subtotal)
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Get logged-in user email
    const user = JSON.parse(localStorage.getItem("currentUser") || "null")
    if (user?.email) {
      setUserEmail(user.email)
      // Load saved address for this user
      const saved = JSON.parse(localStorage.getItem(`address_${user.email}`) || "null")
      if (saved) {
        setAddress(saved)
        setAddressSaved(true)
      }
    }
  }, [])

  const handleAddressChange = (e: any) => {
    setAddress({ ...address, [e.target.name]: e.target.value })
  }

  const handleSaveAddress = () => {
    if (!userEmail) return
    localStorage.setItem(`address_${userEmail}`,
      JSON.stringify(address))
    setAddressSaved(true)
    toast({ title: "Address Saved" })
  }

  const handleRemoveAddress = () => {
    if (!userEmail) return
    localStorage.removeItem(`address_${userEmail}`)
    setAddress({
      type: "Home",
      fullName: "",
      phone: "",
      flat: "",
      floor: "",
      area: "",
      landmark: "",
      city: "",
      pincode: "",
    })
    setAddressSaved(false)
    toast({ title: "Address Removed" })
  }

  // Coupon validation (now uses lib/localStorage)
  const validateCoupon = (code: string) => {
    setCouponError("")
    setDiscount(0)
    setFinalTotal(subtotal)
    if (!code) return
    const result = validateCouponLS(code, subtotal)
    if (!result.valid) {
      setCouponError(result.error || "Invalid or expired coupon code.")
      return
    }
    const disc = calculateDiscount(result.coupon!, subtotal)
    setDiscount(disc)
    setFinalTotal(subtotal - disc)
  }

  // Payment QR code UPI link
  const upiLink = `upi://pay?pa=YOUR_UPI_ID&pn=DOPE&am=${finalTotal}&cu=INR` // Replace YOUR_UPI_ID
  const qrApi = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`

  // Payment screenshot upload
  const handleScreenshot = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setScreenshot(ev.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handlePaymentConfirm = () => {
    if (!screenshot) {
      toast({ title: "Please upload payment screenshot." })
      return
    }
    setPaymentDone(true)
    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem("orders") || "[]")
    const order = {
      id: Date.now(),
      items: cartItems,
      address,
      upiId,
      total: subtotal,
      discount,
      finalTotal,
      coupon,
      screenshot,
      status: "Payment Completed",
      createdAt: new Date().toISOString(),
    }
    localStorage.setItem("orders", JSON.stringify([order, ...orders]))
    // WhatsApp message
    const message = `Order Details:%0A${cartItems
      .map(
        (item) => `- ${item.name} (x${item.quantity}): RS. ${item.price * item.quantity}`
      )
      .join("%0A")}%0ATotal: RS. ${subtotal}%0ADiscount: RS. ${discount}%0AFinal: RS. ${finalTotal}%0A---%0AAddress:%0A${address.fullName}, ${address.phone}%0A${address.flat}, ${address.area}, ${address.landmark}%0A${address.city} - ${address.pincode}%0A---%0APayment: Payment Completed%0ACoupon: ${coupon || "-"}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(
      `https://wa.me/919095731884?text=${encodedMessage}`,
      "_blank"
    )
    toast({ title: "Order Placed!", description: "Order details sent to WhatsApp." })
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-gray-300" />
          <h1 className="text-2xl font-medium uppercase tracking-wider mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
          <Button asChild className="uppercase tracking-wider text-xs">
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-medium uppercase tracking-wider mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="border-b pb-2 mb-4 hidden md:grid md:grid-cols-12 text-xs uppercase tracking-wider text-gray-500">
            <div className="md:col-span-6">Product</div>
            <div className="md:col-span-2 text-center">Price</div>
            <div className="md:col-span-2 text-center">Quantity</div>
            <div className="md:col-span-2 text-center">Total</div>
          </div>

          {cartItems.map((item) => (
            <div key={`${item.id}-${item.size}`} className="border-b py-4 grid md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-6 flex gap-4">
                <div className="w-20 h-20 bg-gray-100 relative flex-shrink-0">
                  <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="text-sm font-medium uppercase tracking-wider">{item.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">Size: {item.size}</p>
                  <button
                    onClick={() => removeFromCart(item.id, item.size)}
                    className="text-xs text-red-600 flex items-center mt-2 md:hidden"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Remove
                  </button>
                </div>
              </div>

              <div className="md:col-span-2 text-center">
                <span className="text-sm">RS. {item.price.toLocaleString()}</span>
              </div>

              <div className="md:col-span-2 flex items-center justify-center">
                <div className="flex items-center border">
                  <button
                    onClick={() => updateQuantity(item.id, item.size, Math.max(1, item.quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="md:col-span-2 text-center flex justify-between md:justify-center items-center">
                <span className="text-sm font-medium">RS. {(item.price * item.quantity).toLocaleString()}</span>
                <button
                  onClick={() => removeFromCart(item.id, item.size)}
                  className="text-gray-500 hover:text-red-600 hidden md:block"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="mt-8">
            <Link href="/shop" className="inline-flex items-center text-sm text-gray-600 hover:text-black">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-medium uppercase tracking-wider mb-4">Order Summary</h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>RS. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>RS. {subtotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Coupon Input */}
            <div className="mb-4">
              <input
                type="text"
                value={coupon}
                onChange={e => {
                  setCoupon(e.target.value)
                  validateCoupon(e.target.value)
                }}
                placeholder="Enter coupon code"
                className="w-full px-3 py-2 border rounded text-sm mb-1"
              />
              {couponError && <div className="text-xs text-red-500 mb-1">{couponError}</div>}
              {discount > 0 && (
                <div className="text-xs text-green-600 mb-1">Discount: -RS. {discount}</div>
              )}
            </div>
            {/* Final Total */}
            <div className="flex justify-between font-bold text-lg mb-4">
              <span>Final Total</span>
              <span>RS. {finalTotal.toLocaleString()}</span>
            </div>

            <Button className="w-full uppercase tracking-wider text-xs" onClick={() => setShowCheckout(true)}>Proceed to Checkout</Button>
          </div>
        </div>
      </div>

      {/* Grouped Checkout Modal/Overlay */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-black text-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
            {/* Address Type Selector */}
            <div className="flex gap-2 mb-4">
              {["Home", "Work", "Hotel", "Other"].map(type => (
                <button
                  key={type}
                  type="button"
                  className={`flex-1 py-2 rounded border text-sm font-medium transition ${
                    address.type === type
                      ? "bg-white text-black border-white"
                      : "bg-zinc-900 text-white border-zinc-700"
                  }`}
                  onClick={() => setAddress({ ...address, type })}
                >
                  {type}
                </button>
              ))}
            </div>
            <form className="space-y-3">
              <div className="grid grid-cols-1 gap-3">
                <input name="fullName" value={address.fullName} onChange={handleAddressChange} placeholder="Full Name" className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2 w-full text-white placeholder-gray-400" required />
                <input name="phone" value={address.phone} onChange={handleAddressChange} placeholder="Phone Number" className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2 w-full text-white placeholder-gray-400" required />
                <input name="flat" value={address.flat} onChange={handleAddressChange} placeholder="Flat / House Number / Building Name" className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2 w-full text-white placeholder-gray-400" required />
                <input name="floor" value={address.floor} onChange={handleAddressChange} placeholder="Floor (Optional)" className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2 w-full text-white placeholder-gray-400" />
                <input name="area" value={address.area} onChange={handleAddressChange} placeholder="Area / Sector / Locality" className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2 w-full text-white placeholder-gray-400" required />
                <input name="landmark" value={address.landmark} onChange={handleAddressChange} placeholder="Nearby Landmark (Optional)" className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2 w-full text-white placeholder-gray-400" />
                <input name="city" value={address.city} onChange={handleAddressChange} placeholder="City (Optional)" className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2 w-full text-white placeholder-gray-400" />
                <input name="pincode" value={address.pincode} onChange={handleAddressChange} placeholder="Pincode" className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2 w-full text-white placeholder-gray-400" required />
              </div>
              <div className="flex gap-2 mt-2">
                <Button type="button" className="w-full mt-5" color="black" onClick={handleSaveAddress}>Save Address</Button>
                {addressSaved && (
                  <Button type="button" className="flex-1 bg-zinc-900 border border-zinc-700" onClick={handleRemoveAddress}>Delete</Button>
                )}
              </div>
            </form>
            {/* Proceed to Payment */}
            {addressSaved && (
              <Button
                className="w-full mt-6 bg-green-600 text-white font-bold"
                onClick={() => {
                  // WhatsApp message generation with all details
                  const addressLines = [
                    `*Address Type:* ${address.type}`,
                    `*Name:* ${address.fullName}`,
                    `*Phone:* ${address.phone}`,
                    `*Address:* ${address.flat}`,
                    address.floor && `*Floor:* ${address.floor}`,
                    `*Area:* ${address.area}`,
                    address.landmark && `*Landmark:* ${address.landmark}`,
                    address.city && `*City:* ${address.city}`,
                    `*Pincode:* ${address.pincode}`
                  ].filter(Boolean).join("%0A");
                  const itemsList = cartItems
                    .map(item => `- ${item.name} x${item.quantity} (₹${item.price * item.quantity})`)
                    .join("%0A");
                  const message = `ORDER DETAILS:%0A%0A*ITEMS*%0A${itemsList}%0A%0A*ADDRESS*%0A${addressLines}%0A%0A*TOTAL*: ₹${finalTotal}%0A*DISCOUNT*: ₹${discount}%0A*FINAL PAYABLE*: ₹${finalTotal}`;
                  const encodedMessage = encodeURIComponent(message);
                  window.open(
                    `https://wa.me/919095731884?text=${encodedMessage}`,
                    "_blank"
                  );
                }}
              >
                SEND DETAILS TO WHATSAPP
              </Button>
            )}
            <Button className="w-full mt-5" color="black" onClick={() => setShowCheckout(false)}>Cancel</Button>
          </div>
        </div>
      )}
    </div>
  )
}
