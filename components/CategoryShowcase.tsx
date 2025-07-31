import Image from "next/image"
import Link from "next/link"

export default function CategoryShowcase() {
  const categories = [
    {
      title: "Summer Must Have",
      subtitle: "Starting at $29",
      image: "/placeholder.svg?height=300&width=200",
      href: "/shop?category=summer",
    },
    {
      title: "Fantastic Special Style",
      subtitle: "New Collection",
      image: "/placeholder.svg?height=300&width=200",
      href: "/shop?category=special",
    },
    {
      title: "T-SHIRT",
      subtitle: "Premium Quality",
      image: "/placeholder.svg?height=300&width=200",
      href: "/shop?category=bags",
    },
    {
      title: "PRINTED T-SHIRT",
      subtitle: "Trending Now",
      image: "/placeholder.svg?height=300&width=200",
      href: "/shop?category=women",
    },
  ]

  return (
    <section className="py-10 md:py-16 bg-gray-50">
      <div className="w-full max-w-[1440px] mx-auto px-2 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {categories.map((category, index) => (
            <Link
              key={index}
              href={category.href}
              className="group relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.title}
                  width={200}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3 md:p-4 text-center">
                <h3 className="font-semibold text-base md:text-lg mb-1">{category.title}</h3>
                <p className="text-gray-600 text-xs md:text-sm">{category.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
