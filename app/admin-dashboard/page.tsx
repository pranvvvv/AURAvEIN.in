"use client"
import { useState } from "react"
import AdminLogin from "./AdminLogin"
import Dashboard from "./Dashboard"

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminEmail, setAdminEmail] = useState("")

  const handleLogin = (email: string) => {
    setIsAuthenticated(true)
    setAdminEmail(email)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {!isAuthenticated ? (
        <AdminLogin onLogin={handleLogin} />
      ) : (
        <Dashboard adminEmail={adminEmail} />
      )}
    </div>
  )
}
