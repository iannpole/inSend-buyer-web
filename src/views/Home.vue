<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Navbar from '../components/layout/Navbar.vue'
import ProductCard from '../components/ui/ProductCard.vue'
import { useCart } from '../store/cart'

const { addToCart } = useCart()

// Static Categories based on design
const categories = [
  { id: 1, name: 'Vegetables', icon: '🥬', image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=100&h=100&fit=crop' },
  { id: 2, name: 'Dairy', icon: '🥛', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=100&h=100&fit=crop' },
  { id: 3, name: 'Breads', icon: '🍞', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&h=100&fit=crop' },
  { id: 4, name: 'Seafood', icon: '🐟', image: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=100&h=100&fit=crop' },
  { id: 5, name: 'Biscuits', icon: '🍪', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=100&h=100&fit=crop' },
  { id: 6, name: 'Meat', icon: '🥩', image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5e?w=100&h=100&fit=crop' },
  { id: 7, name: 'Fruits', icon: '🍎', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=100&h=100&fit=crop' },
]

const products = ref<any[]>([])
const loading = ref(true)

// Fallback dummy products if API fails
const dummyProducts = [
  { id: 101, name: 'Organic Avocado', base_price: 3990, category: 'Vegetables', unit: '400g', images: ['https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&fit=crop'], rating: 4.8, reviews: 24, discount: '20% OFF' },
  { id: 102, name: 'Fresh Chicken Breast', base_price: 6490, original_price: 7490, category: 'Meat', unit: '500g', images: ['https://images.unsplash.com/photo-1604544525964-b58f44ff53c8?w=400&fit=crop'], rating: 4.9, reviews: 342, discount: 'Hot Deal' },
  { id: 103, name: 'Organic Carrots', base_price: 2790, category: 'Vegetables', unit: '1kg', images: ['https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&fit=crop'], rating: 4.7, reviews: 12 },
  { id: 104, name: 'Dairy Butter', base_price: 3490, category: 'Dairy', unit: '250g', images: ['https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&fit=crop'], rating: 4.5, reviews: 56, discount: 'Limited' },
  { id: 105, name: 'Basmati Rice', base_price: 5990, category: 'Breads', unit: '1kg', images: ['https://images.unsplash.com/photo-1586201375761-83865001e8ac?w=400&fit=crop'], rating: 4.9, reviews: 120 },
  { id: 106, name: 'Red Apples', base_price: 3290, category: 'Fruits', unit: '1kg', images: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6faa6?w=400&fit=crop'], rating: 4.6, reviews: 45 },
]

const fetchProducts = async () => {
  try {
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
    const response = await axios.get(`${baseURL}/products`)
    if (response.data && response.data.data) {
      products.value = response.data.data
    } else {
      products.value = response.data
    }
  } catch (error) {
    console.error('Error fetching products, using fallback:', error)
    products.value = dummyProducts
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProducts()
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

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <div class="flex flex-col lg:flex-row gap-8">
        
        <!-- Left Main Content -->
        <div class="flex-1 overflow-hidden">
          
          <!-- Hero Banner -->
          <div class="relative bg-freshco-green rounded-3xl overflow-hidden mb-10 h-[320px] md:h-[400px]">
            <div class="absolute right-0 bottom-0 h-full w-1/2 md:w-[60%] overflow-hidden">
              <img src="https://images.unsplash.com/photo-1600857062241-98e5dba7f214?q=80&w=800&fit=crop" class="object-cover h-full w-full object-center" alt="Fresh Groceries" />
              <div class="absolute inset-0 bg-gradient-to-r from-freshco-green via-freshco-green/80 to-transparent"></div>
            </div>
            
            <div class="relative z-10 px-8 md:px-12 py-12 h-full flex flex-col justify-center max-w-lg">
              <p class="text-white/80 text-sm md:text-base font-semibold mb-3 uppercase tracking-wider">FREE Delivery & 40% Discount</p>
              <h1 class="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
                Your Trusted Source for <span class="text-freshco-accent">Fresh & Healthy</span> Foods
              </h1>
              <p class="text-white/90 text-sm mb-8">
                Experience the convenience of hassle-free shopping with quick delivery for all your favorite products.
              </p>
              <div class="flex gap-4">
                <button class="bg-freshco-accent hover:bg-yellow-500 text-gray-900 font-bold py-2.5 px-6 rounded-full transition-colors shadow-lg">
                  Shop Now
                </button>
                <button class="bg-transparent border-2 border-white text-white hover:bg-white hover:text-freshco-green font-bold py-2.5 px-6 rounded-full transition-colors">
                  Explore Offers
                </button>
              </div>
            </div>
          </div>

          <!-- Categories -->
          <div class="mb-10 relative">
            <div class="flex items-center gap-4 overflow-x-auto hide-scroll pb-4 px-1 snap-x">
              <button class="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hidden md:block">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-left text-gray-500"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              
              <div v-for="cat in categories" :key="cat.id" class="snap-start flex-shrink-0 flex flex-col items-center justify-center bg-white p-4 rounded-2xl w-24 h-28 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100">
                <div class="w-12 h-12 rounded-full bg-gray-50 mb-2 overflow-hidden border border-gray-100 flex items-center justify-center text-2xl">
                  {{ cat.icon }}
                </div>
                <span class="text-xs font-semibold text-gray-700">{{ cat.name }}</span>
              </div>

              <button class="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hidden md:block text-freshco-green">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>
          </div>

          <!-- Promotional Banners -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <!-- Banner 1 -->
            <div class="bg-freshco-green rounded-2xl p-6 relative overflow-hidden flex items-center min-h-[160px]">
              <div class="relative z-10 w-2/3">
                <h3 class="text-white font-bold text-lg mb-2">Free Delivery<br/>On Orders Over $50.</h3>
                <button class="bg-white text-gray-800 text-xs font-bold py-1.5 px-4 rounded-full mt-2">Shop Now</button>
              </div>
              <img src="https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=200&fit=crop" class="absolute -right-4 -bottom-4 w-32 h-32 object-cover rounded-full opacity-90" />
            </div>
            <!-- Banner 2 -->
            <div class="bg-red-500 rounded-2xl p-6 relative overflow-hidden flex items-center min-h-[160px]">
              <div class="relative z-10 w-2/3">
                <h3 class="text-white font-bold text-lg mb-2">Ready To Check Out?</h3>
                <p class="text-white/80 text-xs mb-3">Secure Your Order Now.</p>
                <button class="bg-white text-red-500 text-xs font-bold py-1.5 px-4 rounded-full">Shop Now</button>
              </div>
              <img src="https://images.unsplash.com/photo-1561136594-7f68413baa99?w=200&fit=crop" class="absolute -right-8 bottom-0 w-40 h-auto object-contain drop-shadow-xl" />
            </div>
            <!-- Banner 3 -->
            <div class="bg-freshco-accent rounded-2xl p-6 relative overflow-hidden flex items-center min-h-[160px]">
              <div class="relative z-10 w-2/3">
                <h3 class="text-gray-900 font-black text-xl mb-1">40% OFF</h3>
                <p class="text-gray-800 text-xs mb-3 font-medium">We Are Willing To Take You An Offer</p>
                <button class="text-gray-900 text-xs font-bold underline decoration-2 underline-offset-2">Grab The Offer</button>
              </div>
              <img src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200&fit=crop" class="absolute -right-6 -bottom-6 w-36 h-36 object-cover rounded-full" />
            </div>
          </div>

          <!-- Feature Products -->
          <div>
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-black text-gray-900">Feature Products</h2>
              <div class="hidden md:flex space-x-2">
                <button class="px-4 py-1.5 bg-freshco-green text-white text-sm font-semibold rounded-full">In Stock</button>
                <button class="px-4 py-1.5 text-gray-500 text-sm font-medium hover:text-freshco-green">New</button>
                <button class="px-4 py-1.5 text-gray-500 text-sm font-medium hover:text-freshco-green">Limited</button>
              </div>
              <a href="#" class="text-sm font-bold text-gray-500 flex items-center gap-1 hover:text-freshco-green">View All <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
            </div>

            <div v-if="loading" class="text-center py-12">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-freshco-green mx-auto"></div>
            </div>

            <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <ProductCard 
                v-for="product in products.slice(0, 8)" 
                :key="product._id || product.id"
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
              />
            </div>
          </div>
        </div>
        
        <!-- Right Sidebar (Today Best Deals & Deals of The Week) -->
        <div class="w-full lg:w-[320px] shrink-0 space-y-8">
          
          <!-- Today Best Deals -->
          <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-bold text-gray-900">Today Best Deals</h3>
              <div class="flex gap-1">
                 <button class="bg-gray-100 rounded-full p-1"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-500"><path d="m15 18-6-6 6-6"/></svg></button>
                 <button class="bg-freshco-green rounded-full p-1"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="m9 18 6-6-6-6"/></svg></button>
              </div>
            </div>
            
            <div class="space-y-4">
              <!-- Small Horizontal Product Card -->
              <div v-for="product in products.slice(0, 3)" :key="'deal-'+(product._id || product.id)" class="flex gap-3 items-center p-2 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                <div class="w-16 h-16 bg-gray-50 rounded-lg flex-shrink-0 flex items-center justify-center p-1">
                  <img :src="product.images && product.images.length > 0 ? product.images[0] : (product.imageUrl || 'https://via.placeholder.com/60')" class="max-w-full max-h-full object-contain" />
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="text-sm font-semibold text-gray-800 truncate">{{ product.name || product.title }}</h4>
                  <div class="flex items-center gap-1 mt-1 text-xs">
                    <span class="font-bold text-gray-900">Rp {{ (product.sale_price || product.base_price || product.price || 0).toLocaleString('id-ID') }}</span>
                    <span v-if="product.original_price" class="text-gray-400 line-through text-[10px]">Rp {{ product.original_price.toLocaleString('id-ID') }}</span>
                  </div>
                </div>
                <button @click="handleAddToCart(product)" class="bg-[#E8F3EF] hover:bg-freshco-green text-freshco-green hover:text-white px-2 py-1 rounded text-xs font-bold transition-colors">
                  + Cart
                </button>
              </div>
            </div>
          </div>

          <!-- Testimonial -->
          <div class="bg-[#F8F9FA] rounded-2xl p-6 text-center border border-gray-100">
            <div class="flex justify-center mb-2">
              <span class="text-yellow-400 text-sm">★★★★★</span>
              <span class="text-xs text-gray-500 ml-1 font-bold">4.9(30)</span>
            </div>
            <p class="text-sm text-gray-600 italic mb-4">
              "I've Been Shopping At This Grocery Store For Over A Year, And I Couldn't Be Happier. The Quality Of The Produce Is Consistently Fresh!"
            </p>
            <div class="flex items-center justify-center gap-2">
              <div class="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&fit=crop" class="w-full h-full object-cover" />
              </div>
              <div class="text-left">
                <p class="text-xs font-bold text-gray-900">Michael R.</p>
                <p class="text-[10px] text-gray-500">Happy Customer</p>
              </div>
            </div>
          </div>

          <!-- Deals of the week (Vertical Card) -->
          <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
             <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-bold text-gray-900">Deals Of The Week</h3>
              <a href="#" class="text-xs font-bold text-gray-500 hover:text-freshco-green">View All →</a>
            </div>
            <div v-if="products.length > 0">
               <ProductCard 
                  :title="products[0].name || products[0].title"
                  :price="products[0].sale_price || products[0].base_price || products[0].price"
                  :category="products[0].category?.name || products[0].category || 'Featured'"
                  :image-url="products[0].images && products[0].images.length > 0 ? products[0].images[0] : (products[0].imageUrl || 'https://via.placeholder.com/200')"
                  discount="Deal Of The Week"
                  unit="1 kg"
                  @add-to-cart="handleAddToCart(products[0])"
                />
            </div>
          </div>

        </div>
      </div>
    </div>
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
