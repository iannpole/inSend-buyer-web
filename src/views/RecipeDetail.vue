<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { ChevronLeft, Heart, Clock, Flame, Users, ShoppingCart } from 'lucide-vue-next'
import { useCart } from '../store/cart'

const route = useRoute()
const router = useRouter()
const { addToCart } = useCart()

const recipe = ref<any>(null)
const loading = ref(true)
const error = ref('')
const isFavorite = ref(false)

const getImageUrl = (img: string) => {
    if (!img) return ''
    if (img.startsWith('http')) return img
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
    const storageBase = apiBase.replace('/api', '')
    return `${storageBase}/storage/${img}`
}

const fetchRecipe = async () => {
    loading.value = true
    error.value = ''
    try {
        const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
        const response = await axios.get(`${baseURL}/recipes/${route.params.id}`)
        
        if (response.data?.data) {
            recipe.value = response.data.data
        } else if (response.data) {
            recipe.value = response.data
        }
    } catch (err: any) {
        console.error('Error fetching recipe:', err)
        error.value = err.response?.status === 404 
            ? 'Resep tidak ditemukan.' 
            : 'Gagal memuat detail resep. Pastikan backend API berjalan.'
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchRecipe()
})

const heroImage = () => {
    if (!recipe.value) return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&fit=crop'
    const imgs = recipe.value.images || []
    if (imgs.length > 0) return getImageUrl(imgs[0])
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&fit=crop'
}

const handleAddAllToCart = () => {
    const ings = recipe.value?.ingredients || []
    ings.forEach((ing: any, idx: number) => {
        addToCart({
            id: `recipe-ing-${recipe.value.id}-${idx}`,
            title: ing.name || ing,
            price: 15000,
            imageUrl: 'https://via.placeholder.com/80?text=' + encodeURIComponent(typeof ing === 'string' ? ing : (ing.name || 'Bahan'))
        }, 1)
    })
}

// Determine ingredient display format — backend can return [{name, amount, unit}] or just strings
const getIngredientName = (ing: any): string => {
    if (typeof ing === 'string') return ing
    if (ing.name) {
        let label = ing.name
        if (ing.amount) label = `${ing.amount} ${ing.unit || ''} ${label}`.trim()
        return label
    }
    return String(ing)
}



// Get step text — backend returns [{step, instruction}] or [{step, text}] or just strings
const getStepText = (step: any): string => {
    if (typeof step === 'string') return step
    return step.instruction || step.text || step.description || String(step)
}
const getStepNumber = (step: any, idx: string | number): number => {
    if (typeof step === 'object' && step.step) return step.step
    return Number(idx) + 1
}
</script>

<template>
  <!-- Loading -->
  <div v-if="loading" class="min-h-screen bg-gray-50 flex items-center justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-freshco-green"></div>
  </div>
  
  <!-- Error -->
  <div v-else-if="error" class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <p class="text-red-500 text-lg font-bold mb-4">{{ error }}</p>
      <button @click="router.back()" class="bg-freshco-green text-white px-6 py-3 rounded-xl font-bold hover:bg-[#0c513e] transition-colors">
          ← Kembali
      </button>
  </div>

  <!-- Recipe Detail -->
  <div v-else-if="recipe" class="min-h-screen bg-[#FDFCF8] font-sans pb-20 relative">
      <!-- Top Image Header -->
      <div class="relative h-[45vh] w-full">
          <img :src="heroImage()" class="w-full h-full object-cover rounded-b-[40px]" :alt="recipe.title" />
          
          <!-- Navigation overlays -->
          <div class="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
              <button @click="router.back()" class="w-12 h-12 bg-black/30 backdrop-blur-md rounded-2xl flex items-center justify-center text-white hover:bg-black/40 transition-colors">
                  <ChevronLeft class="w-6 h-6" />
              </button>
              <button @click="isFavorite = !isFavorite" class="w-12 h-12 bg-black/30 backdrop-blur-md rounded-2xl flex items-center justify-center text-white hover:bg-black/40 transition-colors">
                  <Heart class="w-6 h-6" :class="isFavorite ? 'fill-red-500 text-red-500' : ''" />
              </button>
          </div>
      </div>

      <!-- Overlapping Info Card -->
      <div class="max-w-2xl mx-auto px-4 sm:px-6 -mt-16 relative z-20">
          <div class="bg-white rounded-[32px] p-8 shadow-xl shadow-gray-200/50 text-center border border-gray-50">
              <h1 class="text-3xl font-black text-gray-900 mb-2">{{ recipe.title }}</h1>
              <p class="text-gray-400 text-sm mb-6">{{ (recipe.ingredients || []).length }} ingredients</p>
              
              <div class="flex justify-center items-center gap-6 md:gap-10 text-gray-500 text-sm font-medium">
                  <div class="flex items-center gap-2">
                      <Clock class="w-5 h-5 text-yellow-500" />
                      <span>{{ recipe.total_time || recipe.prep_time || '30' }} min</span>
                  </div>
                  <div v-if="recipe.nutrition?.calories || recipe.difficulty" class="flex items-center gap-2">
                      <Flame class="w-5 h-5 text-orange-500" />
                      <span>{{ recipe.nutrition?.calories || recipe.difficulty || 'Easy' }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                      <Users class="w-5 h-5 text-orange-500" />
                      <span>{{ recipe.servings || '4' }} porsi</span>
                  </div>
              </div>
          </div>
      </div>

      <!-- Description -->
      <div v-if="recipe.description" class="max-w-2xl mx-auto px-6 mt-8">
          <p class="text-gray-600 text-sm leading-relaxed">{{ recipe.description }}</p>
      </div>

      <!-- Main Content -->
      <div class="max-w-2xl mx-auto px-6 mt-8">
          
          <!-- Ingredients Section -->
          <div class="mb-10" v-if="recipe.ingredients && recipe.ingredients.length > 0">
              <div class="flex justify-between items-end mb-6">
                  <h2 class="text-xl font-bold text-gray-900">Ingredients</h2>
                  <button @click="handleAddAllToCart" class="text-sm font-bold text-freshco-green hover:underline flex items-center gap-1">
                      <ShoppingCart class="w-4 h-4" />
                      Add all to cart
                  </button>
              </div>
              
              <div class="space-y-3">
                  <div v-for="(ing, idx) in recipe.ingredients" :key="idx" 
                       class="flex items-center gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                      <span class="text-freshco-green font-bold text-sm">{{ Number(idx) + 1 }}.</span>
                      <span class="text-gray-800 font-medium text-sm flex-1">{{ getIngredientName(ing) }}</span>
                  </div>
              </div>
          </div>

          <!-- Steps/Instructions Section -->
          <div v-if="recipe.steps && recipe.steps.length > 0">
              <h2 class="text-xl font-bold text-gray-900 mb-6">Cooking Instructions</h2>
              <div class="space-y-6">
                  <div v-for="(step, idx) in recipe.steps" :key="idx" class="bg-[#FFF9F2] p-6 rounded-3xl">
                      <h4 class="text-orange-400 font-bold mb-3">Step {{ getStepNumber(step, idx) }}</h4>
                      <p class="text-gray-700 leading-relaxed text-sm font-medium">{{ getStepText(step) }}</p>
                  </div>
              </div>
          </div>

          <!-- Tags -->
          <div v-if="recipe.tags && recipe.tags.length > 0" class="mt-8">
              <div class="flex flex-wrap gap-2">
                  <span v-for="tag in recipe.tags" :key="tag" class="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">#{{ tag }}</span>
              </div>
          </div>

      </div>
  </div>
</template>
