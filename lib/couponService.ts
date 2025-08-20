// lib/couponService.ts
// Simple coupon service that works with our API endpoints

export interface Coupon {
  id: string
  code: string
  name: string
  description: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  maxDiscount?: number
  minOrderAmount?: number
  maxUsage?: number
  usedCount?: number
  expiryDate?: string
  isActive: boolean
  createdAt: Date
  updatedAt?: Date
}

export const getCoupons = async (): Promise<Coupon[]> => {
  try {
    const res = await fetch('/api/coupons');
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch (e) {
    console.error('Failed to load coupons:', e);
    return [];
  }
};

export const addCoupon = async (couponData: Omit<Coupon, 'id' | 'createdAt'>): Promise<Coupon> => {
  try {
    const res = await fetch('/api/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(couponData)
    });
    
    if (!res.ok) throw new Error('Failed to add coupon');
    
    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error adding coupon: ", error);
    throw error;
  }
};

export const updateCoupon = async (couponId: string, couponData: Partial<Coupon>): Promise<Coupon> => {
  try {
    const res = await fetch(`/api/coupons`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _id: couponId, ...couponData })
    });
    
    if (!res.ok) throw new Error('Failed to update coupon');
    
    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error updating coupon: ", error);
    throw error;
  }
};

export const deleteCoupon = async (couponId: string): Promise<boolean> => {
  try {
    const res = await fetch(`/api/coupons`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _id: couponId })
    });
    
    if (!res.ok) throw new Error('Failed to delete coupon');
    
    return true;
  } catch (error) {
    console.error("Error deleting coupon: ", error);
    throw error;
  }
}; 