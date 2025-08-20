import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { action, product } = await request.json();
    
    const dataFilePath = path.join(process.cwd(), 'lib', 'data.ts');
    
    // Read file content
    const currentContent = fs.readFileSync(dataFilePath, 'utf8');
    
    // Parse the current products array
    const productsMatch = currentContent.match(/export const products = \[([\s\S]*?)\];/);
    if (!productsMatch) {
      return NextResponse.json({ error: 'Could not find products array in data.ts' }, { status: 400 });
    }
    
    const currentProductsStr = productsMatch[1];
    let updatedProductsStr = currentProductsStr;
    
    if (action === 'add') {
      // Format the new product for data.ts
      const formattedProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice || product.price,
        discount: product.discount || 0,
        image: product.image || "/placeholder.svg?height=400&width=400",
        images: product.images || [product.image || "/placeholder.svg?height=400&width=400"],
        videoUrl: product.videoUrl || "",
        rating: product.rating || 4,
        reviews: product.reviews || 0,
        category: product.category || "t-shirts",
        description: product.description || "",
        sizes: product.sizes || ["S", "M", "L", "XL", "XXL"],
        colors: product.colors || [],
        stock: product.stock || 0,
        brand: product.brand || "",
        tags: product.tags || [],
        isActive: product.isActive !== undefined ? product.isActive : true,
        isFeatured: product.isFeatured || false,
        overlaySettings: product.overlaySettings || {
          showSizeSelector: true,
          showColorSelector: true,
          showAddToCart: true,
          defaultSize: 'M',
          defaultColor: 'Default',
          buttonText: 'Add to Cart',
          buttonIcon: 'shopping-bag'
        }
      };
      
      // Convert to string format matching data.ts structure
      const productStr = `  {
    id: "${formattedProduct.id}",
    name: "${formattedProduct.name}",
    price: ${formattedProduct.price},
    originalPrice: ${formattedProduct.originalPrice},
    discount: ${formattedProduct.discount},
    image: "${formattedProduct.image}",
    images: [
      ${formattedProduct.images.map(img => `"${img}"`).join(',\n      ')},
    ],
    videoUrl: "${formattedProduct.videoUrl}",
    rating: ${formattedProduct.rating},
    reviews: ${formattedProduct.reviews},
    category: "${formattedProduct.category}",
    description: "${formattedProduct.description.replace(/"/g, '\\"')}",
    sizes: [${formattedProduct.sizes.map(size => `"${size}"`).join(', ')}],
    colors: [${formattedProduct.colors.map(color => `"${color}"`).join(', ')}],
    stock: ${formattedProduct.stock},
    brand: "${formattedProduct.brand}",
    tags: [${formattedProduct.tags.map(tag => `"${tag}"`).join(', ')}],
    isActive: ${formattedProduct.isActive},
    isFeatured: ${formattedProduct.isFeatured},
    overlaySettings: {
      showSizeSelector: ${formattedProduct.overlaySettings.showSizeSelector},
      showColorSelector: ${formattedProduct.overlaySettings.showColorSelector},
      showAddToCart: ${formattedProduct.overlaySettings.showAddToCart},
      defaultSize: "${formattedProduct.overlaySettings.defaultSize}",
      defaultColor: "${formattedProduct.overlaySettings.defaultColor}",
      buttonText: "${formattedProduct.overlaySettings.buttonText}",
      buttonIcon: "${formattedProduct.overlaySettings.buttonIcon}"
    }
  },`;
      
      // Add the new product to the array
      updatedProductsStr = currentProductsStr + '\n' + productStr;
      
    } else if (action === 'remove') {
      // Remove the product by ID
      const lines = currentProductsStr.split('\n');
      let inProduct = false;
      let productStartIndex = -1;
      let productEndIndex = -1;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('id:') && line.includes(`"${product.id}"`)) {
          inProduct = true;
          productStartIndex = i;
        }
        if (inProduct && line === '},') {
          productEndIndex = i;
          break;
        }
      }
      
      if (productStartIndex !== -1 && productEndIndex !== -1) {
        lines.splice(productStartIndex, productEndIndex - productStartIndex + 1);
        updatedProductsStr = lines.join('\n');
      }
      
    } else if (action === 'update') {
      // Update existing product
      const lines = currentProductsStr.split('\n');
      let inProduct = false;
      let productStartIndex = -1;
      let productEndIndex = -1;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('id:') && line.includes(`"${product.id}"`)) {
          inProduct = true;
          productStartIndex = i;
        }
        if (inProduct && line === '},') {
          productEndIndex = i;
          break;
        }
      }
      
      if (productStartIndex !== -1 && productEndIndex !== -1) {
        // Format the updated product
        const formattedProduct = {
          id: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice || product.price,
          discount: product.discount || 0,
          image: product.image || "/placeholder.svg?height=400&width=400",
          images: product.images || [product.image || "/placeholder.svg?height=400&width=400"],
          videoUrl: product.videoUrl || "",
          rating: product.rating || 4,
          reviews: product.reviews || 0,
          category: product.category || "t-shirts",
          description: product.description || "",
          sizes: product.sizes || ["S", "M", "L", "XL", "XXL"],
          colors: product.colors || [],
          stock: product.stock || 0,
          brand: product.brand || "",
          tags: product.tags || [],
          isActive: product.isActive !== undefined ? product.isActive : true,
          isFeatured: product.isFeatured || false,
          overlaySettings: product.overlaySettings || {
            showSizeSelector: true,
            showColorSelector: true,
            showAddToCart: true,
            defaultSize: 'M',
            defaultColor: 'Default',
            buttonText: 'Add to Cart',
            buttonIcon: 'shopping-bag'
          }
        };
        
        const productStr = `  {
    id: "${formattedProduct.id}",
    name: "${formattedProduct.name}",
    price: ${formattedProduct.price},
    originalPrice: ${formattedProduct.originalPrice},
    discount: ${formattedProduct.discount},
    image: "${formattedProduct.image}",
    images: [
      ${formattedProduct.images.map(img => `"${img}"`).join(',\n      ')},
    ],
    videoUrl: "${formattedProduct.videoUrl}",
    rating: ${formattedProduct.rating},
    reviews: ${formattedProduct.reviews},
    category: "${formattedProduct.category}",
    description: "${formattedProduct.description.replace(/"/g, '\\"')}",
    sizes: [${formattedProduct.sizes.map(size => `"${size}"`).join(', ')}],
    colors: [${formattedProduct.colors.map(color => `"${color}"`).join(', ')}],
    stock: ${formattedProduct.stock},
    brand: "${formattedProduct.brand}",
    tags: [${formattedProduct.tags.map(tag => `"${tag}"`).join(', ')}],
    isActive: ${formattedProduct.isActive},
    isFeatured: ${formattedProduct.isFeatured},
    overlaySettings: {
      showSizeSelector: ${formattedProduct.overlaySettings.showSizeSelector},
      showColorSelector: ${formattedProduct.overlaySettings.showColorSelector},
      showAddToCart: ${formattedProduct.overlaySettings.showAddToCart},
      defaultSize: "${formattedProduct.overlaySettings.defaultSize}",
      defaultColor: "${formattedProduct.overlaySettings.defaultColor}",
      buttonText: "${formattedProduct.overlaySettings.buttonText}",
      buttonIcon: "${formattedProduct.overlaySettings.buttonIcon}"
    }
  },`;
        
        // Replace the product
        lines.splice(productStartIndex, productEndIndex - productStartIndex + 1, ...productStr.split('\n'));
        updatedProductsStr = lines.join('\n');
      }
    }
    
    // Replace the products array in the file content
    const updatedContent = currentContent.replace(
      /export const products = \[([\s\S]*?)\];/,
      `export const products = [${updatedProductsStr}\n];`
    );
    
    // Write the updated content back to the file
    fs.writeFileSync(dataFilePath, updatedContent, 'utf8');
    
    return NextResponse.json({ 
      success: true, 
      message: `Successfully ${action}ed product: ${product.name}` 
    });
    
  } catch (error) {
    console.error('Error updating data.ts file:', error);
    return NextResponse.json({ error: 'Failed to update data.ts file' }, { status: 500 });
  }
} 