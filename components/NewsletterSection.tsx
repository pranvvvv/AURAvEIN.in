"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function NewsletterSection() {
  const [email, setEmail] = useState("")

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
        setEmail("")
      } else {
        alert(data.error || "Something went wrong. Please try again.")
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error)
      alert("Network error. Please check your connection and try again.")
    }
  }

  return (
    <section className="py-10 md:py-16 bg-gray-900 text-white">
      <div className="w-full max-w-[1440px] mx-auto px-2 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 md:mb-4">Hi there, sign up and connect to AURAvEIN</h2>
          <p className="text-gray-300 mb-4 md:mb-8 text-xs sm:text-sm md:text-base">
            Subscribe to our newsletter and be the first to know about new collections, exclusive offers, and fashion
            insights.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 bg-white text-black h-10 md:h-12 text-sm md:text-base"
            />
            <Button type="submit" className="bg-white text-black hover:bg-gray-100 h-10 md:h-12 text-sm md:text-base">
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
