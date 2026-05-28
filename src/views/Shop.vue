<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import Navbar from '../components/layout/Navbar.vue'
import Footer from '../components/layout/Footer.vue'
import ProductCard from '../components/ui/ProductCard.vue'
import { useCart } from '../store/cart'
import { useRoute, useRouter } from 'vue-router'

const { addToCart } = useCart()
const route = useRoute()
const router = useRouter()

const products = ref<any[]>([])
const loading = ref(true)
const categories = ['All', 'Sayuran', 'Buah', 'Daging', 'Seafood', 'Bumbu', 'Susu & Telur', 'Camilan']
const selectedCategory = ref(route.query.category as string || 'All')

// Pagination state
const currentPage = ref(1)
const lastPage = ref(1)

const fetchProducts = async (page = 1) => {
  loading.value = true
  try {
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
    let url = `${baseURL}/products?page=${page}&per_page=10`
    
    // Add search query if it exists
    if (route.query.q) {
        url += `&search=${route.query.q}`
    }
    // Add category filter
    if (selectedCategory.value !== 'All') {
        url += `&category=${selectedCategory.value}`
    }

    const response = await axios.get(url)
    if (response.data && response.data.data) {
      products.value = response.data.data
      if (response.data.meta) {
          currentPage.value = response.data.meta.current_page
          lastPage.value = response.data.meta.last_page
      }
    } else {
      products.value = response.data
    }
  } catch (error) {
    console.error('Error fetching products:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProducts(currentPage.value)
})

watch(() => route.query.q, () => {
    currentPage.value = 1
    fetchProducts(1)
})

watch(selectedCategory, () => {
    currentPage.value = 1
    fetchProducts(1)
})

const handleAddToCart = (product: any) => {
  const cartItem = {
    id: product._id || product.id,
    title: product.name || product.title,
    price: product.sale_price || product.base_price || product.price,
    imageUrl: product.images && product.images.length > 0 ? product.images[0] : (product.imageUrl || 'https://via.placeholder.com/150'),
  }
  addToCart(cartItem)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 font-sans text-gray-800">
    <Navbar />

    <div class="w-full mx-auto px-4 sm:px-8 lg:px-16 mt-6 pb-20">
      
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-black text-gray-900">
          <span v-if="route.query.q">Search Results for "{{ route.query.q }}"</span>
          <span v-else>All Products</span>
        </h1>
      </div>

      <!-- Categories Filter -->
      <div class="flex overflow-x-auto pb-4 mb-6 space-x-2 hide-scroll">
        <button 
            v-for="cat in categories" 
            :key="cat"
            @click="selectedCategory = cat"
            :class="selectedCategory === cat ? 'bg-freshco-green text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'"
            class="px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all"
        >
            {{ cat }}
        </button>
      </div>

      <div v-if="loading" class="text-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-freshco-green mx-auto"></div>
      </div>
      
      <div v-else-if="products.length === 0" class="text-center py-20 text-gray-500">
         No products found.
      </div>

      <div v-else>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 mb-10">
          <ProductCard 
            v-for="product in products" 
            :key="product._id || product.id"
            :id="product._id || product.id"
            :title="product.name || product.title"
            :price="product.sale_price || product.base_price || product.price"
            :original-price="product.sale_price ? product.base_price : product.original_price"
            :category="product.category?.name || product.category || 'Grocery'"
            :image-url="product.images && product.images.length > 0 ? product.images[0] : (product.imageUrl || 'https://via.placeholder.com/200')"
            :unit="product.unit"
            :rating="product.rating"
            :reviews="product.reviews"
            :discount="product.discount"
            @add-to-cart="handleAddToCart(product)"
            @click="router.push(`/shop/${product._id || product.id}`)"
            class="cursor-pointer"
          />
        </div>

        <!-- Pagination -->
        <div v-if="lastPage > 1" class="flex justify-center items-center gap-2">
            <button 
                @click="fetchProducts(currentPage - 1)" 
                :disabled="currentPage === 1"
                class="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-200 text-gray-600 disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
                &lt;
            </button>
            <button 
                v-for="page in lastPage" :key="page"
                @click="fetchProducts(page)"
                :class="page === currentPage ? 'bg-freshco-green text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'"
                class="w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors"
            >
                {{ page }}
            </button>
            <button 
                @click="fetchProducts(currentPage + 1)" 
                :disabled="currentPage === lastPage"
                class="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-200 text-gray-600 disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
                &gt;
            </button>
        </div>
      </div>
    </div>
    
    <Footer />
  </div>
</template>

<style scoped>
.hide-scroll::-webkit-scrollbar {
  display: none;
}
.hide-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
