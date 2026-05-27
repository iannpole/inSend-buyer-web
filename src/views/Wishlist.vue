<script setup lang="ts">
import { ref } from 'vue'
import Navbar from '../components/layout/Navbar.vue'
import { Heart } from 'lucide-vue-next'

const wishlistItems = ref<any[]>([])

</script>

<template>
  <div class="min-h-screen bg-gray-50 pb-20 font-sans text-gray-800">
    <Navbar />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      
      <div class="flex items-center gap-3 mb-8">
        <div class="p-3 bg-red-100 text-red-500 rounded-full">
            <Heart class="w-6 h-6 fill-current" />
        </div>
        <h1 class="text-3xl font-black text-gray-900">Wishlist Saya</h1>
      </div>

      <div v-if="wishlistItems.length === 0" class="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
        <Heart class="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <h2 class="text-xl font-bold text-gray-900 mb-2">Wishlist Masih Kosong</h2>
        <p class="text-gray-500 mb-6">Anda belum menambahkan produk apapun ke wishlist.</p>
        <RouterLink to="/shop" class="bg-freshco-green text-white px-6 py-3 rounded-xl font-bold hover:bg-[#0c513e] transition-colors inline-block">
            Mulai Belanja
        </RouterLink>
      </div>
      
      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <!-- Wishlist Product Cards here if any -->
      </div>
    </div>
  </div>
</template>
