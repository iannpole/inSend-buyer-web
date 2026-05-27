<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Navbar from '../components/layout/Navbar.vue'
import Footer from '../components/layout/Footer.vue'
import { useRouter } from 'vue-router'

const recipes = ref<any[]>([])
const loading = ref(true)
const router = useRouter()

const getImageUrl = (img: string) => {
    if (!img) return ''
    if (img.startsWith('http')) return img
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
    const storageBase = apiBase.replace('/api', '')
    return `${storageBase}/storage/${img}`
}

const getRecipeImage = (recipe: any) => {
    const imgs = recipe.images || []
    if (imgs.length > 0) return getImageUrl(imgs[0])
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&fit=crop'
}

const fetchRecipes = async () => {
  loading.value = true
  try {
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
    const response = await axios.get(`${baseURL}/recipes`)
    if (response.data && response.data.data) {
      recipes.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching recipes:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchRecipes()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 font-sans text-gray-800">
    <Navbar />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 pb-20">
      
      <div class="flex items-center justify-between mb-8">
        <div>
            <h1 class="text-3xl font-black text-gray-900 mb-2">Healthy Recipes 🥗</h1>
            <p class="text-gray-500">Temukan inspirasi masakan sehat dan mudah dari inSend.</p>
        </div>
      </div>

      <div v-if="loading" class="text-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-freshco-green mx-auto"></div>
      </div>
      
      <div v-else-if="recipes.length === 0" class="text-center py-20 text-gray-500">
         Belum ada resep yang tersedia.
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="recipe in recipes" :key="recipe.id" 
             @click="router.push(`/recipes/${recipe.id}`)"
             class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow cursor-pointer group">
            <div class="h-48 bg-gray-200 overflow-hidden relative">
                <img :src="getRecipeImage(recipe)" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span class="absolute top-3 left-3 bg-white/90 backdrop-blur text-freshco-green px-3 py-1 rounded-full text-xs font-bold">{{ recipe.difficulty || 'Mudah' }}</span>
            </div>
            <div class="p-5">
                <h3 class="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-freshco-green transition-colors">{{ recipe.title }}</h3>
                <p class="text-sm text-gray-500 line-clamp-2 mb-4">{{ recipe.description }}</p>
                <div class="flex items-center gap-4 text-xs text-gray-400 font-medium border-t border-gray-50 pt-4">
                    <span class="flex items-center gap-1">⏰ {{ recipe.total_time || recipe.prep_time || '30' }} min</span>
                    <span v-if="recipe.servings" class="flex items-center gap-1">👥 {{ recipe.servings }} porsi</span>
                    <span v-if="recipe.category" class="bg-gray-100 px-2 py-0.5 rounded text-gray-600">{{ recipe.category }}</span>
                </div>
            </div>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>
