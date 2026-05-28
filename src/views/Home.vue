<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import Navbar from '../components/layout/Navbar.vue'
import Footer from '../components/layout/Footer.vue'
import ProductCard from '../components/ui/ProductCard.vue'
import PartnerScroll from '../components/ui/PartnerScroll.vue'
import { useCart } from '../store/cart'
import { useRouter } from 'vue-router'

const { addToCart } = useCart()
const router = useRouter()

// Static Categories based on design
const categories = [
  { id: 1, name: 'Sayuran', icon: '🥬' },
  { id: 2, name: 'Buah', icon: '🍎' },
  { id: 3, name: 'Daging', icon: '🥩' },
  { id: 4, name: 'Seafood', icon: '🐟' },
  { id: 5, name: 'Bumbu', icon: '🌶️' },
  { id: 6, name: 'Susu & Telur', icon: '🥛' },
  { id: 7, name: 'Camilan', icon: '🍪' },
]

const products = ref<any[]>([])
const recipes = ref<any[]>([])
const blogPosts = ref<any[]>([])
const loading = ref(true)

const productPage = ref(1)
const recipePage = ref(1)

const discountedProducts = computed(() => {
    return products.value.filter(p => p.is_discounted || (p.base_price && p.base_price > p.sale_price))
})

const fetchProducts = async (page = 1) => {
  try {
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
    const response = await axios.get(`${baseURL}/products?per_page=8&page=${page}`)
    if (response.data && response.data.data) {
      products.value = response.data.data.data || response.data.data
      productPage.value = page
    }
  } catch (error) {
    console.error('Error fetching products:', error)
  }
}

const fetchRecipes = async (page = 1) => {
  try {
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
    const response = await axios.get(`${baseURL}/recipes?per_page=6&page=${page}`).catch(() => null)
    if (response?.data?.data) {
        recipes.value = response.data.data.data || response.data.data
        recipePage.value = page
    }
  } catch (error) {
    console.error('Error fetching recipes:', error)
  }
}

const fetchBlogs = async () => {
  try {
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
    const response = await axios.get(`${baseURL}/blog?per_page=4`).catch(() => null)
    if (response?.data?.data) {
        blogPosts.value = response.data.data.data || response.data.data
    }
  } catch (error) {
    console.error('Error fetching blogs:', error)
  }
}

onMounted(async () => {
  loading.value = true
  await Promise.all([fetchProducts(1), fetchRecipes(1), fetchBlogs()])
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

const handleRecipeImageError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  if (target) target.src = 'https://via.placeholder.com/300?text=No+Image';
}

const handleBlogImageError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  if (target) target.src = 'https://via.placeholder.com/300?text=Blog';
}

const getImageUrl = (img: string) => {
    if (!img) return 'https://via.placeholder.com/300?text=No+Image'
    if (img.startsWith('http')) return img
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
    const storageBase = apiBase.replace('/api', '')
    return `${storageBase}/storage/${img}`
}

const getRecipeImage = (recipe: any) => {
    const imgs = recipe.images || []
    if (imgs.length > 0) return getImageUrl(imgs[0])
    return recipe.image ? getImageUrl(recipe.image) : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&fit=crop'
}

const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 font-sans text-gray-800">
    <Navbar />

    <div class="w-full mx-auto px-4 sm:px-8 lg:px-16 mt-6">
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
      <div class="mb-14 mt-4">
        <div class="flex flex-wrap items-center justify-center gap-4 lg:gap-8 pb-4">
          <div v-for="cat in categories" :key="cat.id" @click="router.push({ path: '/shop', query: { category: cat.name } })" class="group flex flex-col items-center justify-center bg-white p-5 rounded-3xl w-28 h-32 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer border border-gray-100">
            <div class="w-14 h-14 rounded-full bg-[#E8F3EF] group-hover:bg-freshco-green text-freshco-green group-hover:text-white mb-3 flex items-center justify-center text-3xl transition-colors shadow-inner">
              {{ cat.icon }}
            </div>
            <span class="text-sm font-bold text-gray-700 group-hover:text-freshco-green transition-colors">{{ cat.name }}</span>
          </div>
        </div>
      </div>

      <!-- Promotional Banners -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div class="bg-[#10664F] rounded-2xl p-6 relative overflow-hidden flex items-center min-h-[160px]">
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
        <div class="bg-[#FFC107] rounded-2xl p-6 relative overflow-hidden flex items-center min-h-[160px]">
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

        <div v-else>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 relative min-h-[400px]">
            <ProductCard 
              v-for="(product, index) in products.slice(0, 8)" 
              :key="product._id || product.id"
              :style="{ animationDelay: `${index * 100}ms` }"
              :id="product._id || product.id"
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
              class="cursor-pointer product-item"
            />
          </div>
          <!-- Product Pagination Controls -->
          <div class="flex justify-center items-center gap-4 mt-8">
            <button @click="fetchProducts(productPage - 1)" :disabled="productPage <= 1" class="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors">
              &larr; Prev
            </button>
            <span class="text-sm font-bold text-gray-700">Page {{ productPage }}</span>
            <button @click="fetchProducts(productPage + 1)" class="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              Next &rarr;
            </button>
          </div>
        </div>
      </div>

      <!-- Deal of the week (Discounted Items) -->
      <div class="mb-16">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-black text-gray-900">Deal Of The Week</h2>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
           <!-- Map through discounted products if any, else show a slice of regular products -->
           <ProductCard 
            v-for="product in (discountedProducts.length > 0 ? discountedProducts : products).slice(0, 4)" 
            :key="'deal-'+(product._id || product.id)"
            :id="product._id || product.id"
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

      <!-- Partner Scroll Velocity Effect -->
      <PartnerScroll />

      <!-- Recipes Scrollable Section with Tilt effect -->
      <div class="mb-16">
          <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-black text-gray-900">Popular Recipes</h2>
              <div class="flex items-center gap-4">
                  <div class="flex gap-2">
                      <button @click="fetchRecipes(recipePage - 1)" :disabled="recipePage <= 1" class="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors">&larr;</button>
                      <button @click="fetchRecipes(recipePage + 1)" class="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">&rarr;</button>
                  </div>
                  <RouterLink to="/recipes" class="text-sm font-bold text-gray-500 hover:text-freshco-green">View All</RouterLink>
              </div>
          </div>
          <div class="flex gap-6 overflow-x-auto hide-scroll pb-10 pt-4 px-2 relative min-h-[300px]">
              <div v-for="(recipe, index) in recipes" :key="recipe._id || recipe.id || index" 
                   :style="{ animationDelay: `${index * 100}ms` }"
                   @click="router.push(`/recipes/${recipe.slug || recipe._id || recipe.id || 1}`)"
                   class="recipe-card recipe-item flex-shrink-0 w-[280px] bg-white rounded-3xl p-4 shadow-sm border border-gray-100 cursor-pointer transition-all duration-300">
                  <div class="h-40 rounded-2xl overflow-hidden mb-4 relative bg-gray-100">
                      <img :src="getRecipeImage(recipe)" @error="handleRecipeImageError" class="w-full h-full object-cover" />
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
              <div v-for="post in blogPosts" :key="post._id || post.id" 
                   @click="router.push('/blog')"
                   class="flex-shrink-0 w-[300px] group cursor-pointer">
                  <div class="h-48 bg-gray-200 rounded-2xl overflow-hidden mb-4 relative">
                      <img :src="getImageUrl(post.image)" @error="handleBlogImageError" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span class="absolute top-3 left-3 bg-white/90 backdrop-blur text-gray-900 px-3 py-1 rounded-full text-[10px] font-bold">{{ post.category }}</span>
                  </div>
                  <p class="text-xs text-gray-400 mb-1 font-medium">📅 {{ formatDate(post.published_at || post.created_at || post.date) }}</p>
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

/* Keyframe Animations for Products (mimicking AnimatedContent) */
.product-item {
  animation: fadeUp 0.8s cubic-bezier(0.25, 1, 0.5, 1) both;
}

@keyframes fadeUp {
  0% {
    opacity: 0;
    transform: translateY(100px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Keyframe Animations for Recipes */
.recipe-item {
  animation: fadeLeft 0.8s cubic-bezier(0.25, 1, 0.5, 1) both;
}

@keyframes fadeLeft {
  0% {
    opacity: 0;
    transform: translateX(100px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
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
