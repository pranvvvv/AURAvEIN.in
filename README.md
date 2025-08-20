# Auravein - Premium Fashion E-commerce

A modern, responsive e-commerce platform built with Next.js 14, featuring a fully dynamic Firebase-backed product system with admin-editable overlays and real-time updates.

## ✨ Enhanced Features

### 🔄 **Dynamic Product Overlays (Firebase-Backed)**
- **Fully Configurable Overlays**: All product overlays are now dynamically controlled from Firebase
- **Admin-Editable Settings**: Admins can configure size selectors, color selectors, add-to-cart buttons per product
- **Real-Time Updates**: Changes in admin panel instantly reflect on the homepage
- **Persistent Data**: All product data is stored in Firebase Firestore for consistency across devices

### 🛍️ **Interactive Featured Products**
- **Fully Clickable Product Cards**: Each product in the Featured Products section is now fully interactive
- **Dynamic Product Detail Pages**: Clean URLs with dynamic routing (`/product/[id]`)
- **Smooth Animations**: Staggered entrance animations and hover effects
- **Loading States**: Beautiful skeleton loading for better UX

### 🎯 **Product Detail Experience**
- **High-Resolution Image Gallery**: Multiple product images with thumbnail navigation
- **Size & Color Selection**: Interactive selection with visual feedback
- **Add to Cart Animation**: Smooth fly-to-cart animation with success feedback
- **Wishlist Integration**: Persistent wishlist with localStorage
- **Share Functionality**: Easy product sharing with clipboard integration

### 🛒 **Enhanced Cart System**
- **Persistent Cart State**: Cart items persist across navigation
- **Real-time Updates**: Instant cart updates with toast notifications
- **Size & Color Tracking**: Cart items include selected size and color
- **Quantity Management**: Easy quantity adjustment on product pages

### 🔐 **Secure Admin Dashboard**
- **Firebase Authentication**: Secure admin login with Firebase Auth
- **Full CRUD Operations**: Create, read, update, delete products with overlay settings
- **Real-Time Management**: Instant updates across all devices
- **Overlay Configuration**: Configure size selectors, color selectors, button text, and icons per product

### ♿ **Accessibility Features**
- **Keyboard Navigation**: Full keyboard accessibility for all interactive elements
- **ARIA Labels**: Proper screen reader support
- **Focus Management**: Clear focus indicators and states
- **Semantic HTML**: Proper heading structure and landmarks

### 🎨 **Design System**
- **Consistent Theming**: Maintains existing design language and color scheme
- **Responsive Design**: Optimized for all device sizes
- **Smooth Transitions**: 300ms transitions for all interactive elements
- **Professional Animations**: Subtle, purposeful animations that enhance UX

## 🚀 Getting Started

### 1. **Install Dependencies**
```bash
npm install
```

### 2. **Firebase Setup**
The project is already configured with Firebase. To set up the admin user and sample data:

```bash
node scripts/setup-admin.js
```

This will create:
- Admin user: `admin@auravein.com` / `admin123456`
- Sample products with overlay settings
- Sample categories
- Homepage settings

### 3. **Run Development Server**
```bash
npm run dev
```

### 4. **Access Admin Panel**
Navigate to `/admin/login` and use the credentials created in step 2.

## 📱 Key Components

### Featured Products (`/components/FeaturedProducts.tsx`)
- **Firebase Integration**: Real-time data fetching from Firestore
- **Dynamic Overlays**: Configurable size/color selectors and add-to-cart buttons
- **Staggered Loading**: Beautiful entrance animations
- **Error Handling**: Graceful fallbacks for failed requests

### Product Card (`/components/ProductCard.tsx`)
- **Dynamic Overlay Settings**: All overlay elements controlled by Firebase data
- **Configurable Elements**: Size selectors, color selectors, button text, icons
- **Interactive Features**: Hover effects, animations, accessibility
- **Responsive Design**: Works perfectly across all device sizes

### Product Detail Page (`/app/product/[id]/page.tsx`)
- **Firebase Data Fetching**: Dynamic product loading from Firestore
- **Image Gallery**: Multiple images with thumbnail navigation
- **Size & Color Selection**: Interactive selection with validation
- **Add to Cart**: Smooth integration with cart context

### Admin Dashboard (`/app/admin/products/page.tsx`)
- **Product Management**: Full CRUD operations for products
- **Overlay Configuration**: Configure all overlay settings per product
- **Featured Products**: Toggle products for homepage display
- **Real-Time Updates**: Changes reflect immediately across the site

### Firebase Service (`/lib/firebaseService.js`)
- **Comprehensive API**: Complete Firebase integration
- **Real-Time Listeners**: Live updates for products and categories
- **Admin Authentication**: Secure admin login system
- **Error Handling**: Robust error handling and fallbacks

## 🎯 User Experience Highlights

### Seamless Product Flow
1. **Browse**: Users can browse featured products on the homepage
2. **Click**: Each product card is fully clickable and routes to detail page
3. **Select**: Choose size and color with immediate visual feedback
4. **Add to Cart**: Smooth animation confirms successful addition
5. **Continue Shopping**: Cart persists across navigation

### Professional Animations
- **Entrance Animations**: Products fade in with staggered timing
- **Hover Effects**: Subtle scaling and overlay effects
- **Add to Cart**: Fly-to-cart animation with success message
- **Loading States**: Skeleton screens for better perceived performance

### Mobile-First Design
- **Touch-Friendly**: Large touch targets for mobile users
- **Responsive Grid**: Adapts from 2 columns on mobile to 4 on desktop
- **Optimized Images**: Lazy loading and responsive image handling
- **Gesture Support**: Swipe-friendly interactions

## 🔧 Technical Implementation

### Performance Optimizations
- **Lazy Loading**: Images load only when needed
- **Optimized Routing**: Dynamic routes with efficient data fetching
- **Minimal Re-renders**: Efficient state management with React hooks
- **CSS Animations**: Hardware-accelerated animations for smooth performance

### State Management
- **Cart Context**: Global cart state with localStorage persistence
- **Product State**: Local state for selections and interactions
- **Loading States**: Proper loading indicators throughout the app

### Error Handling
- **Graceful Degradation**: Fallbacks for failed operations
- **User Feedback**: Clear error messages and success notifications
- **Storage Limits**: Handles localStorage quota exceeded scenarios

## 🎨 Custom CSS Animations

The project includes custom CSS animations for enhanced user experience:

```css
/* Fly to cart animation */
@keyframes flyToCart {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.8; }
  100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
}

/* Staggered entrance animations */
.product-card-entrance {
  animation: slideInUp 0.6s ease-out;
}
```

## 🔐 Admin Features

### Product Overlay Configuration
- **Size Selector**: Enable/disable and set default size
- **Color Selector**: Enable/disable and set default color
- **Add to Cart Button**: Enable/disable, customize text and icon
- **Real-Time Preview**: See changes immediately on the homepage

### Product Management
- **Full CRUD**: Create, read, update, delete products
- **Image Upload**: Multiple image support with primary selection
- **Featured Products**: Toggle products for homepage display
- **Stock Management**: Track inventory levels

### Category Management
- **Dynamic Categories**: Create and manage product categories
- **Ordering**: Set display order for categories
- **Image Support**: Upload category images

## 📊 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ using Next.js 14, TypeScript, Tailwind CSS, and Firebase** 