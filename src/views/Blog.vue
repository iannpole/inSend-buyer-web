<script setup lang="ts">
import { ref, computed } from 'vue'
import Navbar from '../components/layout/Navbar.vue'

const posts = [
    { id: 1, title: 'Manfaat Sayur Bayam Untuk Kesehatan Mata', category: 'Kesehatan', image: 'https://images.unsplash.com/photo-1576044670005-502a2818c214?w=600&fit=crop', excerpt: 'Bayam mengandung banyak vitamin A yang sangat baik untuk menjaga kesehatan dan ketajaman mata Anda...', content: 'Bayam adalah sayuran hijau yang kaya akan nutrisi, terutama vitamin A. Vitamin ini sangat penting untuk memelihara kesehatan mata, mencegah katarak, dan rabun senja. Mengkonsumsi bayam secara teratur juga dapat meningkatkan kekebalan tubuh. Anda bisa mengolah bayam menjadi sayur bening, smoothie, atau tumisan.', date: '12 Mei 2026' },
    { id: 2, title: '5 Resep Olahan Daging Sapi Super Praktis', category: 'Resep', image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5e?w=600&fit=crop', excerpt: 'Punya stok daging sapi di rumah? Yuk coba 5 resep olahan daging yang mudah dibuat dan lezat ini...', content: 'Daging sapi bisa diolah menjadi berbagai macam masakan. Berikut adalah 5 ide praktis: 1. Sapi Lada Hitam 2. Tumis Daging Cincang Buncis 3. Semur Daging 4. Teriyaki Beef 5. Daging Suwir Pedas. Semua bahan-bahannya bisa Anda beli langsung melalui aplikasi inSend.', date: '10 Mei 2026' },
    { id: 3, title: 'Tips Menyimpan Sayuran Agar Tetap Segar 1 Minggu', category: 'Tips & Trik', image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=600&fit=crop', excerpt: 'Sering membuang sayuran layu? Simak cara menyimpan sayuran di kulkas agar awet hingga satu minggu...', content: 'Menyimpan sayuran yang benar sangat penting. Pertama, jangan mencuci sayuran sebelum disimpan karena kelembapan memicu pembusukan. Kedua, gunakan wadah kedap udara atau lapisi dengan tisu dapur untuk menyerap air berlebih. Ketiga, pisahkan buah dan sayur karena buah memproduksi gas etilen yang bisa membuat sayuran cepat layu.', date: '8 Mei 2026' },
]

const selectedPost = ref<any>(null)

const formattedParagraphs = computed(() => {
    if (!selectedPost.value || !selectedPost.value.content) return []
    const parts = selectedPost.value.content.split('. ')
    return parts.map((p: string, i: number) => {
        return i < parts.length - 1 ? p + '.' : p;
    })
})

const handleListImageError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  if (target) target.src = 'https://via.placeholder.com/600?text=Blog';
}

const handleDetailImageError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  if (target) target.src = 'https://via.placeholder.com/800?text=Blog';
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 pb-20 font-sans text-gray-800">
    <Navbar />

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      
      <!-- List View -->
      <div v-if="!selectedPost">
          <div class="text-center mb-12 py-8 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <h1 class="text-4xl font-black text-gray-900 mb-3">inSend Blog 📝</h1>
            <p class="text-gray-500 max-w-2xl mx-auto">Portal berita seputar sayuran, bahan masakan sehat, tips & trik dapur, serta resep-resep pilihan.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div v-for="post in posts" :key="post.id" @click="selectedPost = post" class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer group transform hover:-translate-y-1">
                <div class="h-48 bg-gray-200 overflow-hidden relative">
                    <img :src="post.image" @error="handleListImageError" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span class="absolute top-4 left-4 bg-freshco-green text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">{{ post.category }}</span>
                </div>
                <div class="p-5 flex flex-col h-full">
                    <p class="text-xs text-gray-400 mb-2 font-medium flex items-center gap-1">📅 {{ post.date }}</p>
                    <h3 class="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-freshco-green transition-colors">{{ post.title }}</h3>
                    <p class="text-sm text-gray-500 line-clamp-3 mb-4">{{ post.excerpt }}</p>
                    <span class="text-freshco-green font-bold text-sm flex items-center gap-1 mt-auto">Baca Selengkapnya →</span>
                </div>
            </div>
          </div>
      </div>

      <!-- Detail View -->
      <div v-else class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="h-64 sm:h-96 w-full relative">
              <img :src="selectedPost.image" @error="handleDetailImageError" class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <button @click="selectedPost = null" class="absolute top-6 left-6 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
              </button>
              <div class="absolute bottom-6 left-6 right-6 text-white">
                  <span class="bg-freshco-green px-3 py-1 rounded-full text-xs font-bold mb-3 inline-block uppercase tracking-wider">{{ selectedPost.category }}</span>
                  <h1 class="text-2xl sm:text-4xl font-black leading-tight mb-2">{{ selectedPost.title }}</h1>
                  <p class="text-white/80 text-sm flex items-center gap-2"><span>📅 {{ selectedPost.date }}</span> • <span>Admin</span></p>
              </div>
          </div>
          <div class="p-6 sm:p-10">
              <div class="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  <p v-for="(paragraph, index) in formattedParagraphs" :key="index" class="mb-4">
                      {{ paragraph }}
                  </p>
              </div>
              <div class="mt-12 pt-8 border-t border-gray-100">
                  <button @click="selectedPost = null" class="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-xl transition-colors w-full sm:w-auto">
                      Kembali ke Daftar Blog
                  </button>
              </div>
          </div>
      </div>
      
    </div>
  </div>
</template>
