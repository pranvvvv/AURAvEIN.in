
"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingBag, User, Menu, X, Search, Heart, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { TopAnnouncementBar } from "./TopAnnouncementBar"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { cartItems, getCartItemCount } = useCart()
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/")
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <>
      <TopAnnouncementBar />
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="sr-only">AURAvEIN Home</span>
           <img
  src="/svj logo.png"
  alt="AURAvEIN Logo"
  className="w-20 h-30 object-contain"
/>

              <span className="text-lg sm:text-xl lg:text-2xl font-bold tracking-wider hidden sm:inline"></span>
            </Link>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <Link href="/" className="text-sm font-medium hover:text-gray-600 transition-colors">HOME</Link>
              <Link href="/shop" className="text-sm font-medium hover:text-gray-600 transition-colors">SHOP</Link>
              <Link href="/about" className="text-sm font-medium hover:text-gray-600 transition-colors">ABOUT</Link>
              <Link href="/contact" className="text-sm font-medium hover:text-gray-600 transition-colors">CONTACT</Link>
            </nav>
            {/* Right Side Icons */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button variant="ghost" size="sm" className="hidden md:flex p-2">
                <Search className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="hidden md:flex p-2">
                <Heart className="w-4 h-4" />
              </Button>
              {isAuthenticated ? (
                <div className="hidden md:flex items-center space-x-2">
                  {isAdmin ? (
                    <Link href="/admin">
                      <Button variant="ghost" size="sm" className="text-xs">
                        <User className="w-4 h-4 mr-1" />
                        Admin Panel
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/dashboard">
                      <Button variant="ghost" size="sm" className="text-xs">
                        <User className="w-4 h-4 mr-1" />
                        {user?.name || 'Dashboard'}
                      </Button>
                    </Link>
                  )}
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="text-xs">
                    <LogOut className="w-4 h-4 mr-1" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Link href="/login" className="hidden md:block">
                  <Button variant="ghost" size="sm" className="text-xs">
                    <User className="w-4 h-4 mr-1" />
                    LOGIN
                  </Button>
                </Link>
              )}
              <Link href="/cart">
                <Button variant="ghost" size="sm" className="relative p-2">
                  <ShoppingBag className="w-4 h-4" />
                  {getCartItemCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs">
                      {getCartItemCount()}
                    </span>
                  )}
                </Button>
              </Link>
              {/* Mobile Menu Button */}
              <Button variant="ghost" size="sm" className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t bg-white">
              <nav className="flex flex-col space-y-3 py-4 px-2">
                <Link href="/" className="text-sm font-medium hover:text-gray-600 transition-colors py-2" onClick={() => setIsMenuOpen(false)}>HOME</Link>
                <Link href="/shop" className="text-sm font-medium hover:text-gray-600 transition-colors py-2" onClick={() => setIsMenuOpen(false)}>SHOP</Link>
                <Link href="/about" className="text-sm font-medium hover:text-gray-600 transition-colors py-2" onClick={() => setIsMenuOpen(false)}>ABOUT</Link>
                <Link href="/contact" className="text-sm font-medium hover:text-gray-600 transition-colors py-2" onClick={() => setIsMenuOpen(false)}>CONTACT</Link>
                <div className="border-t pt-3 mt-2">
                  {isAuthenticated ? (
                    <div className="space-y-2">
                      {isAdmin ? (
                        <Link href="/admin" onClick={() => setIsMenuOpen(false)}>
                          <Button variant="ghost" size="sm" className="w-full justify-start text-sm py-2">
                            <User className="w-4 h-4 mr-2" />
                            Admin Panel
                          </Button>
                        </Link>
                      ) : (
                        <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                          <Button variant="ghost" size="sm" className="w-full justify-start text-sm py-2">
                            <User className="w-4 h-4 mr-2" />
                            {user?.name || 'Dashboard'}
                          </Button>
                        </Link>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-sm py-2"
                        onClick={() => {
                          handleLogout()
                          setIsMenuOpen(false)
                        }}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full justify-start text-sm py-2">
                        <User className="w-4 h-4 mr-2" />
                        LOGIN
                      </Button>
                    </Link>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  )
}
