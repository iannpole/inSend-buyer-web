<script setup lang="ts">
import { ShoppingCart, Search, Menu, UserCircle, Heart, MapPin } from 'lucide-vue-next'
import { useCart } from '../../store/cart'
import { ref } from 'vue'

const { cartCount, toggleCart } = useCart()

const showLocationModal = ref(false)
const selectedLocation = ref('Pilih Lokasi Pengiriman')

</script>

<template>
  <nav class="sticky top-0 z-50 w-full bg-white border-b border-gray-100 transition-all duration-300 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-20">
        
        <!-- Logo -->
        <div class="flex-shrink-0 flex items-center cursor-pointer gap-2">
          <div class="bg-freshco-green text-white p-1.5 rounded-lg">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-leaf"><path d="M11 20A7 7 0 0 1 14 6c5 0 8 4 8 4-4 8-11 11-11 11z"/><path d="M2 15s4-7 12-7"/></svg>
          </div>
          <span class="text-2xl font-black text-gray-900 tracking-tight">inSend</span>
        </div>

        <!-- Desktop Nav Links -->
        <div class="hidden lg:flex space-x-8">
          <a href="#" class="text-freshco-green font-semibold">Home</a>
          <a href="#" class="text-gray-600 hover:text-freshco-green font-medium transition-colors">Shop <span class="text-xs">▼</span></a>
          <a href="#" class="text-gray-600 hover:text-freshco-green font-medium transition-colors">Vendor <span class="text-xs">▼</span></a>
          <a href="#" class="text-gray-600 hover:text-freshco-green font-medium transition-colors">Blog</a>
          <a href="#" class="text-gray-600 hover:text-freshco-green font-medium transition-colors">Contact</a>
        </div>

        <!-- Search Bar (Desktop) -->
        <div class="hidden md:flex flex-1 max-w-md mx-8">
          <div class="relative w-full">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search class="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              class="block w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full leading-5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-freshco-green/20 focus:border-freshco-green sm:text-sm transition-all" 
              placeholder="Search products..." 
            />
          </div>
        </div>

        <!-- Right Side Icons & Location -->
        <div class="flex items-center space-x-4">
          <button @click="showLocationModal = true" class="hidden md:flex items-center gap-1 text-sm text-gray-600 hover:text-freshco-green transition-colors mr-2">
            <MapPin class="h-4 w-4" />
            <span class="max-w-[100px] truncate">{{ selectedLocation }}</span>
          </button>
        
          <button class="text-gray-600 hover:text-freshco-green transition-colors p-2 rounded-full hover:bg-gray-50">
            <Heart class="h-6 w-6 stroke-[1.5]" />
          </button>
          
          <button @click="toggleCart" class="relative text-gray-600 hover:text-freshco-green transition-colors p-2 rounded-full hover:bg-gray-50">
            <ShoppingCart class="h-6 w-6 stroke-[1.5]" />
            <span v-if="cartCount > 0" class="absolute top-1 right-1 flex items-center justify-center h-4 w-4 text-[10px] font-bold text-white bg-freshco-green rounded-full">
              {{ cartCount }}
            </span>
          </button>

          <button class="text-gray-600 hover:text-freshco-green transition-colors p-2 rounded-full hover:bg-gray-50">
            <UserCircle class="h-6 w-6 stroke-[1.5]" />
          </button>
          
          <button class="lg:hidden text-gray-600 hover:text-freshco-green transition-colors p-2">
            <Menu class="h-6 w-6 stroke-[1.5]" />
          </button>
        </div>
      </div>
    </div>
  </nav>
  
  <!-- Simple Location Modal -->
  <div v-if="showLocationModal" class="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center">
    <div class="bg-white rounded-2xl p-6 w-full max-w-md">
       <h3 class="text-xl font-bold mb-4">Pilih Lokasi Pengiriman</h3>
       <input type="text" placeholder="Masukkan alamat atau kode pos" class="w-full border border-gray-200 rounded-lg p-3 mb-4 focus:outline-none focus:border-freshco-green" />
       <div class="flex justify-end gap-2">
         <button @click="showLocationModal = false" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Batal</button>
         <button @click="selectedLocation = 'Jakarta Selatan'; showLocationModal = false" class="px-4 py-2 bg-freshco-green text-white rounded-lg">Simpan</button>
       </div>
    </div>
  </div>
</template>
