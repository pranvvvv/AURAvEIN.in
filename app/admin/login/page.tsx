"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { loginUser } from "@/lib/localStorage"
import { toast } from "@/components/ui/use-toast"

export default function AdminLogin() {
  const router = useRouter();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)

  // Block access if already logged in as admin
  React.useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("dope_current_user") || "null")
    if (currentUser && currentUser.isAdmin) {
      router.push("/admin")
    }
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    })
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Properly type the credentials
      const credentials = {
        email: loginData.email,
        password: loginData.password
      }
      const user = loginUser(credentials)

      if (user && user.isAdmin) {
        toast({
          title: "Login Successful",
          description: "Welcome to admin dashboard!",
        })
        router.push("/admin")      // Redirect to admin dashboard
      } else if (user && !user.isAdmin) {
        toast({
          title: "Access Denied",
          description: "You do not have admin privileges.",
          variant: "destructive",
        })
        router.push("/dashboard")          // Redirect to user dashboard
      } else {
        toast({
          title: "Access Denied",
          description: "Invalid admin credentials.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Please check your credentials.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={loginData.email}
                onChange={handleInputChange}
                required
                placeholder="admin@dope.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={loginData.password}
                onChange={handleInputChange}
                required
                placeholder="Enter admin password"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}       
            </Button>
          </form>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Admin Credentials:</strong>
              <br />
              Email: shivapranav432@gmail.com
              <br />
              Password: auravein282007
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
