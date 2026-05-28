<script setup lang="ts">
import { onMounted } from 'vue'
import Navbar from '../components/layout/Navbar.vue'
import ProductCard from '../components/ui/ProductCard.vue'
import { Heart } from 'lucide-vue-next'
import { useWishlist } from '../store/wishlist'
import { useCart } from '../store/cart'
import { useRouter } from 'vue-router'

const { wishlistItems, isLoading, fetchWishlist } = useWishlist()
const { addToCart } = useCart()
const router = useRouter()

onMounted(() => {
  fetchWishlist()
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
  <div class="min-h-screen bg-gray-50 pb-20 font-sans text-gray-800">
    <Navbar />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      
      <div class="flex items-center gap-3 mb-8">
        <div class="p-3 bg-red-100 text-red-500 rounded-full">
            <Heart class="w-6 h-6 fill-current" />
        </div>
        <h1 class="text-3xl font-black text-gray-900">Wishlist Saya</h1>
      </div>

      <div v-if="isLoading" class="text-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-freshco-green mx-auto"></div>
      </div>

      <div v-else-if="wishlistItems.length === 0" class="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
        <Heart class="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <h2 class="text-xl font-bold text-gray-900 mb-2">Wishlist Masih Kosong</h2>
        <p class="text-gray-500 mb-6">Anda belum menambahkan produk apapun ke wishlist.</p>
        <RouterLink to="/shop" class="bg-freshco-green text-white px-6 py-3 rounded-xl font-bold hover:bg-[#0c513e] transition-colors inline-block">
            Mulai Belanja
        </RouterLink>
      </div>
      
      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <ProductCard 
          v-for="item in wishlistItems" 
          :key="item.id"
          :id="item.product?.id || item.product_id"
          :title="item.product?.name || 'Produk tidak tersedia'"
          :price="item.product?.sale_price || item.product?.base_price || 0"
          :original-price="item.product?.sale_price ? item.product?.base_price : undefined"
          :category="item.product?.category_slug || 'Grocery'"
          :image-url="item.product?.images && item.product.images.length > 0 ? item.product.images[0] : 'https://via.placeholder.com/200'"
          :unit="item.product?.unit"
          :rating="item.product?.average_rating"
          :reviews="item.product?.review_count"
          :discount="item.product?.is_discounted ? `${item.product?.discount_percentage}% OFF` : undefined"
          @add-to-cart="handleAddToCart(item.product)"
          @click="router.push(`/shop/${item.product?.id || item.product_id}`)"
          class="cursor-pointer"
        />
      </div>
    </div>
  </div>
</template>
