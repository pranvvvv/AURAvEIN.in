"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Home, Building, MapPinIcon } from "lucide-react"
import type { DeliveryAddress } from "@/lib/localStorage"

interface DeliveryAddressFormProps {
  onSubmit: (address: DeliveryAddress) => void
  initialAddress?: DeliveryAddress
  loading?: boolean
}

const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Puducherry",
]

export default function DeliveryAddressForm({ onSubmit, initialAddress, loading }: DeliveryAddressFormProps) {
  const [address, setAddress] = useState<DeliveryAddress>(
    initialAddress || {
      name: "",
      phone: "",
      email: "",
      addressLine1: "",
      addressLine2: "",
      landmark: "",
      city: "",
      state: "",
      pincode: "",
      addressType: "home",
    },
  )

  const [errors, setErrors] = useState<Partial<DeliveryAddress>>({})

  const handleChange = (field: keyof DeliveryAddress, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<DeliveryAddress> = {}

    if (!address.name.trim()) newErrors.name = "Name is required"
    if (!address.phone.trim()) newErrors.phone = "Phone number is required"
    else if (!/^[+]?[0-9]{10,15}$/.test(address.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid phone number"
    }
    if (!address.email.trim()) newErrors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    if (!address.addressLine1.trim()) newErrors.addressLine1 = "Address is required"
    if (!address.city.trim()) newErrors.city = "City is required"
    if (!address.state.trim()) newErrors.state = "State is required"
    if (!address.pincode.trim()) newErrors.pincode = "Pincode is required"
    else if (!/^[0-9]{6}$/.test(address.pincode)) {
      newErrors.pincode = "Please enter a valid 6-digit pincode"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(address)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Delivery Address
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Contact Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Full Name *
                </label>
                <Input
                  id="name"
                  value={address.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Enter your full name"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  Phone Number *
                </label>
                <Input
                  id="phone"
                  value={address.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+91 9876543210"
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address *
              </label>
              <Input
                id="email"
                type="email"
                value={address.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="your.email@example.com"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Address Information</h3>

            <div>
              <label htmlFor="addressLine1" className="block text-sm font-medium mb-2">
                Address Line 1 *
              </label>
              <Input
                id="addressLine1"
                value={address.addressLine1}
                onChange={(e) => handleChange("addressLine1", e.target.value)}
                placeholder="House/Flat No., Building Name, Street"
                className={errors.addressLine1 ? "border-red-500" : ""}
              />
              {errors.addressLine1 && <p className="text-red-500 text-xs mt-1">{errors.addressLine1}</p>}
            </div>

            <div>
              <label htmlFor="addressLine2" className="block text-sm font-medium mb-2">
                Address Line 2 (Optional)
              </label>
              <Input
                id="addressLine2"
                value={address.addressLine2}
                onChange={(e) => handleChange("addressLine2", e.target.value)}
                placeholder="Area, Sector, Locality"
              />
            </div>

            <div>
              <label htmlFor="landmark" className="block text-sm font-medium mb-2">
                Landmark (Optional)
              </label>
              <Input
                id="landmark"
                value={address.landmark}
                onChange={(e) => handleChange("landmark", e.target.value)}
                placeholder="Near Metro Station, Mall, etc."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium mb-2">
                  City *
                </label>
                <Input
                  id="city"
                  value={address.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  placeholder="Enter city"
                  className={errors.city ? "border-red-500" : ""}
                />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium mb-2">
                  State *
                </label>
                <Select value={address.state} onValueChange={(value) => handleChange("state", value)}>
                  <SelectTrigger className={errors.state ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {indianStates.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
              </div>

              <div>
                <label htmlFor="pincode" className="block text-sm font-medium mb-2">
                  Pincode *
                </label>
                <Input
                  id="pincode"
                  value={address.pincode}
                  onChange={(e) => handleChange("pincode", e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  className={errors.pincode ? "border-red-500" : ""}
                />
                {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
              </div>
            </div>
          </div>

          {/* Address Type */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Address Type</h3>
            <div className="flex gap-4">
              {[
                { value: "home", label: "Home", icon: Home },
                { value: "office", label: "Office", icon: Building },
                { value: "other", label: "Other", icon: MapPinIcon },
              ].map(({ value, label, icon: Icon }) => (
                <Button
                  key={value}
                  type="button"
                  variant={address.addressType === value ? "default" : "outline"}
                  onClick={() => handleChange("addressType", value as DeliveryAddress["addressType"])}
                  className="flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Button>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving Address..." : "Save & Continue"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
