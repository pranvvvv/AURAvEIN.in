"use client"
import { useState, useEffect } from 'react'
import { 
  addCoupon, 
  getCoupons, 
  updateCoupon, 
  deleteCoupon,
  type Coupon
} from '@/lib/couponService'
import { Trash2, Edit, Plus, X, Check } from 'lucide-react'

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 0,
    maxDiscount: 0,
    minOrderAmount: 0,
    maxUsage: 0,
    expiryDate: '',
    isActive: true
  })

  useEffect(() => {
    loadCoupons()
  }, [])

  const loadCoupons = async () => {
    try {
      const couponsData = await getCoupons()
      setCoupons(couponsData)
    } catch (error) {
      console.error('Error loading coupons:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const couponData = {
        ...formData,
        discountValue: Number(formData.discountValue),
        maxDiscount: Number(formData.maxDiscount) || undefined,
        minOrderAmount: Number(formData.minOrderAmount) || undefined,
        maxUsage: Number(formData.maxUsage) || undefined,
        expiryDate: formData.expiryDate || undefined,
        usedCount: editingCoupon?.usedCount || 0
      }

      if (editingCoupon) {
        await updateCoupon(editingCoupon.id, couponData)
      } else {
        await addCoupon(couponData)
      }

      setShowForm(false)
      setEditingCoupon(null)
      resetForm()
      loadCoupons()
    } catch (error) {
      console.error('Error saving coupon:', error)
    }
  }

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon)
    setFormData({
      code: coupon.code,
      name: coupon.name,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      maxDiscount: coupon.maxDiscount || 0,
      minOrderAmount: coupon.minOrderAmount || 0,
      maxUsage: coupon.maxUsage || 0,
      expiryDate: coupon.expiryDate || '',
      isActive: coupon.isActive
    })
    setShowForm(true)
  }

  const handleDelete = async (couponId: string) => {
    if (confirm('Are you sure you want to delete this coupon?')) {
      try {
        await deleteCoupon(couponId)
        loadCoupons()
      } catch (error) {
        console.error('Error deleting coupon:', error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      description: '',
      discountType: 'percentage',
      discountValue: 0,
      maxDiscount: 0,
      minOrderAmount: 0,
      maxUsage: 0,
      expiryDate: '',
      isActive: true
    })
  }

  const generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setFormData(prev => ({ ...prev, code: result }))
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Coupon Management</h1>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingCoupon(null)
            resetForm()
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={20} />
          Add Coupon
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false)
                  setEditingCoupon(null)
                  resetForm()
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Coupon Code</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={generateCouponCode}
                  className="mt-6 px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Generate
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2 border rounded"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Discount Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      discountType: e.target.value as 'percentage' | 'fixed' 
                    }))}
                    className="w-full p-2 border rounded"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    {formData.discountType === 'percentage' ? 'Discount %' : 'Discount Amount (₹)'}
                  </label>
                  <input
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => setFormData(prev => ({ ...prev, discountValue: Number(e.target.value) }))}
                    className="w-full p-2 border rounded"
                    min="0"
                    max={formData.discountType === 'percentage' ? 100 : undefined}
                    required
                  />
                </div>
              </div>

              {formData.discountType === 'percentage' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Max Discount (₹)</label>
                  <input
                    type="number"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxDiscount: Number(e.target.value) }))}
                    className="w-full p-2 border rounded"
                    min="0"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Minimum Order Amount (₹)</label>
                <input
                  type="number"
                  value={formData.minOrderAmount}
                  onChange={(e) => setFormData(prev => ({ ...prev, minOrderAmount: Number(e.target.value) }))}
                  className="w-full p-2 border rounded"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Maximum Usage</label>
                <input
                  type="number"
                  value={formData.maxUsage}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxUsage: Number(e.target.value) }))}
                  className="w-full p-2 border rounded"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded"
                />
                <label htmlFor="isActive" className="text-sm font-medium">Active</label>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  {editingCoupon ? 'Update Coupon' : 'Add Coupon'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingCoupon(null)
                    resetForm()
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {coupons.map((coupon) => (
          <div key={coupon.id} className="border rounded-lg p-4 bg-white">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-lg">{coupon.code}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {coupon.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900">{coupon.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{coupon.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Discount:</span>
                    <span className="ml-1">
                      {coupon.discountType === 'percentage' 
                        ? `${coupon.discountValue}%` 
                        : `₹${coupon.discountValue}`
                      }
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Min Order:</span>
                    <span className="ml-1">
                      {coupon.minOrderAmount ? `₹${coupon.minOrderAmount}` : 'No minimum'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Usage:</span>
                    <span className="ml-1">
                      {coupon.usedCount || 0}/{coupon.maxUsage || '∞'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Expires:</span>
                    <span className="ml-1">
                      {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : 'No expiry'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(coupon)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(coupon.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {coupons.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No coupons found. Create your first coupon to get started.
          </div>
        )}
      </div>
    </div>
  )
} 