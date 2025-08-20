"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import Image from "next/image"
import Link from "next/link"
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { useState, useRef } from "react"
import { toast } from "@/components/ui/use-toast"
import CouponInput from "@/components/CouponInput"

export default function Cart() {
  const router = useRouter()
  const { user, loading, isAuthenticated } = useAuth()
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal, 
    getCartItemCount,
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    getFinalTotal,
    getDiscountAmount
  } = useCart()

  const subtotal = getCartTotal()
  const discount = getDiscountAmount()
  const finalTotal = getFinalTotal()
  const itemCount = getCartItemCount()

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
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Delivery Details Form State
  const [deliveryDetails, setDeliveryDetails] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    zipCode: ""
  })

  // Remove authentication requirement for cart page
  // Users can view cart without logging in

  useEffect(() => {
    // Get logged-in user email if authenticated
    if (isAuthenticated && user?.email) {
      setUserEmail(user.email)
      setDeliveryDetails(prev => ({ ...prev, email: user.email }))
      // Load saved address for this user
      const saved = JSON.parse(localStorage.getItem(`address_${user.email}`) || "null")
      if (saved) {
        setAddress(saved)
        setAddressSaved(true)
      }
    }
  }, [isAuthenticated, user])

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value })
  }

  const handleDeliveryDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDeliveryDetails({ ...deliveryDetails, [e.target.name]: e.target.value })
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
    const orders = JSON.parse(localStorage.getItem("dope_orders") || "[]")
    const order = {
      id: Date.now(),
      items: cartItems,
      address,
      upiId,
      total: subtotal,
      discount,
      finalTotal,
      coupon: appliedCoupon?.code || null,
      screenshot,
      status: "Payment Completed",
      createdAt: new Date().toISOString(),
    }
    localStorage.setItem("dope_orders", JSON.stringify([order, ...orders]))
    // WhatsApp message
    const message = `Order Details:%0A${cartItems
      .map(
        (item) => `- ${item.name} (x${item.quantity}): RS. ${item.price * item.quantity}`
      )
      .join("%0A")}%0ATotal: RS. ${subtotal}%0ADiscount: RS. ${discount}%0AFinal: RS. ${finalTotal}%0A---%0AAddress:%0A${address.fullName}, ${address.phone}%0A${address.flat}, ${address.area}, ${address.landmark}%0A${address.city} - ${address.pincode}%0A---%0APayment: Payment Completed%0ACoupon: ${appliedCoupon?.code || "-"}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(
      `https://wa.me/919095731884?text=${encodedMessage}`,
      "_blank"
    )
    toast({ title: "Order Placed!", description: "Order details sent to WhatsApp." })
  }

  // WhatsApp Checkout Function
  const handleWhatsAppCheckout = () => {
    // Validate delivery details
    if (!deliveryDetails.fullName || !deliveryDetails.email || !deliveryDetails.phoneNumber || !deliveryDetails.address || !deliveryDetails.city || !deliveryDetails.state || !deliveryDetails.zipCode) {
      toast({ 
        title: "Please fill all delivery details", 
        description: "All fields are required for checkout.",
        variant: "destructive"
      })
      return
    }

    // Format cart items
    const itemsList = cartItems
      .map(item => `• ${item.name} (Size: ${item.size}${item.color && item.color !== "Default" ? `, Color: ${item.color}` : ''}) x${item.quantity} - ₹${item.price * item.quantity}`)
      .join("%0A")

    // Format delivery details
    const deliveryInfo = [
      `*DELIVERY DETAILS*`,
      `Name: ${deliveryDetails.fullName}`,
      `Email: ${deliveryDetails.email}`,
      `Phone: ${deliveryDetails.phoneNumber}`,
      `Address: ${deliveryDetails.address}`,
      `City: ${deliveryDetails.city}`,
      `State: ${deliveryDetails.state}`,
      `ZIP Code: ${deliveryDetails.zipCode}`
    ].join("%0A")

    // Create WhatsApp message
    const message = [
      `*NEW ORDER REQUEST*`,
      ``,
      `*CART ITEMS*`,
      itemsList,
      ``,
      `*ORDER SUMMARY*`,
      `Subtotal: ₹${subtotal.toLocaleString()}`,
      `Discount: ₹${discount.toLocaleString()}`,
      `Final Total: ₹${finalTotal.toLocaleString()}`,
      `Coupon Used: ${appliedCoupon?.code || "None"}`,
      ``,
      deliveryInfo
    ].join("%0A")

    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/919059731884?text=${encodedMessage}`, "_blank")
    
    toast({ 
      title: "Order details sent to WhatsApp!", 
      description: "We'll contact you shortly to confirm your order." 
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
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
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-2">
        <h1 className="text-xl sm:text-2xl font-medium uppercase tracking-wider">Shopping Cart</h1>
        <div className="text-sm text-gray-600">
          {itemCount} {itemCount === 1 ? 'item' : 'items'} • RS. {subtotal.toLocaleString()}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2">
          <div className="border-b pb-2 mb-4 hidden md:grid md:grid-cols-12 text-xs uppercase tracking-wider text-gray-500">
            <div className="md:col-span-6">Product</div>
            <div className="md:col-span-2 text-center">Price</div>
            <div className="md:col-span-2 text-center">Quantity</div>
            <div className="md:col-span-2 text-center">Total</div>
          </div>

          {cartItems.map((item) => (
            <div key={`${item.id}-${item.size}`} className="border-b py-3 sm:py-4 grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-start md:items-center">
              <div className="md:col-span-6 flex gap-3 sm:gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 relative flex-shrink-0 rounded">
                  <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover rounded" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium uppercase tracking-wider truncate">{item.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Size: {item.size}
                    {item.color && item.color !== "Default" && ` • Color: ${item.color}`}
                    {item.category && ` • ${item.category}`}
                  </p>
                  {item.originalPrice && item.originalPrice > item.price && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs line-through text-gray-400">
                        RS. {item.originalPrice.toLocaleString()}
                      </span>
                      {item.discount && (
                        <span className="text-xs bg-green-100 text-green-800 px-1 rounded">
                          -{item.discount}%
                        </span>
                      )}
                    </div>
                  )}
                  <button
                    onClick={() => removeFromCart(item.id, item.size, item.color)}
                    className="text-xs text-red-600 flex items-center mt-2 md:hidden"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Remove
                  </button>
                </div>
              </div>

              {/* Mobile layout for price, quantity, total */}
              <div className="md:hidden flex justify-between items-center mt-3">
                <div className="flex items-center gap-4">
                  <span className="text-sm">RS. {item.price.toLocaleString()}</span>
                  <div className="flex items-center border rounded">
                    <button
                      onClick={() => updateQuantity(item.id, item.size, Math.max(1, item.quantity - 1), item.color)}
                      className="w-7 h-7 flex items-center justify-center hover:bg-gray-100"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.size, item.quantity + 1, item.color)}
                      className="w-7 h-7 flex items-center justify-center hover:bg-gray-100"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <span className="text-sm font-medium">RS. {(item.price * item.quantity).toLocaleString()}</span>
              </div>

              {/* Desktop layout */}
              <div className="hidden md:contents">
                <div className="md:col-span-2 text-center">
                  <span className="text-sm">RS. {item.price.toLocaleString()}</span>
                </div>

                <div className="md:col-span-2 flex items-center justify-center">
                  <div className="flex items-center border rounded">
                    <button
                      onClick={() => updateQuantity(item.id, item.size, Math.max(1, item.quantity - 1), item.color)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.size, item.quantity + 1, item.color)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2 text-center flex justify-between md:justify-center items-center">
                  <span className="text-sm font-medium">RS. {(item.price * item.quantity).toLocaleString()}</span>
                  <button
                    onClick={() => removeFromCart(item.id, item.size, item.color)}
                    className="text-gray-500 hover:text-red-600 hidden md:block"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

                    <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <Link href="/shop" className="inline-flex items-center text-sm text-gray-600 hover:text-black">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
            {cartItems.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to clear your cart?')) {
                    clearCart()
                    toast({
                      title: "Cart Cleared",
                      description: "All items have been removed from your cart.",
                    })
                  }
                }}
                className="text-sm text-red-600 hover:text-red-700 text-left sm:text-right"
              >
                Clear Cart
              </button>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
            <h2 className="text-base sm:text-lg font-medium uppercase tracking-wider mb-4">Order Summary</h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Items ({itemCount})</span>
                <span>{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>RS. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span className="text-xs sm:text-sm">Calculated at checkout</span>
              </div>
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>RS. {subtotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Coupon Input */}
            <CouponInput
              cartTotal={subtotal}
              onCouponApplied={applyCoupon}
              onCouponRemoved={removeCoupon}
              appliedCoupon={appliedCoupon}
            />

            {/* Delivery Details Form */}
            <div className="mb-6 p-4 bg-white rounded border">
              <h3 className="text-sm font-medium uppercase tracking-wider mb-3">Delivery Details</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  name="fullName"
                  value={deliveryDetails.fullName}
                  onChange={handleDeliveryDetailsChange}
                  placeholder="Full Name"
                  className="w-full px-3 py-2 border rounded text-sm form-input"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={deliveryDetails.email}
                  onChange={handleDeliveryDetailsChange}
                  placeholder="Email"
                  className="w-full px-3 py-2 border rounded text-sm form-input"
                  required
                />
                <input
                  type="tel"
                  name="phoneNumber"
                  value={deliveryDetails.phoneNumber}
                  onChange={handleDeliveryDetailsChange}
                  placeholder="Phone Number"
                  className="w-full px-3 py-2 border rounded text-sm form-input"
                  required
                />
                <textarea
                  name="address"
                  value={deliveryDetails.address}
                  onChange={handleDeliveryDetailsChange}
                  placeholder="Address"
                  rows={3}
                  className="w-full px-3 py-2 border rounded text-sm resize-none form-input"
                  required
                />
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    name="city"
                    value={deliveryDetails.city}
                    onChange={handleDeliveryDetailsChange}
                    placeholder="City"
                    className="w-full px-3 py-2 border rounded text-sm form-input"
                    required
                  />
                  <input
                    type="text"
                    name="state"
                    value={deliveryDetails.state}
                    onChange={handleDeliveryDetailsChange}
                    placeholder="State"
                    className="w-full px-3 py-2 border rounded text-sm form-input"
                    required
                  />
                  <input
                    type="text"
                    name="zipCode"
                    value={deliveryDetails.zipCode}
                    onChange={handleDeliveryDetailsChange}
                    placeholder="ZIP Code"
                    className="w-full px-3 py-2 border rounded text-sm form-input"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Final Total */}
            <div className="flex justify-between font-bold text-lg mb-4">
              <span>Final Total</span>
              <span>RS. {finalTotal.toLocaleString()}</span>
            </div>

            {/* WhatsApp Checkout Button */}
            <Button 
              className="w-full uppercase tracking-wider text-xs bg-green-600 hover:bg-green-700 text-white mb-3 whatsapp-pulse" 
              onClick={handleWhatsAppCheckout}
            >
              Checkout For Payment
               ( via WhatsApp )
            </Button>

           
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
