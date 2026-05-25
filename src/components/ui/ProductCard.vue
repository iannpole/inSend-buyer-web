<script setup lang="ts">
import { Heart } from 'lucide-vue-next'

defineProps<{
  title: string
  price: number
  imageUrl: string
  category: string
  originalPrice?: number
  unit?: string
  rating?: number
  reviews?: number
  discount?: string
}>()

const emit = defineEmits(['add-to-cart'])

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}
</script>

<template>
  <div class="group relative bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col h-full">
    
    <!-- Discount Badge -->
    <span v-if="discount" class="absolute top-4 left-4 z-10 px-2 py-0.5 text-[10px] font-bold bg-white text-gray-800 rounded shadow-sm">
      {{ discount }}
    </span>

    <!-- Wishlist Button -->
    <button class="absolute top-4 right-4 z-10 text-gray-300 hover:text-red-500 transition-colors">
      <Heart class="h-5 w-5" />
    </button>

    <!-- Image -->
    <div class="relative w-full aspect-[4/3] bg-white rounded-xl overflow-hidden mb-3 flex items-center justify-center p-2">
      <img 
        :src="imageUrl" 
        :alt="title"
        class="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
      />
    </div>

    <!-- Content -->
    <div class="flex-grow flex flex-col">
      <span class="text-xs text-gray-500 font-medium mb-1">{{ category }}</span>
      <h3 class="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight mb-1 flex-grow">
        {{ title }}
      </h3>
      
      <!-- Unit & Rating -->
      <div class="flex items-center justify-between mt-auto mb-3">
        <span class="text-xs text-gray-500">{{ unit || '1 kg' }}</span>
        <div v-if="rating" class="flex items-center gap-1 text-xs text-gray-500">
          <span class="text-yellow-400 text-[10px]">★</span>
          <span>{{ rating }} <span v-if="reviews">({{ reviews }})</span></span>
        </div>
      </div>

      <!-- Price & Add to Cart -->
      <div class="flex items-center justify-between">
        <div class="flex flex-col">
          <span class="text-sm font-bold text-gray-900">{{ formatPrice(price) }}</span>
          <span v-if="originalPrice" class="text-[10px] text-gray-400 line-through">{{ formatPrice(originalPrice) }}</span>
        </div>
        <button 
          @click="emit('add-to-cart')"
          class="flex items-center justify-center gap-1 bg-[#E8F3EF] hover:bg-freshco-green text-freshco-green hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
        >
          <span>+</span>
          <span>Cart</span>
        </button>
      </div>
    </div>
  </div>
</template>
