"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function NewsletterSection() {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup
    console.log("Newsletter signup:", email)
    alert("Thank you for subscribing!")
    setEmail("")
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
