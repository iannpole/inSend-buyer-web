<script setup lang="ts">
import Navbar from '../components/layout/Navbar.vue'

const posts = [
    { id: 1, title: 'Manfaat Sayur Bayam Untuk Kesehatan Mata', category: 'Kesehatan', image: 'https://images.unsplash.com/photo-1576044670005-502a2818c214?w=600&fit=crop', excerpt: 'Bayam mengandung banyak vitamin A yang sangat baik untuk menjaga kesehatan dan ketajaman mata Anda...', date: '12 Mei 2026' },
    { id: 2, title: '5 Resep Olahan Daging Sapi Super Praktis', category: 'Resep', image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5e?w=600&fit=crop', excerpt: 'Punya stok daging sapi di rumah? Yuk coba 5 resep olahan daging yang mudah dibuat dan lezat ini...', date: '10 Mei 2026' },
    { id: 3, title: 'Tips Menyimpan Sayuran Agar Tetap Segar 1 Minggu', category: 'Tips & Trik', image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=600&fit=crop', excerpt: 'Sering membuang sayuran layu? Simak cara menyimpan sayuran di kulkas agar awet hingga satu minggu...', date: '8 Mei 2026' },
]
</script>

<template>
  <div class="min-h-screen bg-gray-50 pb-20 font-sans text-gray-800">
    <Navbar />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      
      <div class="text-center mb-12 py-8 bg-white rounded-3xl border border-gray-100">
        <h1 class="text-4xl font-black text-gray-900 mb-3">inSend Blog 📝</h1>
        <p class="text-gray-500 max-w-2xl mx-auto">Portal berita seputar sayuran, bahan masakan sehat, tips & trik dapur, serta resep-resep pilihan terbaik untuk keluarga Anda.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="post in posts" :key="post.id" class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow cursor-pointer group">
            <div class="h-56 bg-gray-200 overflow-hidden relative">
                <img :src="post.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span class="absolute top-4 left-4 bg-freshco-green text-white px-3 py-1 rounded-full text-xs font-bold">{{ post.category }}</span>
            </div>
            <div class="p-6">
                <p class="text-xs text-gray-400 mb-2 font-medium">{{ post.date }}</p>
                <h3 class="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-freshco-green transition-colors">{{ post.title }}</h3>
                <p class="text-sm text-gray-500 line-clamp-3 mb-4">{{ post.excerpt }}</p>
                <a href="#" class="text-freshco-green font-bold text-sm flex items-center gap-1 group-hover:underline">Baca Selengkapnya →</a>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>
