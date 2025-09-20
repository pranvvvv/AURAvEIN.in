import { useState, useEffect } from "react";

export function useCoupons() {
  const [coupons, setCoupons] = useState<any[]>([]);

  useEffect(() => {
    const local = localStorage.getItem("coupons");
    if (local) {
      setCoupons(JSON.parse(local));
    } else {
      fetch("/api/coupons")
        .then(res => res.json())
        .then(data => {
          setCoupons(data);
          localStorage.setItem("coupons", JSON.stringify(data));
        });
    }
  }, []);

  const addCoupon = async (coupon: any) => {
    const newCoupon = { ...coupon, id: Date.now().toString() };
    const updated = [...coupons, newCoupon];
    setCoupons(updated);
    localStorage.setItem("coupons", JSON.stringify(updated));
    await fetch("/api/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCoupon),
    });
  };

  const updateCoupon = async (id: string, updates: any) => {
    const updated = coupons.map(c => (c.id === id ? { ...c, ...updates } : c));
    setCoupons(updated);
    localStorage.setItem("coupons", JSON.stringify(updated));
    await fetch("/api/coupons", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: id, ...updates }),
    });
  };

  const deleteCoupon = async (id: string) => {
    const updated = coupons.filter(c => c.id !== id);
    setCoupons(updated);
    localStorage.setItem("coupons", JSON.stringify(updated));
    await fetch("/api/coupons", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: id }),
    });
  };

  return { coupons, addCoupon, updateCoupon, deleteCoupon };
}