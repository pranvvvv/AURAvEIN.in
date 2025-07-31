import Image from "next/image"
import Link from "next/link"
import { Calendar, User } from "lucide-react"
import { blogPosts } from "@/lib/data"

export default function Blog() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Latest Posts</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Stay updated with the latest fashion trends, styling tips, and brand news
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <article
            key={post.id}
            className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
          >
            <Link href={`/blog/${post.id}`}>
              <div className="aspect-video overflow-hidden">
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  width={400}
                  height={250}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>

            <div className="p-6">
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {post.date}
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {post.author}
                </div>
              </div>

              <Link href={`/blog/${post.id}`}>
                <h2 className="text-xl font-semibold mb-3 hover:text-gray-600 transition-colors">{post.title}</h2>
              </Link>

              <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>

              <Link href={`/blog/${post.id}`} className="text-black font-medium hover:underline">
                Read More →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
