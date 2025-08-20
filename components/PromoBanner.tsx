import Image from "next/image"
import { Button } from "@/components/ui/button"
import React from "react"
export default function PromoBanner() {
  return (
    <section className="py-10 md:py-16">
      <div className="w-full max-w-[1440px] mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gray-900 text-white">
          <div className="absolute inset-0">
            <Image
              src="/img.jpg"
              alt="Promo Background"
              fill
              className="object-cover opacity-30"
            />
          </div>

          <div className="relative z-10 px-4 py-8 md:px-16 md:py-24">
            <div className="max-w-2xl">
              <h2 className="text-xl sm:text-2xl md:text-5xl font-bold mb-3 md:mb-6">Enjoy the best Quality and features made by AURAvEIN</h2>
              <p className="text-sm sm:text-base md:text-xl mb-4 md:mb-8 opacity-90">
                Experience premium craftsmanship and innovative design in every piece. Our commitment to excellence
                ensures you get the best value for your investment.
              </p>
              <Button size="lg" className="bg-white text-black hover:bg-gray-100 text-sm md:text-base px-4 md:px-6 py-2 md:py-3">
                Explore Collection
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
