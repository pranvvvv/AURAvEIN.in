"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, MessageCircle } from "lucide-react"
import { instagramPosts } from "@/lib/data"

export default function InstagramFeed() {
  const [hoveredPost, setHoveredPost] = useState<number | null>(null)

  return (
    <section className="py-10 md:py-16">
      <div className="w-full max-w-[1440px] mx-auto px-2 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-base md:text-xl font-medium uppercase tracking-wider mb-1 md:mb-2">Instagram</h2>
          <p className="text-xs md:text-sm text-gray-600">
            Follow us  
            <a
              href="https://instagram.com/auravein.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline font-semibold"
            >
                @auravein.in
            </a>
            {' '}for daily inspiration
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-1 md:gap-2">
          {instagramPosts
            .filter((post) => post.image && !post.image.includes('/placeholder.svg'))
            .map((post) => (
            <div
              key={post.id}
              className="aspect-square overflow-hidden relative cursor-pointer"
              onMouseEnter={() => setHoveredPost(post.id)}
              onMouseLeave={() => setHoveredPost(null)}
            >
              <Image
                src={post.image}
                alt={`Instagram post ${post.id}`}
                width={300}
                height={300}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />

              {/* Overlay on hover */}
              {hoveredPost === post.id && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white p-2 md:p-4 transition-opacity duration-300">
                  <div className="flex items-center gap-2 md:gap-4 mb-1 md:mb-2">
                    <div className="flex items-center">
                      <Heart className="w-3 md:w-4 h-3 md:h-4 mr-1 fill-white" />
                      <span className="text-xs md:text-sm">{post.likes}</span>
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="w-3 md:w-4 h-3 md:h-4 mr-1" />
                      <span className="text-xs md:text-sm">24</span>
                    </div>
                  </div>
                  <p className="text-[10px] md:text-xs text-center line-clamp-3">{post.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
