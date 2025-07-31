import { notFound } from "next/navigation"
import Image from "next/image"
import { Calendar, User, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { blogPosts } from "@/lib/data"

export default function BlogPost({ params }: { params: { id: string } }) {
  const post = blogPosts.find((p) => p.id === params.id)

  if (!post) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/blog" className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-8">
        <ArrowLeft className="w-4 h-4" />
        Back to Blog
      </Link>

      <article className="max-w-4xl mx-auto">
        <div className="aspect-video overflow-hidden rounded-lg mb-8">
          <Image
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            width={800}
            height={450}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {post.date}
          </div>
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            {post.author}
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-6">{post.title}</h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-600 mb-8">{post.excerpt}</p>
          <div className="space-y-6 text-gray-700 leading-relaxed">
            {post.content?.split("\n\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </article>
    </div>
  )
}
