<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Navbar from '../components/layout/Navbar.vue'
import { useAuth } from '../store/auth'
import { useRouter } from 'vue-router'

const { token, isAuthenticated } = useAuth()
const router = useRouter()

const orders = ref<any[]>([])
const loading = ref(true)

const fetchOrders = async () => {
  if (!isAuthenticated.value) {
      router.push('/login')
      return
  }
  
  loading.value = true
  try {
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
    const response = await axios.get(`${baseURL}/orders`, {
        headers: { Authorization: `Bearer ${token.value}` }
    })
    
    if (response.data && response.data.data) {
      orders.value = response.data.data
    } else {
      orders.value = response.data
    }
  } catch (error) {
    console.error('Error fetching orders:', error)
  } finally {
    loading.value = false
  }
}

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    })
}

const statusColor = (status: string) => {
    const colors: Record<string, string> = {
        'pending': 'bg-yellow-100 text-yellow-800',
        'paid': 'bg-blue-100 text-blue-800',
        'processing': 'bg-indigo-100 text-indigo-800',
        'shipped': 'bg-purple-100 text-purple-800',
        'delivered': 'bg-green-100 text-green-800',
        'cancelled': 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
}

onMounted(() => {
  fetchOrders()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 pb-20 font-sans text-gray-800">
    <Navbar />

    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      
      <div class="flex items-center justify-between mb-8">
        <div>
            <h1 class="text-3xl font-black text-gray-900 mb-2">My Orders</h1>
            <p class="text-gray-500">Riwayat pemesanan Anda.</p>
        </div>
      </div>

      <div v-if="loading" class="text-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-freshco-green mx-auto"></div>
      </div>
      
      <div v-else-if="orders.length === 0" class="text-center py-20 bg-white rounded-2xl border border-gray-100">
         <p class="text-gray-500 mb-4">Anda belum memiliki riwayat pemesanan.</p>
         <RouterLink to="/shop" class="text-freshco-green font-bold hover:underline">Belanja Sekarang</RouterLink>
      </div>

      <div v-else class="space-y-4">
        <div v-for="order in orders" :key="order._id || order.id" class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div class="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-50 pb-4 mb-4 gap-4">
                <div>
                    <span class="text-sm text-gray-500">Order ID: <span class="font-bold text-gray-900">{{ order.order_number }}</span></span>
                    <p class="text-xs text-gray-400 mt-1">{{ formatDate(order.created_at) }}</p>
                </div>
                <div class="flex gap-2">
                    <span :class="['px-3 py-1 rounded-full text-xs font-bold uppercase', statusColor(order.status)]">
                        {{ order.status }}
                    </span>
                </div>
            </div>
            
            <div class="space-y-3 mb-4">
                <div v-for="item in order.items" :key="item.product_id" class="flex justify-between items-center text-sm">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-gray-50 rounded flex items-center justify-center p-1">
                            <span class="text-xs">🛒</span>
                        </div>
                        <div>
                            <p class="font-bold text-gray-800">{{ item.name }}</p>
                            <p class="text-xs text-gray-500">{{ item.qty }}x @ {{ formatPrice(item.price) }}</p>
                        </div>
                    </div>
                    <span class="font-semibold text-gray-900">{{ formatPrice(item.subtotal) }}</span>
                </div>
            </div>

            <div class="flex justify-between items-center border-t border-gray-50 pt-4">
                <p class="text-sm text-gray-500">Total Harga</p>
                <p class="text-xl font-black text-freshco-green">{{ formatPrice(order.total_price) }}</p>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>
