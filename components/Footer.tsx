import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4">AURAvEIN</h3>
            <p className="text-gray-300 mb-4">
              Redefining fashion with style, quality, and innovation. Discover our premium collection of contemporary
              clothing.
            </p>
           <div className="flex space-x-4">
  <a
    href="https://facebook.com/"
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-300 hover:text-white transition-colors"
  >
    <Facebook className="w-5 h-5" />
  </a>

  <a
    href="https://instagram.com/auravein.in"
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-300 hover:text-white transition-colors"
  >
    <Instagram className="w-5 h-5" />
  </a>

  <a
    href="https://twitter.com/"
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-300 hover:text-white transition-colors"
  >
    <Twitter className="w-5 h-5" />
  </a>

  <a
    href="https://youtube.com/"
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-300 hover:text-white transition-colors"
  >
    <Youtube className="w-5 h-5" />
  </a>
</div>

          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
          
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About
                </Link>
              </li>
            
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <div className="space-y-2 text-gray-300">
              <p>SR NAGAR</p>
              <p>HYDERABAD , TELANGANA , 500008</p>
              <p>India</p>
              <p>Phone: +91 905 973 1884</p>
              <p>Email: auravein.official03@gmail.com</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2025 AURAvEIN.in All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
