"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Eye, EyeOff, Shield, Mail } from "lucide-react"

// Simple admin credentials - in production, use proper authentication
const ADMIN_CREDENTIALS = [
  { email: "shivapranav432@gmail.com", password: "auraveinofficial03", name: "Admin User" },
  { email: "admin@auravein.com", password: "admin123", name: "Default Admin" }
]

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)

    try {
      // Check against admin credentials
      const adminUser = ADMIN_CREDENTIALS.find(
        admin => admin.email.toLowerCase() === email.toLowerCase() && admin.password === password
      )

      if (adminUser) {
        // Store admin session
        const adminSession = {
          id: Date.now().toString(),
          name: adminUser.name,
          email: adminUser.email,
          isAdmin: true,
          role: 'admin',
          loginTime: new Date().toISOString()
        }
        
        localStorage.setItem('adminSession', JSON.stringify(adminSession))
        
        toast({
          title: "Login Successful",
          description: `Welcome back, ${adminUser.name}!`,
        })
        
        // Redirect to admin dashboard
        router.push("/admin")
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password. Please check your admin credentials.",
          variant: "destructive"
        })
      }
    } catch (error: any) {
      console.error("Login error:", error)
      toast({
        title: "Login Failed",
        description: "An error occurred during login. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <p className="text-gray-600 text-sm">
            Access the admin dashboard
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@auravein.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <div className="bg-blue-50 p-3 rounded-lg">
        
            </div>
          </div>

          <div className="mt-4 text-center">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-800">
              ← Back to User Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}