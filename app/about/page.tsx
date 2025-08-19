import Image from "next/image"

export default function About() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About AURAvEIN</h1>
          <p className="text-xl text-gray-600">Redefining fashion with style, quality, and innovation</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Founded in 2025, AURAvEIN emerged from a simple belief: fashion should be accessible, sustainable, and
                expressive of individual style. We started as a small team of fashion enthusiasts who wanted to create
                clothing that speaks to the modern consumer.
              </p>
              <p>
                Today, we've grown into a global brand that serves customers worldwide, but our core values remain
                unchanged. We're committed to creating high-quality pieces that make you feel confident and comfortable.
              </p>
            </div>
          </div>
          <div className="aspect-square overflow-hidden rounded-lg">
            <Image
              src="/img.jpg"
              alt="AURAvEIN Brand Story"
              width={500}
              height={500}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">Q</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Quality</h3>
            <p className="text-gray-600">
              We use only the finest materials and work with skilled artisans to ensure every piece meets our high
              standards.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">S</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Sustainability</h3>
            <p className="text-gray-600">
              Environmental responsibility is at the heart of our operations, from sourcing to packaging and shipping.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">I</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Innovation</h3>
            <p className="text-gray-600">
              We constantly push boundaries in design and technology to bring you the latest in fashion innovation.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            To empower individuals through fashion by creating timeless pieces that blend contemporary design with
            classic elegance. We believe that great style should be accessible to everyone, and we're committed to
            making that vision a reality.
          </p>
        </div>
      </div>
    </div>
  )
}
