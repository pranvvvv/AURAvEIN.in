"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function NewsletterPopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [email, setEmail] = useState("")

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    // Check if popup has been shown before
    const hasSeenPopup = localStorage.getItem('newsletter-popup-shown')
    const lastShownTime = localStorage.getItem('newsletter-popup-last-shown')
    
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsVisible(true)
        // Record when popup was shown
        localStorage.setItem('newsletter-popup-last-shown', Date.now().toString())
      }, 5000) // Show after 5 seconds

      return () => clearTimeout(timer)
    } else if (lastShownTime) {
      // If popup was shown before, check if 24 hours have passed
      const lastShown = parseInt(lastShownTime)
      const twentyFourHours = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
      
      if (Date.now() - lastShown > twentyFourHours) {
        // Reset the popup after 24 hours
        localStorage.removeItem('newsletter-popup-shown')
        const timer = setTimeout(() => {
          setIsVisible(true)
          localStorage.setItem('newsletter-popup-last-shown', Date.now().toString())
        }, 10000) // Show after 10 seconds on return visits

        return () => clearTimeout(timer)
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !email.trim()) {
      alert("Please enter a valid email address")
      return
    }

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      })

      const data = await response.json()

      if (response.ok) {
        if (data.existing) {
          alert("You're already subscribed to our newsletter!")
        } else {
          alert("Thank you for subscribing to our newsletter!")
        }
        
        // Mark popup as shown and hide it
        if (typeof window !== 'undefined') {
          localStorage.setItem('newsletter-popup-shown', 'true')
        }
        setEmail("")
        setIsVisible(false)
      } else {
        alert(data.error || "Something went wrong. Please try again.")
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error)
      alert("Network error. Please check your connection and try again.")
    }
  }

  const handleClose = () => {
    // Mark popup as shown when user closes it
    if (typeof window !== 'undefined') {
      localStorage.setItem('newsletter-popup-shown', 'true')
    }
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold mb-2">Stay Updated!</h3>
          <p className="text-gray-600">Subscribe to our newsletter and get 10% off your first order</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" className="w-full">
            Subscribe & Save 10%
          </Button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-4">No spam, unsubscribe at any time</p>
      </div>
    </div>
  )
}
