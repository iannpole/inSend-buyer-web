<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import Navbar from '../components/layout/Navbar.vue'
import Footer from '../components/layout/Footer.vue'
import ProductCard from '../components/ui/ProductCard.vue'
import { useCart } from '../store/cart'
import { useRouter } from 'vue-router'

const { addToCart } = useCart()
const router = useRouter()

// Static Categories based on design
const categories = [
  { id: 1, name: 'Vegetables', icon: '🥬' },
  { id: 2, name: 'Dairy', icon: '🥛' },
  { id: 3, name: 'Breads', icon: '🍞' },
  { id: 4, name: 'Seafood', icon: '🐟' },
  { id: 5, name: 'Biscuits', icon: '🍪' },
  { id: 6, name: 'Meat', icon: '🥩' },
  { id: 7, name: 'Fruits', icon: '🍎' },
]

const products = ref<any[]>([])
const recipes = ref<any[]>([])
const loading = ref(true)

const blogPosts = [
    { id: 1, title: 'Manfaat Sayur Bayam Untuk Kesehatan Mata', category: 'Kesehatan', image: 'https://images.unsplash.com/photo-1576044670005-502a2818c214?w=600&fit=crop', excerpt: 'Bayam mengandung banyak vitamin A yang sangat baik untuk menjaga kesehatan...', date: '12 Mei 2026' },
    { id: 2, title: '5 Resep Olahan Daging Sapi Super Praktis', category: 'Resep', image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5e?w=600&fit=crop', excerpt: 'Punya stok daging sapi di rumah? Yuk coba 5 resep olahan daging...', date: '10 Mei 2026' },
    { id: 3, title: 'Tips Menyimpan Sayuran Agar Tetap Segar 1 Minggu', category: 'Tips & Trik', image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=600&fit=crop', excerpt: 'Sering membuang sayuran layu? Simak cara menyimpan sayuran di kulkas...', date: '8 Mei 2026' },
    { id: 4, title: 'Mengenal Berbagai Jenis Tomat', category: 'Edukasi', image: 'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=600&fit=crop', excerpt: 'Tomat tidak hanya satu jenis, kenali varietas tomat yang pas untuk...', date: '5 Mei 2026' },
]

const discountedProducts = computed(() => {
    return products.value.filter(p => p.discount_amount > 0 || (p.original_price && p.original_price > p.sale_price))
})

const fetchProducts = async () => {
  try {
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
    const response = await axios.get(`${baseURL}/products?per_page=12`)
    if (response.data && response.data.data) {
      products.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching products:', error)
  }
}

const fetchRecipes = async () => {
  try {
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
    const response = await axios.get(`${baseURL}/recipes`).catch(() => null)
    if (response?.data?.data) {
        recipes.value = response.data.data
    } else {
        recipes.value = [
            { id: 1, title: 'Smoothie Bowl', type: 'Bowl', calories: '220kcal', time: '5min', level: 'Easy', image: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400&fit=crop' },
            { id: 2, title: 'Mushroom Quiche', type: 'Main dish', calories: '220kcal', time: '40min', level: 'Medium', image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&fit=crop' },
            { id: 3, title: 'Strawberry Spinach Salad', type: 'Salad', calories: '354kcal', time: '15min', level: 'Easy', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&fit=crop' },
            { id: 4, title: 'Cottage Cheese Toast', type: 'Sandwich', calories: '456kcal', time: '10min', level: 'Easy', image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&fit=crop' },
            { id: 5, title: 'Seared Scallops', type: 'Main dish', calories: '420kcal', time: '20min', level: 'Hard', image: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=400&fit=crop' }
        ]
    }
  } catch (error) {
    console.error('Error fetching recipes:', error)
  }
}

onMounted(async () => {
  loading.value = true
  await Promise.all([fetchProducts(), fetchRecipes()])
  loading.value = false
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

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <!-- Hero Banner -->
      <div class="relative bg-freshco-green rounded-3xl overflow-hidden mb-10 h-[320px] md:h-[400px]">
        <div class="absolute right-0 bottom-0 h-full w-1/2 md:w-[60%] overflow-hidden">
          <img src="../assets/home-grochery.jpeg" class="object-cover h-full w-full object-center" alt="Fresh Groceries" />
          <div class="absolute inset-0 bg-gradient-to-r from-freshco-green via-freshco-green/80 to-transparent"></div>
        </div>
        
        <div class="relative z-10 px-8 md:px-12 py-12 h-full flex flex-col justify-center max-w-lg">
          <p class="text-white/80 text-sm md:text-base font-semibold mb-3 uppercase tracking-wider">Gratis Ongkir & Free voucher belanja</p>
          <h1 class="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
            Kepercayaan datang dari <span class="text-freshco-accent">Fresh & Healthy</span> Foods
          </h1>
          <p class="text-white/90 text-sm mb-8">
            inSend menghadirkan bahan makanan yang fresh setiap hari ke rumah kamu.
          </p>
          <div class="flex gap-4">
            <button @click="router.push('/shop')" class="bg-freshco-accent hover:bg-yellow-500 text-gray-900 font-bold py-2.5 px-6 rounded-full transition-colors shadow-lg">
              Belanja Sekarang
            </button>
          </div>
        </div>
      </div>

      <!-- Categories -->
      <div class="mb-12">
        <div class="flex items-center gap-4 overflow-x-auto hide-scroll pb-4 px-1 snap-x">
          <div v-for="cat in categories" :key="cat.id" @click="router.push({ path: '/shop', query: { category: cat.name } })" class="snap-start flex-shrink-0 flex flex-col items-center justify-center bg-white p-4 rounded-2xl w-24 h-28 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100">
            <div class="w-12 h-12 rounded-full bg-gray-50 mb-2 overflow-hidden border border-gray-100 flex items-center justify-center text-2xl">
              {{ cat.icon }}
            </div>
            <span class="text-xs font-semibold text-gray-700">{{ cat.name }}</span>
          </div>
        </div>
      </div>

      <!-- Promotional Banners -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div class="bg-freshco-green rounded-2xl p-6 relative overflow-hidden flex items-center min-h-[160px]">
          <div class="relative z-10 w-2/3">
            <h3 class="text-white font-bold text-lg mb-2">Gratis Ongkir<br/>Belanja di atas 100k</h3>
            <button @click="router.push('/shop')" class="bg-white text-gray-800 text-xs font-bold py-1.5 px-4 rounded-full mt-2">Shop Now</button>
          </div>
          <img src="https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=200&fit=crop" class="absolute -right-4 -bottom-4 w-32 h-32 object-cover rounded-full opacity-90" />
        </div>
        <div class="bg-red-500 rounded-2xl p-6 relative overflow-hidden flex items-center min-h-[160px]">
          <div class="relative z-10 w-2/3">
            <h3 class="text-white font-bold text-lg mb-2">Siap untuk checkout?</h3>
            <p class="text-white/80 text-xs mb-3">Amankan pesananmu sekarang.</p>
            <button @click="router.push('/cart')" class="bg-white text-red-500 text-xs font-bold py-1.5 px-4 rounded-full">Checkout</button>
          </div>
          <img src="https://images.unsplash.com/photo-1561136594-7f68413baa99?w=200&fit=crop" class="absolute -right-8 bottom-0 w-40 h-auto object-contain drop-shadow-xl" />
        </div>
        <div class="bg-freshco-accent rounded-2xl p-6 relative overflow-hidden flex items-center min-h-[160px]">
          <div class="relative z-10 w-2/3">
            <h3 class="text-gray-900 font-black text-xl mb-1">40% OFF</h3>
            <p class="text-gray-800 text-xs mb-3 font-medium">Puasin belanja buat makan enak hari ini</p>
            <button @click="router.push('/shop')" class="text-gray-900 text-xs font-bold underline decoration-2 underline-offset-2">Belanja Sekarang</button>
          </div>
          <img src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200&fit=crop" class="absolute -right-6 -bottom-6 w-36 h-36 object-cover rounded-full" />
        </div>
      </div>

      <!-- Feature Products -->
      <div class="mb-16">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-black text-gray-900">Feature Products</h2>
          <RouterLink to="/shop" class="text-sm font-bold text-gray-500 flex items-center gap-1 hover:text-freshco-green">
              View All <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </RouterLink>
        </div>

        <div v-if="loading" class="text-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-freshco-green mx-auto"></div>
        </div>

        <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <ProductCard 
            v-for="product in products.slice(0, 6)" 
            :key="product._id || product.id"
            :title="product.name || product.title"
            :price="product.sale_price || product.base_price || product.price"
            :original-price="product.sale_price ? product.base_price : product.original_price"
            :category="product.category?.name || product.category || 'Grocery'"
            :image-url="product.images && product.images.length > 0 ? product.images[0] : (product.imageUrl || 'https://via.placeholder.com/200')"
            :unit="product.unit"
            :rating="product.rating"
            :discount="product.discount"
            @add-to-cart="handleAddToCart(product)"
            @click="router.push(`/shop/${product._id || product.id}`)"
            class="cursor-pointer"
          />
        </div>
      </div>

      <!-- Deal of the week (Discounted Items) -->
      <div class="mb-16">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-black text-gray-900">Deal Of The Week</h2>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
           <!-- Map through discounted products if any, else show a slice of regular products -->
           <ProductCard 
            v-for="product in (discountedProducts.length > 0 ? discountedProducts : products).slice(0, 6)" 
            :key="'deal-'+(product._id || product.id)"
            :title="product.name || product.title"
            :price="product.sale_price || product.base_price || product.price"
            :original-price="product.sale_price ? product.base_price : product.original_price"
            :category="product.category?.name || product.category || 'Promo'"
            :image-url="product.images && product.images.length > 0 ? product.images[0] : (product.imageUrl || 'https://via.placeholder.com/200')"
            :unit="product.unit"
            discount="Hot Deal"
            @add-to-cart="handleAddToCart(product)"
            @click="router.push(`/shop/${product._id || product.id}`)"
            class="cursor-pointer border-2 border-red-100"
          />
        </div>
      </div>

      <!-- Recipes Scrollable Section with Tilt effect -->
      <div class="mb-16">
          <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-black text-gray-900">Popular Recipes</h2>
              <RouterLink to="/recipes" class="text-sm font-bold text-gray-500 hover:text-freshco-green">View All</RouterLink>
          </div>
          <div class="flex gap-6 overflow-x-auto hide-scroll pb-10 pt-4 px-2">
              <div v-for="(recipe, index) in recipes" :key="recipe.id || index" 
                   @click="router.push(`/recipes/${recipe.id || 1}`)"
                   class="recipe-card flex-shrink-0 w-[280px] bg-white rounded-3xl p-4 shadow-sm border border-gray-100 cursor-pointer transition-all duration-300">
                  <div class="h-40 rounded-2xl overflow-hidden mb-4 relative">
                      <img :src="recipe.image || 'https://via.placeholder.com/300'" class="w-full h-full object-cover" />
                  </div>
                  <h3 class="font-bold text-gray-900 text-lg line-clamp-1 mb-2">{{ recipe.title }}</h3>
                  <div class="flex items-center gap-2 mb-3">
                      <span class="text-xs px-2 py-1 bg-gray-100 rounded-md font-medium">{{ recipe.type || 'Main dish' }}</span>
                      <span class="text-xs px-2 py-1 bg-orange-50 text-orange-600 rounded-md font-medium">{{ recipe.calories || '300kcal' }}</span>
                      <span class="text-xs px-2 py-1 bg-green-50 text-green-600 rounded-md font-medium">{{ recipe.level || 'Easy' }}</span>
                  </div>
              </div>
          </div>
      </div>

      <!-- Blog Scrollable Section -->
      <div class="mb-16">
          <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-black text-gray-900">Articles & Tips</h2>
              <RouterLink to="/blog" class="text-sm font-bold text-gray-500 hover:text-freshco-green">View All</RouterLink>
          </div>
          <div class="flex gap-6 overflow-x-auto hide-scroll pb-6">
              <div v-for="post in blogPosts" :key="post.id" 
                   @click="router.push('/blog')"
                   class="flex-shrink-0 w-[300px] group cursor-pointer">
                  <div class="h-48 bg-gray-200 rounded-2xl overflow-hidden mb-4 relative">
                      <img :src="post.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span class="absolute top-3 left-3 bg-white/90 backdrop-blur text-gray-900 px-3 py-1 rounded-full text-[10px] font-bold">{{ post.category }}</span>
                  </div>
                  <h3 class="font-bold text-gray-900 line-clamp-2 group-hover:text-freshco-green transition-colors leading-tight">{{ post.title }}</h3>
              </div>
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

/* Tilt animation for recipe cards */
.recipe-card:hover {
    transform: translateY(-10px) rotate(2deg);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
/* Staggering for visual interest like ref 2 */
.recipe-card:nth-child(even) {
    transform: translateY(10px);
}
.recipe-card:nth-child(even):hover {
    transform: translateY(0px) rotate(-2deg);
}
</style>
