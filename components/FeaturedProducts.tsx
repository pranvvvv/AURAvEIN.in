import ProductCard from "./ProductCard"
import { products } from "@/lib/data"

export default function FeaturedProducts() {
  const featuredProducts = products.slice(0, 8)

  return (
    <section className="py-10 md:py-16 bg-gray-50">
      <div className="w-full max-w-[1440px] mx-auto px-2 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4">Featured Products</h2>
          <p className="text-gray-600 text-xs md:text-base">Discover our handpicked selection of premium items</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
