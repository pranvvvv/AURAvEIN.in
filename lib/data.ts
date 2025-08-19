// Initial products data
const initialProducts = [
  {
    id: "1",
    name: "BROWN TIGER T-SHIRT",
    price: 4495,
    image: "/placeholder.svg?height=400&width=400",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-RMkXrTxnA1vpz17GZLeE524Ifu4M1Q.png",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
    ],
    video: "",
    rating: 0,
    reviews: 0,
    category: "t-shirts",
    description:
      "Premium oversized unisex t-shirt featuring a detailed tiger print. Made from 100% organic cotton for maximum comfort and durability.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    isLimitedEdition: true,
    quantity: 50,
  },
  {
    id: "2",
    name: "RED HUMMINGBIRD T-SHIRT",
    price: 4495,
    image: "/placeholder.svg?height=400&width=400",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-RMkXrTxnA1vpz17GZLeE524Ifu4M1Q.png",
      "/placeholder.svg?height=400&width=400",
    ],
    videoUrl: "",
    rating: 5,
    reviews: 89,
    category: "t-shirts",
    description: "Oversized unisex t-shirt with vibrant hummingbird design. Premium quality fabric with a relaxed fit.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    isLimitedEdition: false,
    quantity: 50,
  },
  {
    id: "4",
    name: "WHITE APEX WILD T-SHIRT",
    price: 4195,
    image: "/placeholder.svg?height=400&width=400",
    videoUrl: "",
    rating: 4,
    reviews: 234,
    category: "t-shirts",
    description: "White oversized t-shirt with unique apex wild design. Made from premium cotton for ultimate comfort.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    isLimitedEdition: false,
    quantity: 50,
  },
  {
    id: "5",
    name: "BLACK PRAYING MANTIS T-SHIRT",
    price: 4495,
    image: "/placeholder.svg?height=400&width=400",
    videoUrl: "",
    rating: 5,
    reviews: 156,
    category: "t-shirts",
    description:
      "Black oversized t-shirt featuring an intricate praying mantis design. Premium quality with a relaxed fit.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    isLimitedEdition: false,
    quantity: 50,
  },
  {
    id: "6",
    name: "NAVY SADDLE LEAGUE POLO T-SHIRT",
    price: 4995,
    image: "/placeholder.svg?height=400&width=400",
    videoUrl: "",
    rating: 4,
    reviews: 92,
    category: "t-shirts",
    description: "Navy blue oversized polo t-shirt with saddle league emblem. Perfect for a smart casual look.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    isLimitedEdition: false,
    quantity: 50,
  },
  {
    id: "7",
    name: "GREEN SUNFLOWER T-SHIRT",
    price: 4495,
    image: "/placeholder.svg?height=400&width=400",
    videoUrl: "",
    rating: 5,
    reviews: 78,
    category: "t-shirts",
    description: "Green oversized t-shirt with vibrant sunflower design. Made from 100% organic cotton.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    isLimitedEdition: false,
    quantity: 50,
  },
  {
    id: "8",
    name: "BLACK DRAGON T-SHIRT",
    price: 4995,
    image: "/placeholder.svg?height=400&width=400",
    videoUrl: "",
    rating: 4,
    reviews: 145,
    category: "t-shirts",
    description: "Black oversized t-shirt featuring a detailed dragon design. Premium quality with a comfortable fit.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    isLimitedEdition: false,
    quantity: 50,
  },
    {
    id: "9",
    name: "BLACK DRAGON T-SHIRT",
    price: 4995,
    image: "/placeholder.svg?height=400&width=400",
    videoUrl: "",
    rating: 4,
    reviews: 145,
    category: "t-shirts",
    description: "Black oversized t-shirt featuring a detailed dragon design. Premium quality with a comfortable fit.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    isLimitedEdition: false,
    quantity: 50,
  },
]

// Export products for client-side use
export const products = initialProducts

export const blogPosts = [
  {
    id: "1",
    title: "THE ART OF OVERSIZED FASHION",
    excerpt:
      "Explore the latest trends in oversized fashion and discover how to style your AURAvEIN t-shirts for maximum impact.",
    image: "/page.jpg",
    date: "March 15, 2025",
    author: "simon justin",
    content:
      "Fashion is more than just clothing; it's a form of creative expression that allows individuals to showcase their personality and style. In this post, we explore the intersection of creativity and fashion, highlighting how innovative designs and unique features can transform ordinary pieces into extraordinary statements.\n\nThe world of fashion is constantly evolving, with designers pushing boundaries and experimenting with new materials, techniques, and concepts. From sustainable fabrics to tech-integrated garments, the industry is embracing innovation like never before.\n\nCreative work in fashion involves understanding not just aesthetics, but also functionality, comfort, and the story behind each piece. When we talk about creative features in fashion, we're referring to those unique elements that set a garment apart from the rest.",
  },
 
]

export interface InstagramPost {
  id: number;
  image: string;
  likes: number;
  caption: string;
}

export const instagramPosts: InstagramPost[] = [


]

export interface Order {
  id: string;
  userId: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: Date;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export const orders: Order[] = [
  {
    id: "ORD-001",
    userId: "USER-001",
    items: [
      { productId: "1", quantity: 2, price: 4495 },
      { productId: "3", quantity: 1, price: 3995 }
    ],
    total: 12985,
    status: "processing",
    createdAt: new Date("2024-03-15"),
    address: {
      street: "123 Fashion Street",
      city: "Mumbai",
      state: "Maharashtra",
      postalCode: "400001",
      country: "India"
    }
  }
]

