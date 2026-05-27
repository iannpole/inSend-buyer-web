<script setup lang="ts">
import { ShoppingCart, Search, Menu, UserCircle, Heart, MapPin, ClipboardList } from 'lucide-vue-next'
import { useCart } from '../../store/cart'
import { useAuth } from '../../store/auth'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const { cartCount, toggleCart } = useCart()
const { isAuthenticated, user, clearAuth } = useAuth()
const router = useRouter()

const showLocationModal = ref(false)
const selectedLocation = ref('Pilih Lokasi Pengiriman')
const searchQuery = ref('')

const handleSearch = () => {
  if (searchQuery.value) {
    router.push({ path: '/shop', query: { q: searchQuery.value } })
  }
}
</script>

<template>
  <nav class="sticky top-0 z-50 w-full bg-white border-b border-gray-100 transition-all duration-300 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-20">
        
        <!-- Logo -->
        <RouterLink to="/" class="flex-shrink-0 flex items-center cursor-pointer gap-2">
          <span class="text-2xl font-black text-gray-900 tracking-tight mr-8">inSend</span>
        </RouterLink>

        <!-- Desktop Nav Links -->
        <div class="hidden lg:flex space-x-8">
          <RouterLink to="/" class="text-gray-600 hover:text-freshco-green font-medium transition-colors" active-class="text-freshco-green font-bold">Home</RouterLink>
          <RouterLink to="/shop" class="text-gray-600 hover:text-freshco-green font-medium transition-colors" active-class="text-freshco-green font-bold">Shop</RouterLink>
          <RouterLink to="/recipes" class="text-gray-600 hover:text-freshco-green font-medium transition-colors" active-class="text-freshco-green font-bold">Recipes</RouterLink>
          <RouterLink to="/blog" class="text-gray-600 hover:text-freshco-green font-medium transition-colors" active-class="text-freshco-green font-bold">Blog</RouterLink>
          <RouterLink to="/contact" class="text-gray-600 hover:text-freshco-green font-medium transition-colors" active-class="text-freshco-green font-bold">Contact</RouterLink>
        </div>

        <!-- Search Bar (Desktop) -->
        <div class="hidden md:flex flex-1 max-w-md mx-8">
          <form @submit.prevent="handleSearch" class="relative w-full">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search class="h-5 w-5 text-gray-400" />
            </div>
            <input 
              v-model="searchQuery"
              type="text" 
              class="block w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full leading-5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-freshco-green/20 focus:border-freshco-green sm:text-sm transition-all" 
              placeholder="Cari produk atau resep..." 
            />
          </form>
        </div>

        <!-- Right Side Icons & Location -->
        <div class="flex items-center space-x-4">
          <button @click="showLocationModal = true" class="hidden md:flex items-center gap-1 text-sm text-gray-600 hover:text-freshco-green transition-colors mr-2">
            <MapPin class="h-4 w-4" />
            <span class="max-w-[100px] truncate">{{ selectedLocation }}</span>
          </button>
        
          <RouterLink to="/wishlist" class="text-gray-600 hover:text-freshco-green transition-colors p-2 rounded-full hover:bg-gray-50">
            <Heart class="h-6 w-6 stroke-[1.5]" />
          </RouterLink>
          
          <button @click="toggleCart" class="relative text-gray-600 hover:text-freshco-green transition-colors p-2 rounded-full hover:bg-gray-50">
            <ShoppingCart class="h-6 w-6 stroke-[1.5]" />
            <span v-if="cartCount > 0" class="absolute top-1 right-1 flex items-center justify-center h-4 w-4 text-[10px] font-bold text-white bg-freshco-green rounded-full">
              {{ cartCount }}
            </span>
          </button>

          <RouterLink to="/orders" v-if="isAuthenticated" class="text-gray-600 hover:text-freshco-green transition-colors p-2 rounded-full hover:bg-gray-50" title="Orders">
            <ClipboardList class="h-6 w-6 stroke-[1.5]" />
          </RouterLink>

          <RouterLink :to="isAuthenticated ? '/profile' : '/login'" class="text-gray-600 hover:text-freshco-green transition-colors p-2 rounded-full hover:bg-gray-50">
            <UserCircle class="h-6 w-6 stroke-[1.5]" />
          </RouterLink>
          
          <button class="lg:hidden text-gray-600 hover:text-freshco-green transition-colors p-2">
            <Menu class="h-6 w-6 stroke-[1.5]" />
          </button>
        </div>
      </div>
    </div>
  </nav>
  
  <!-- Simple Location Modal -->
  <div v-if="showLocationModal" class="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center">
    <div class="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
       <h3 class="text-xl font-bold mb-4">Pilih Lokasi Pengiriman</h3>
       <input type="text" placeholder="Masukkan alamat atau kode pos" class="w-full border border-gray-200 rounded-lg p-3 mb-4 focus:outline-none focus:border-freshco-green" />
       <div class="flex justify-end gap-2">
         <button @click="showLocationModal = false" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Batal</button>
         <button @click="selectedLocation = 'Jakarta Selatan'; showLocationModal = false" class="px-4 py-2 bg-freshco-green text-white rounded-lg">Simpan</button>
       </div>
    </div>
  </div>
</template>
