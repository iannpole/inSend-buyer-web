<script setup lang="ts">
import { computed } from 'vue'
import { Heart } from 'lucide-vue-next'
import { useWishlist } from '../../store/wishlist'

const props = defineProps<{
  id?: string
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

const discountPercentage = computed(() => {
  if (props.originalPrice && props.originalPrice > props.price) {
    const discount = ((props.originalPrice - props.price) / props.originalPrice) * 100
    return Math.round(discount)
  }
  return null
})

const { isInWishlist, toggleWishlist } = useWishlist()

const handleWishlistClick = async (e: Event, productId?: string) => {
  e.stopPropagation() // Prevent card click
  if (productId) {
    await toggleWishlist(productId)
  }
}

const emit = defineEmits(['add-to-cart'])

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  if (target) {
    target.src = 'https://via.placeholder.com/200?text=No+Image';
  }
}
</script>

<template>
  <div class="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col h-full">
    
    <!-- Discount Badge -->
    <span v-if="discountPercentage" class="absolute top-4 left-4 z-10 px-2.5 py-1 text-xs font-black bg-[#FF8904] text-white rounded-lg shadow-md">
      {{ discountPercentage }}% OFF
    </span>
    <span v-else-if="discount" class="absolute top-4 left-4 z-10 px-2.5 py-1 text-xs font-black bg-[#FF8904] text-white rounded-lg shadow-md">
      {{ discount }}
    </span>

    <!-- Wishlist Button -->
    <button 
      @click="(e) => handleWishlistClick(e, id)"
      class="absolute top-4 right-4 z-10 transition-colors"
      :class="id && isInWishlist(id) ? 'text-red-500 hover:text-red-600' : 'text-gray-300 hover:text-red-500'"
    >
      <Heart class="h-5 w-5" :class="id && isInWishlist(id) ? 'fill-current' : ''" />
    </button>

    <!-- Image -->
    <div class="relative w-full aspect-[4/3] bg-gray-50 overflow-hidden">
      <img 
        :src="imageUrl" 
        :alt="title"
        @error="handleImageError"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
    </div>

    <!-- Content -->
    <div class="p-4 flex-grow flex flex-col">
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
