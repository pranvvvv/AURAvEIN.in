"use client"
import { useState } from "react"
import ProductManager from "./ProductManager"
import CouponManager from "./CouponManager"
import AnalyticsDashboard from "./AnalyticsDashboard"
import InventoryTracker from "./InventoryTracker"
import OrderManager from "./OrderManager"
import UserManager from "./UserManager"

export default function Dashboard({ adminEmail }: { adminEmail: string }) {
  const [section, setSection] = useState("analytics")
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-black text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <span className="text-sm">{adminEmail}</span>
      </header>
      <nav className="bg-white shadow flex gap-2 px-4 py-2 overflow-x-auto">
        <button className={`px-3 py-1 rounded ${section==="analytics"?"bg-black text-white":"bg-gray-100"}`} onClick={()=>setSection("analytics")}>Analytics</button>
        <button className={`px-3 py-1 rounded ${section==="products"?"bg-black text-white":"bg-gray-100"}`} onClick={()=>setSection("products")}>Products</button>
        <button className={`px-3 py-1 rounded ${section==="coupons"?"bg-black text-white":"bg-gray-100"}`} onClick={()=>setSection("coupons")}>Coupons</button>
        <button className={`px-3 py-1 rounded ${section==="inventory"?"bg-black text-white":"bg-gray-100"}`} onClick={()=>setSection("inventory")}>Inventory</button>
        <button className={`px-3 py-1 rounded ${section==="orders"?"bg-black text-white":"bg-gray-100"}`} onClick={()=>setSection("orders")}>Orders</button>
        <button className={`px-3 py-1 rounded ${section==="users"?"bg-black text-white":"bg-gray-100"}`} onClick={()=>setSection("users")}>Users</button>
      </nav>
      <main className="flex-1 p-4 bg-gray-50">
        {section === "analytics" && <AnalyticsDashboard />}
        {section === "products" && <ProductManager />}
        {section === "coupons" && <CouponManager />}
        {section === "inventory" && <InventoryTracker />}
        {section === "orders" && <OrderManager />}
        {section === "users" && <UserManager />}
      </main>
    </div>
  )
}
