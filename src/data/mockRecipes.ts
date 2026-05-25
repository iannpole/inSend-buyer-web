export interface RecipeIngredient {
  id: number;
  product_id: number;
  name: string;
  qty: number;
  price: number;
  imageUrl: string;
}

export interface RecipeResponse {
  message: string;
  recipeName?: string;
  ingredients?: RecipeIngredient[];
}

export const mockRecipes: Record<string, RecipeResponse> = {
  "sayur sop": {
    message: "Tentu! Ini rekomendasi bahan segar untuk Sayur Sop bening yang lezat. Beli keropak sembakonya di inSend dengan harga grosir ya!",
    recipeName: "Sayur Sop Segar",
    ingredients: [
      { id: 201, product_id: 107, name: "Paket Sayur Sop (Wortel, Buncis, Kol, Kentang)", qty: 1, price: 12000, imageUrl: "https://images.unsplash.com/photo-1576044670005-502a2818c214?q=80&w=200&fit=crop" },
      { id: 202, product_id: 105, name: "Bawang Merah 250g", qty: 1, price: 11000, imageUrl: "https://images.unsplash.com/photo-1618512496245-5cb2827a5be5?q=80&w=200&fit=crop" },
      { id: 203, product_id: 106, name: "Daging Sapi Tetelan (Untuk Kaldu) 250g", qty: 1, price: 35000, imageUrl: "https://images.unsplash.com/photo-1603048297172-c92544798d5e?q=80&w=200&fit=crop" }
    ]
  },
  "nasi goreng": {
    message: "Nasi goreng spesial? Mantap! Ini daftar bahan dasarnya yang bisa kamu cekout langsung dari app inSend:",
    recipeName: "Nasi Goreng Spesial",
    ingredients: [
      { id: 204, product_id: 101, name: "Beras Maknyus Premium 5kg", qty: 1, price: 65000, imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e8ac?q=80&w=200&fit=crop" },
      { id: 205, product_id: 104, name: "Telur Ayam Kampung 1kg", qty: 1, price: 28000, imageUrl: "https://images.unsplash.com/photo-1506976773554-ea46f56b2e10?q=80&w=200&fit=crop" },
      { id: 206, product_id: 108, name: "Cabai Rawit Merah 250g", qty: 1, price: 18000, imageUrl: "https://images.unsplash.com/photo-1588019446417-3bf79c6dabe8?q=80&w=200&fit=crop" },
      { id: 207, product_id: 102, name: "Minyak Goreng Bimoli 2L", qty: 1, price: 34000, imageUrl: "https://images.unsplash.com/photo-1474557157379-8aa74a6ef541?q=80&w=200&fit=crop" }
    ]
  },
  "default": {
    message: "Maaf, aku belum punya resep untuk itu. Coba tanyakan resep 'sayur sop' atau 'nasi goreng'!"
  }
}

export const getAIResponse = (query: string): Promise<RecipeResponse> => {
  return new Promise((resolve) => {
    // Simulate network delay for effect
    setTimeout(() => {
      const q = query.toLowerCase()
      if (q.includes('sop') || q.includes('sayur')) resolve(mockRecipes['sayur sop'] as RecipeResponse)
      else if (q.includes('nasi') || q.includes('goreng')) resolve(mockRecipes['nasi goreng'] as RecipeResponse)
      else resolve(mockRecipes['default'] as RecipeResponse)
    }, 1200)
  })
}
