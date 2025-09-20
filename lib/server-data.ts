import fs from 'fs'
import path from 'path'

// File path for persistent product data
const productsFilePath = path.join(process.cwd(), "lib", "products-data.json")

// Function to read products from file
export function readProductsFromFile() {
  try {
    if (fs.existsSync(productsFilePath)) {
      const data = fs.readFileSync(productsFilePath, 'utf8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error reading products file:', error)
  }
  return []
}

// Function to write products to file
export function writeProductsToFile(products: any[]) {
  try {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), 'utf8')
  } catch (error) {
    console.error('Error writing products file:', error)
  }
}

// Initialize products file if it doesn't exist
export function initializeProductsFile(initialProducts: any[]) {
  try {
    if (!fs.existsSync(productsFilePath)) {
      writeProductsToFile(initialProducts)
    }
  } catch (error) {
    console.error('Error initializing products file:', error)
  }
} 