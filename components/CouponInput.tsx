"use client"
import { useState } from 'react'
import { validateCoupon } from '@/lib/firebaseService'
import { Tag, Check, X } from 'lucide-react'

interface CouponInputProps {
  cartTotal: number
  onCouponApplied: (coupon: any) => void
  onCouponRemoved: () => void
  appliedCoupon?: any
}

export default function CouponInput({ 
  cartTotal, 
  onCouponApplied, 
  onCouponRemoved, 
  appliedCoupon 
}: CouponInputProps) {
  const [couponCode, setCouponCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setMessage('Please enter a coupon code')
      setMessageType('error')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const result = await validateCoupon(couponCode.toUpperCase(), cartTotal)
      
      if (result.valid) {
        setMessage(result.message)
        setMessageType('success')
        onCouponApplied(result.coupon)
        setCouponCode('')
      } else {
        setMessage(result.message)
        setMessageType('error')
      }
    } catch (error) {
      setMessage('Error applying coupon')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveCoupon = () => {
    onCouponRemoved()
    setMessage('')
    setMessageType('')
  }

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <Tag size={20} />
        Apply Coupon
      </h3>

      {appliedCoupon ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-green-800">
                Coupon: {appliedCoupon.code}
              </p>
              <p className="text-sm text-green-600">
                {appliedCoupon.discountType === 'percentage' 
                  ? `${appliedCoupon.discountValue}% off` 
                  : `₹${appliedCoupon.discountValue} off`
                }
              </p>
              <p className="text-sm text-green-600">
                Discount: ₹{appliedCoupon.discountAmount?.toFixed(2)}
              </p>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="text-green-600 hover:text-green-800"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            placeholder="Enter coupon code"
            className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          <button
            onClick={handleApplyCoupon}
            disabled={loading || !couponCode.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Check size={16} />
            )}
            Apply
          </button>
        </div>
      )}

      {message && (
        <div className={`p-2 rounded text-sm ${
          messageType === 'success' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {message}
        </div>
      )}
    </div>
  )
} 