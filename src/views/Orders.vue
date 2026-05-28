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

const showPaymentModal = ref(false)
const selectedOrder = ref<any>(null)

const cancelLoading = ref<string | null>(null)

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

const cancelOrder = async (orderId: string) => {
    if (!confirm('Apakah Anda yakin ingin membatalkan pesanan ini?')) return
    
    cancelLoading.value = orderId
    try {
        const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
        await axios.delete(`${baseURL}/orders/${orderId}`, {
            headers: { Authorization: `Bearer ${token.value}` }
        })
        alert('Pesanan berhasil dibatalkan.')
        fetchOrders() // refresh data
    } catch (error: any) {
        alert(error.response?.data?.message || 'Gagal membatalkan pesanan.')
    } finally {
        cancelLoading.value = null
    }
}

const openPaymentModal = (order: any) => {
    selectedOrder.value = order
    showPaymentModal.value = true
}

const formatPaymentMethod = (method: string) => {
    if (method === 'qris') return 'QRIS'
    if (method === 'bank_transfer') return 'Bank Transfer (VA)'
    if (method === 'cod') return 'Cash on Delivery (COD)'
    return method
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

            <div class="flex flex-col md:flex-row justify-between items-start md:items-center border-t border-gray-50 pt-4 gap-4">
                <div>
                    <p class="text-sm text-gray-500 mb-1">Metode Pembayaran: <span class="font-semibold text-gray-800">{{ formatPaymentMethod(order.payment_method) }}</span></p>
                    <div class="flex items-center gap-2">
                        <p class="text-sm text-gray-500">Total Tagihan:</p>
                        <p class="text-xl font-black text-freshco-green">{{ formatPrice(order.total_price) }}</p>
                    </div>
                </div>
                
                <!-- Action Buttons -->
                <div v-if="order.status === 'pending' || order.status === 'awaiting_payment'" class="flex gap-2 w-full md:w-auto">
                    <button 
                        @click="cancelOrder(order._id || order.id)" 
                        :disabled="cancelLoading === (order._id || order.id)"
                        class="flex-1 md:flex-none border border-red-200 text-red-500 hover:bg-red-50 py-2 px-4 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
                    >
                        {{ cancelLoading === (order._id || order.id) ? 'Batal...' : 'Batalkan' }}
                    </button>
                    <button 
                        v-if="order.payment_method !== 'cod'"
                        @click="openPaymentModal(order)"
                        class="flex-1 md:flex-none bg-freshco-green text-white py-2 px-4 rounded-lg text-sm font-bold hover:bg-[#0c513e] transition-colors"
                    >
                        Cara Bayar
                    </button>
                </div>
            </div>
        </div>
      </div>
      
      <!-- Payment Instruction Modal -->
      <div v-if="showPaymentModal && selectedOrder" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative">
              <button @click="showPaymentModal = false" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-50 rounded-full p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
              
              <h3 class="text-xl font-black text-gray-900 mb-6 text-center">Instruksi Pembayaran</h3>
              
              <div v-if="selectedOrder.payment_method === 'qris'" class="text-center">
                   <p class="text-sm text-gray-500 mb-4">Total: <span class="font-bold text-freshco-green text-lg">{{ formatPrice(selectedOrder.total_price) }}</span></p>
                   
                   <div class="bg-gray-50 p-4 rounded-xl shadow-inner inline-block mb-3 border border-gray-100">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="QRIS" class="w-48 h-48 object-contain mx-auto opacity-80" />
                   </div>
                   <p class="text-xs text-gray-500 mt-3 font-medium">Buka aplikasi e-wallet Anda (GoPay, OVO, dll) dan scan QR Code di atas.</p>
              </div>

              <div v-else-if="selectedOrder.payment_method === 'bank_transfer'" class="text-left">
                   <div class="bg-gray-50 p-5 rounded-xl border border-gray-100 mb-4 shadow-inner">
                      <div class="flex justify-between items-start mb-2">
                          <p class="text-xs text-gray-500 font-bold tracking-wider uppercase">Bank BCA</p>
                          <img src="https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg" class="h-4 object-contain" />
                      </div>
                      <p class="text-2xl font-black text-gray-900 tracking-wider mb-1">736 158 9631</p>
                      <p class="text-sm font-semibold text-gray-700">a/n Alhamid Adriansyah</p>
                   </div>
                   
                   <div class="flex justify-between items-center bg-green-50 p-4 rounded-xl border border-freshco-green">
                      <span class="text-sm font-medium text-green-800">Total Transfer</span>
                      <span class="font-black text-freshco-green text-lg">{{ formatPrice(selectedOrder.total_price) }}</span>
                   </div>
                   <p class="text-xs text-gray-500 mt-4 text-center leading-relaxed">Harap transfer tepat sesuai nominal di atas. Pesanan akan diproses setelah pembayaran diverifikasi oleh admin.</p>
              </div>
              
              <button @click="showPaymentModal = false" class="w-full bg-freshco-green text-white py-3.5 px-6 rounded-xl font-bold hover:bg-[#0c513e] transition-colors mt-6 shadow-md">
                   Tutup
              </button>
          </div>
      </div>
    </div>
  </div>
</template>
