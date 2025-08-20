import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const dataFilePath = path.join(process.cwd(), 'lib', 'data.ts');
    const currentContent = fs.readFileSync(dataFilePath, 'utf8');
    
    // Parse the current products array
    const productsMatch = currentContent.match(/export const products = \[([\s\S]*?)\];/);
    if (!productsMatch) {
      return NextResponse.json({ error: 'Could not find products array in data.ts' }, { status: 400 });
    }
    
    const currentProductsStr = productsMatch[1];
    
    // Count products
    const productCount = (currentProductsStr.match(/id: "/g) || []).length;
    
    return NextResponse.json({ 
      success: true, 
      message: `Found ${productCount} products in data.ts`,
      productsCount: productCount
    });
    
  } catch (error) {
    console.error('Error reading data.ts file:', error);
    return NextResponse.json({ error: 'Failed to read data.ts file' }, { status: 500 });
  }
} 