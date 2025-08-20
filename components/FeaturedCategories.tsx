import Image from "next/image"
import Link from "next/link"

export default function FeaturedCategories() {
  const categories = [
    {
      name: "COMING SOON",
      image: "/img.jpg",
      href: "/shop?category=furniture",
    },
    {
      name: "COTTON TEES",
      image: "/img1.jpg",
      href: "/shop?category=clothes",
    },
    {
      name: "NEW DRIP",
      image: "/img1.jpg",
      href: "/shop?category=accessories",
    },
    {
      name: "SHOP NOW",
      image: "/img.jpg",
      href: "/shop?category=fashion",
    },
  ]

  return (
    <section className="py-10 md:py-16">
      <div className="w-full max-w-[1440px] mx-auto px-2 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4">Featured Categories</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {categories.map((category, index) => (
            <Link
              key={index}
              href={category.href}
              className="group relative overflow-hidden rounded-xl aspect-[3/4] bg-gray-100"
            >
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-white text-base md:text-xl font-bold tracking-wider">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
