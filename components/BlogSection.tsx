import Image from "next/image"
import Link from "next/link"
import { Calendar, User } from "lucide-react"
import { blogPosts } from "@/lib/data"

export default function BlogSection() {
  const latestPosts = blogPosts.slice(0, 4)

  return (
    <section className="py-10 md:py-16 bg-gray-50">
      <div className="w-full max-w-[1440px] mx-auto px-2 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4">Our Latest Posts</h2>
          <p className="text-gray-600 text-xs md:text-base">Stay updated with fashion trends and styling tips</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {latestPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
            >
              <Link href={`/blog/${post.id}`}>
                <div className="aspect-video overflow-hidden">
                  <Image
                    src={post.image || "/auraveinsoc.jpg"}
                    alt={post.title}
                    width={300}
                    height={200}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>

              <div className="p-3 md:p-4">
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {post.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {post.author}
                  </div>
                </div>

                <Link href={`/blog/${post.id}`}>
                  <h3 className="font-semibold mb-2 hover:text-gray-600 transition-colors line-clamp-2 text-xs md:text-base">
                    {post.title}
                  </h3>
                </Link>

                <p className="text-xs md:text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
<div className="text-center mt-6 md:mt-8">
  <a 
    href="https://instagram.com/auravein.in" 
    target="_blank" 
    rel="noopener noreferrer"
    className="inline-flex items-center text-black font-medium hover:underline text-xs md:text-base"
  >
    View Instagram
  </a>
</div>

      </div>
    </section>
  )
}
