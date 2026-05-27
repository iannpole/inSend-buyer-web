<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { ChevronLeft, ShoppingCart, Star, Minus, Plus, Tag } from 'lucide-vue-next'
import { useCart } from '../store/cart'

const route = useRoute()
const router = useRouter()
const { addToCart } = useCart()

const product = ref<any>(null)
const loading = ref(true)
const error = ref('')
const quantity = ref(1)

const fetchProduct = async () => {
    loading.value = true
    error.value = ''
    try {
        const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
        const response = await axios.get(`${baseURL}/products/${route.params.id}`)
        if (response.data && response.data.data) {
            product.value = response.data.data
        } else if (response.data) {
            product.value = response.data
        }
    } catch (err: any) {
        console.error('Error fetching product:', err)
        error.value = err.response?.status === 404 
            ? 'Produk tidak ditemukan.' 
            : 'Gagal memuat detail produk. Pastikan backend API berjalan.'
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchProduct()
})

const getImageUrl = (img: string) => {
    if (!img) return 'https://via.placeholder.com/400?text=No+Image'
    if (img.startsWith('http')) return img
    // For local Laravel storage images
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
    const storageBase = apiBase.replace('/api', '')
    return `${storageBase}/storage/${img}`
}

const handleAddToCart = () => {
    if (!product.value) return
    const imgArr = product.value.images || []
    const cartItem = {
        id: product.value.id || product.value._id,
        title: product.value.name,
        price: product.value.effective_price || product.value.sale_price || product.value.base_price,
        imageUrl: imgArr.length > 0 ? getImageUrl(imgArr[0]) : 'https://via.placeholder.com/200'
    }
    addToCart(cartItem, quantity.value)
}

const formatPrice = (value: number) => {
    if (!value && value !== 0) return 'Rp 0'
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value)
}
</script>

<template>
    <!-- Loading -->
    <div v-if="loading" class="min-h-screen bg-gray-50 flex items-center justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-freshco-green"></div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
        <p class="text-red-500 text-lg font-bold mb-4">{{ error }}</p>
        <button @click="router.back()" class="bg-freshco-green text-white px-6 py-3 rounded-xl font-bold hover:bg-[#0c513e] transition-colors">
            ← Kembali
        </button>
    </div>

    <!-- Product Detail -->
    <div v-else-if="product" class="min-h-screen bg-gray-50 font-sans pb-28">
        <!-- Header Image & Nav -->
        <div class="bg-white rounded-b-[40px] shadow-sm pb-8 relative">
            <div class="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
                <button @click="router.back()" class="w-12 h-12 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center text-gray-900 shadow-sm hover:bg-white transition-colors border border-gray-100">
                    <ChevronLeft class="w-6 h-6" />
                </button>
            </div>
            
            <div class="pt-20 px-8 flex justify-center">
                <img 
                    :src="product.images && product.images.length > 0 ? getImageUrl(product.images[0]) : 'https://via.placeholder.com/400?text=No+Image'" 
                    class="w-64 h-64 object-contain drop-shadow-xl" 
                    :alt="product.name"
                />
            </div>
        </div>

        <!-- Product Info -->
        <div class="max-w-2xl mx-auto px-6 mt-8">
            <!-- Discount badge -->
            <div v-if="product.is_discounted" class="inline-flex items-center gap-1 bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold mb-3">
                <Tag class="w-3 h-3" />
                <span>{{ product.discount_info || `Diskon ${product.discount_percentage}%` }}</span>
            </div>

            <div class="flex justify-between items-start mb-2">
                <h1 class="text-3xl font-black text-gray-900 leading-tight flex-1 pr-4">{{ product.name }}</h1>
                <div class="text-right flex-shrink-0">
                    <p class="text-2xl font-black text-freshco-green">{{ product.formatted_price || formatPrice(product.effective_price || product.sale_price || product.base_price) }}</p>
                    <p class="text-sm text-gray-400 line-through" v-if="product.is_discounted && product.base_price">{{ formatPrice(product.base_price) }}</p>
                </div>
            </div>
            
            <div class="flex items-center gap-3 flex-wrap mb-6">
                <div class="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-lg text-xs font-bold">
                    <Star class="w-3 h-3 fill-current" />
                    <span>{{ product.average_rating || '0' }}</span>
                    <span class="text-yellow-500 ml-0.5">({{ product.review_count || 0 }})</span>
                </div>
                <span v-if="product.unit" class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">{{ product.unit }}</span>
                <span v-if="product.category_slug" class="text-sm text-freshco-green bg-[#E8F3EF] px-3 py-1 rounded-full font-medium">{{ product.category_slug }}</span>
                <span v-if="product.stock_quantity > 0" class="text-sm text-green-600 font-medium">Stok: {{ product.stock_quantity }}</span>
                <span v-else class="text-sm text-red-500 font-medium bg-red-50 px-3 py-1 rounded-full">Habis</span>
            </div>

            <!-- Description -->
            <div class="mb-8">
                <h3 class="text-lg font-bold text-gray-900 mb-2">Deskripsi Produk</h3>
                <p class="text-gray-600 leading-relaxed text-sm">
                    {{ product.description || 'Tidak ada deskripsi tersedia untuk produk ini.' }}
                </p>
            </div>

            <!-- Tags -->
            <div v-if="product.tags && product.tags.length > 0" class="mb-6">
                <h3 class="text-lg font-bold text-gray-900 mb-2">Tags</h3>
                <div class="flex flex-wrap gap-2">
                    <span v-for="tag in product.tags" :key="tag" class="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">#{{ tag }}</span>
                </div>
            </div>
        </div>

        <!-- Bottom Action Bar -->
        <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-8 md:pb-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-40">
            <div class="max-w-2xl mx-auto flex gap-4 items-center">
                
                <div class="flex items-center gap-4 bg-gray-50 rounded-2xl p-2 border border-gray-200 flex-shrink-0">
                    <button @click="quantity > 1 ? quantity-- : null" class="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-freshco-green transition-colors">
                        <Minus class="w-5 h-5" />
                    </button>
                    <span class="font-bold text-lg w-6 text-center text-gray-900">{{ quantity }}</span>
                    <button @click="quantity++" class="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-freshco-green transition-colors">
                        <Plus class="w-5 h-5" />
                    </button>
                </div>
                
                <button @click="handleAddToCart" :disabled="product.stock_quantity <= 0" class="flex-1 bg-freshco-green disabled:bg-gray-400 text-white py-4 rounded-2xl font-black text-lg hover:bg-[#0c513e] transition-colors shadow-lg shadow-freshco-green/30 flex items-center justify-center gap-2">
                    <ShoppingCart class="w-5 h-5" />
                    <span>Tambahkan ke Keranjang</span>
                </button>

            </div>
        </div>
    </div>
</template>
