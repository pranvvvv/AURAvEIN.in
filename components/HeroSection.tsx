"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const slides = [ 
    {
      video: "/video.mp4",
      title: "OVERSIZED T-SHIRTS",
      subtitle: "PREMIUM QUALITY UNISEX DESIGNS",
      buttonText: "SHOP NOW",
      buttonLink: "/shop",
    },
    {
      image: "/img.jpg",
      title: "NEW COLLECTION",
      subtitle: "EXCLUSIVE DESIGNS FOR EVERY STYLE",
      buttonText: "DISCOVER",
      buttonLink: "/shop",
    },
    {
      image: "/img1.jpg",
      title: "LIMITED EDITION",
      subtitle: "GET THEM BEFORE THEY'RE GONE",
      buttonText: "EXPLORE",
      buttonLink: "/shop",
    },
  
  ]

  const startSlideshow = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    intervalRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
  }

  useEffect(() => {
    startSlideshow()
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const goToSlide = (index: number) => {
    setActiveSlide(index)
    startSlideshow()
  }

  const goToPrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length)
    startSlideshow()
  }

  const goToNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length)
    startSlideshow()
  }

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Media: Video or Image */}
      {slides.map((slide, index) => (
        <div key={index} className={`hero-slide ${activeSlide === index ? "active" : ""}`}>
          {slide.video ? (
            <video
              src={slide.video}
              autoPlay
              loop
              muted
              playsInline
              className="object-cover w-full h-full absolute inset-0"
              style={{ zIndex: 0 }}
            />
          ) : (
            <Image
              src={slide.image || "/placeholder.svg"}
              alt={`Hero Slide ${index + 1}`}
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-black/30" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="text-2xl sm:text-4xl md:text-6xl font-medium mb-4 tracking-wider uppercase">{slides[activeSlide].title}</h1>
        <p className="text-sm sm:text-lg md:text-xl mb-6 md:mb-8 tracking-wide">{slides[activeSlide].subtitle}</p>
        <Button
          asChild
          size="lg"
          className="bg-white text-black hover:bg-gray-100 px-6 md:px-8 py-2 md:py-3 text-xs md:text-sm uppercase tracking-wider"
        >
          <Link href={slides[activeSlide].buttonLink}>{slides[activeSlide].buttonText}</Link>
        </Button>
      </div>

      {/* Navigation Arrows */}
      <button
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
        onClick={goToPrevSlide}
      >
        <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 text-white" />
      </button>
      <button
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
        onClick={goToNextSlide}
      >
        <ChevronRight className="w-4 h-4 md:w-6 md:h-6 text-white" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-10 flex space-x-1 md:space-x-2">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-colors ${i === activeSlide ? "bg-white" : "bg-white/50"}`}
            onClick={() => goToSlide(i)}
          />
        ))}
      </div>
    </section>
  )
}
