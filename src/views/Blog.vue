<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Navbar from '../components/layout/Navbar.vue'


const posts = ref<any[]>([])
const sidebarData = ref<any>({ categories: [], recent_posts: [], tags: [] })
const selectedPost = ref<any>(null)
const loading = ref(true)

const fetchPosts = async (category?: string) => {
    loading.value = true
    try {
        const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
        let url = `${baseURL}/blog`
        if (category) url += `?category=${encodeURIComponent(category)}`
        
        const response = await axios.get(url)
        posts.value = response.data.data.data // Pagination data
    } catch (error) {
        console.error('Failed to fetch blog posts', error)
    } finally {
        loading.value = false
    }
}

const fetchSidebar = async () => {
    try {
        const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
        const response = await axios.get(`${baseURL}/blog/sidebar`)
        sidebarData.value = response.data.data
    } catch (error) {
        console.error('Failed to fetch sidebar', error)
    }
}

const fetchDetail = async (id: string) => {
    loading.value = true
    try {
        const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
        const response = await axios.get(`${baseURL}/blog/${id}`)
        selectedPost.value = response.data.data
    } catch (error) {
        console.error('Failed to fetch post detail', error)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchPosts()
    fetchSidebar()
})

const getImageUrl = (img: string) => {
    if (!img) return 'https://via.placeholder.com/600?text=No+Image'
    if (img.startsWith('http')) return img
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
    const storageBase = apiBase.replace('/api', '')
    return `${storageBase}/storage/${img}`
}

const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
}

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  if (target) target.src = 'https://via.placeholder.com/600?text=Blog';
}

const selectCategory = (category: string) => {
    selectedPost.value = null
    fetchPosts(category)
}

const formatContent = (content: string) => {
    if (!content) return ''
    // Basic Markdown/HTML formatting (just replacing newlines for now if it's text)
    return content.replace(/\n/g, '<br/>')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 pb-20 font-sans text-gray-800">
    <Navbar />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      
      <div class="text-center mb-10 py-8 bg-white rounded-3xl border border-gray-100 shadow-sm" v-if="!selectedPost">
        <h1 class="text-4xl font-black text-gray-900 mb-3">inSend Blog </h1>
        <p class="text-gray-500 max-w-2xl mx-auto">Portal berita seputar sayuran, bahan masakan sehat, tips & trik dapur, serta resep-resep pilihan.</p>
      </div>

      <div class="flex flex-col lg:flex-row gap-8">
          
          <!-- Main Content -->
          <div class="flex-1">
              <div v-if="loading" class="flex justify-center items-center py-20">
                  <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-freshco-green"></div>
              </div>

              <!-- List View -->
              <div v-else-if="!selectedPost">
                  <div v-if="posts.length === 0" class="text-center py-12 bg-white rounded-2xl border border-gray-100">
                      <p class="text-gray-500">Belum ada artikel saat ini.</p>
                  </div>
                  <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div v-for="post in posts" :key="post._id" @click="fetchDetail(post.slug || post._id)" class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer group flex flex-col transform hover:-translate-y-1">
                        <div class="h-48 bg-gray-200 overflow-hidden relative">
                            <img :src="getImageUrl(post.image)" @error="handleImageError" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <span class="absolute top-4 left-4 bg-freshco-green text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">{{ post.category }}</span>
                        </div>
                        <div class="p-6 flex flex-col flex-1">
                            <p class="text-xs text-gray-400 mb-3 font-medium flex items-center gap-1">📅 {{ formatDate(post.published_at || post.created_at) }}</p>
                            <h3 class="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-freshco-green transition-colors leading-tight">{{ post.title }}</h3>
                            <p class="text-sm text-gray-500 line-clamp-3 mb-6">{{ post.excerpt || 'Baca selengkapnya untuk detail artikel ini...' }}</p>
                            <span class="text-freshco-green font-bold text-sm flex items-center gap-1 mt-auto group-hover:gap-2 transition-all">Baca Selengkapnya &rarr;</span>
                        </div>
                    </div>
                  </div>
              </div>

              <!-- Detail View -->
              <div v-else class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  <div class="h-64 sm:h-96 w-full relative">
                      <img :src="getImageUrl(selectedPost.image)" @error="handleImageError" class="w-full h-full object-cover" />
                      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <button @click="selectedPost = null" class="absolute top-6 left-6 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white transition-colors border border-white/20">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                      </button>
                      <div class="absolute bottom-6 left-6 right-6 text-white">
                          <span class="bg-freshco-green px-3 py-1 rounded-full text-xs font-bold mb-3 inline-block uppercase tracking-wider">{{ selectedPost.category }}</span>
                          <h1 class="text-3xl sm:text-4xl font-black leading-tight mb-3">{{ selectedPost.title }}</h1>
                          <p class="text-white/80 text-sm flex items-center gap-2"><span>📅 {{ formatDate(selectedPost.published_at || selectedPost.created_at) }}</span> • <span>Admin</span></p>
                      </div>
                  </div>
                  <div class="p-6 sm:p-10">
                      <div class="prose prose-lg max-w-none text-gray-700 leading-relaxed" v-html="formatContent(selectedPost.content)">
                      </div>
                      <div class="mt-8 flex flex-wrap gap-2" v-if="selectedPost.tags && selectedPost.tags.length > 0">
                          <span v-for="tag in selectedPost.tags" :key="tag" class="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium">#{{ tag }}</span>
                      </div>
                      <div class="mt-12 pt-8 border-t border-gray-100">
                          <button @click="selectedPost = null" class="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-xl transition-colors w-full sm:w-auto">
                              ← Kembali ke Daftar Blog
                          </button>
                      </div>
                  </div>
              </div>
          </div>

          <!-- Sidebar -->
          <div class="w-full lg:w-80 space-y-8">
              <!-- Search Widget -->
              <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">🔍 Cari Artikel</h3>
                  <div class="relative">
                      <input type="text" placeholder="Ketik kata kunci..." class="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-4 pr-10 focus:outline-none focus:border-freshco-green focus:ring-1 focus:ring-freshco-green transition-colors text-sm">
                      <button class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-freshco-green">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                      </button>
                  </div>
              </div>

              <!-- Categories Widget -->
              <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm" v-if="sidebarData.categories && sidebarData.categories.length > 0">
                  <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">📂 Kategori</h3>
                  <ul class="space-y-2">
                      <li>
                          <button @click="selectCategory('')" class="w-full flex items-center justify-between text-sm text-gray-600 hover:text-freshco-green py-1.5 transition-colors group">
                              <span>Semua Kategori</span>
                          </button>
                      </li>
                      <li v-for="cat in sidebarData.categories" :key="cat.name">
                          <button @click="selectCategory(cat.name)" class="w-full flex items-center justify-between text-sm text-gray-600 hover:text-freshco-green py-1.5 transition-colors group">
                              <span>{{ cat.name }}</span>
                              <span class="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md text-xs font-medium group-hover:bg-[#E8F3EF] group-hover:text-freshco-green transition-colors">{{ cat.count }}</span>
                          </button>
                      </li>
                  </ul>
              </div>

              <!-- Recent Posts Widget -->
              <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm" v-if="sidebarData.recent_posts && sidebarData.recent_posts.length > 0">
                  <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">🔥 Artikel Terbaru</h3>
                  <div class="space-y-4">
                      <div v-for="recent in sidebarData.recent_posts" :key="recent._id" @click="fetchDetail(recent.slug || recent._id)" class="flex gap-3 cursor-pointer group">
                          <div class="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                              <img :src="getImageUrl(recent.image)" @error="handleImageError" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                          </div>
                          <div>
                              <h4 class="text-sm font-bold text-gray-900 leading-tight group-hover:text-freshco-green transition-colors line-clamp-2 mb-1">{{ recent.title }}</h4>
                              <p class="text-xs text-gray-400">📅 {{ formatDate(recent.published_at || recent.created_at) }}</p>
                          </div>
                      </div>
                  </div>
              </div>

              <!-- Tags Widget -->
              <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm" v-if="sidebarData.tags && sidebarData.tags.length > 0">
                  <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">🏷️ Tags Populer</h3>
                  <div class="flex flex-wrap gap-2">
                      <button v-for="tag in sidebarData.tags" :key="tag" class="px-3 py-1.5 bg-gray-50 border border-gray-100 text-gray-600 rounded-lg text-xs font-medium hover:bg-[#E8F3EF] hover:text-freshco-green hover:border-freshco-green transition-colors">
                          #{{ tag }}
                      </button>
                  </div>
              </div>

          </div>

      </div>
    </div>
  </div>
</template>
