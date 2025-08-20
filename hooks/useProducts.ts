import { useState, useEffect } from "react";

export function useProducts() {
  const [products, setProducts] = useState<any[]>([]);

  // Load products from localStorage or API
  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
      });
  }, []);

  // Add product
  const addProduct = async (product: any) => {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    const newProduct = await res.json();
    setProducts(prev => [...prev, newProduct]);
  };

  // Update product
  const updateProduct = async (id: string, updates: any) => {
    await fetch("/api/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: id, ...updates }),
    });
    setProducts(prev => prev.map(p => (p._id === id ? { ...p, ...updates } : p)));
  };

  // Delete product
  const deleteProduct = async (id: string) => {
    await fetch("/api/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: id }),
    });
    setProducts(prev => prev.filter(p => p._id !== id));
  };

  // Get featured products (limited edition first)
  const getFeatured = () => {
    return [
      ...products.filter(p => p.isLimitedEdition),
      ...products.filter(p => !p.isLimitedEdition && p.isFeatured),
    ];
  };

  return { products, addProduct, updateProduct, deleteProduct, getFeatured };
}