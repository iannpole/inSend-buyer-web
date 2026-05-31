<script setup lang="ts">
import { X, Minus, Plus, ShoppingBag, Trash2, MapPin, CreditCard, CheckCircle2, Truck } from 'lucide-vue-next'
import { useCart } from '../../store/cart'
import { useAuth } from '../../store/auth'
import { ref, watch, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const { isCartOpen, cartItems, toggleCart, updateQuantity, removeFromCart, cartTotal } = useCart()
const { isAuthenticated, user, token } = useAuth()
const router = useRouter()

const step = ref<'cart' | 'checkout' | 'success'>('cart')

// Shipping fields (matching backend OrderRequest validation)
const recipientName = ref('')
const phone = ref('')
const street = ref('')
const city = ref('')
const province = ref('')
const postalCode = ref('')

const paymentMethod = ref('qris') // default to qris
const deliveryOption = ref('standard')
const notes = ref('')
const loading = ref(false)
const orderError = ref('')

// Final checkout state for success screen
const finalTotal = ref(0)
const finalPaymentMethod = ref('cod')

// Promo Code
const promoCodeInput = ref('')
const appliedPromoCode = ref('')
const discountAmount = ref(0)
const promoError = ref('')
const promoSuccess = ref('')
const promoLoading = ref(false)

const applyPromo = async () => {
    promoError.value = ''
    promoSuccess.value = ''
    if (!promoCodeInput.value) return

    promoLoading.value = true
    try {
        const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
        const response = await axios.post(`${baseURL}/promos/validate`, {
            code: promoCodeInput.value,
            order_amount: cartTotal.value,
            delivery_fee: deliveryFee.value
        }, {
            headers: { Authorization: `Bearer ${token.value}` }
        })
        
        appliedPromoCode.value = response.data.data.code
        discountAmount.value = response.data.data.discount_amount
        promoSuccess.value = response.data.message
    } catch (error: any) {
        promoError.value = error.response?.data?.message || 'Kode promo tidak valid atau sudah kadaluarsa.'
        appliedPromoCode.value = ''
        discountAmount.value = 0
    } finally {
        promoLoading.value = false
    }
}

const removePromo = () => {
    promoCodeInput.value = ''
    appliedPromoCode.value = ''
    discountAmount.value = 0
    promoSuccess.value = ''
    promoError.value = ''
}

// Confirm Delete State
const itemToDelete = ref<number | null>(null)
const confirmDelete = (id: number) => {
    itemToDelete.value = id
}
const executeDelete = () => {
    if (itemToDelete.value) {
        removeFromCart(itemToDelete.value)
        itemToDelete.value = null
    }
}
const cancelDelete = () => {
    itemToDelete.value = null
}

// Delivery fee based on option and cart total
const isEligibleForFreeExpress = computed(() => cartTotal.value >= 100000)

const deliveryFee = computed(() => {
  if (deliveryOption.value === 'express') {
      return isEligibleForFreeExpress.value ? 0 : 15000
  }
  if (deliveryOption.value === 'same_day') return 25000
  return 0 // standard = free
})

const grandTotal = computed(() => Math.max(0, cartTotal.value + deliveryFee.value - discountAmount.value))

// Check if checkout form is valid
const isCheckoutValid = computed(() => {
  return recipientName.value.trim() !== '' &&
         phone.value.trim() !== '' &&
         street.value.trim() !== '' &&
         city.value.trim() !== '' &&
         province.value.trim() !== '' &&
         postalCode.value.trim() !== ''
})

// Pre-fill when authenticated
watch(isCartOpen, (open) => {
    if (open && user.value) {
        recipientName.value = user.value.name || ''
        phone.value = user.value.phone || ''
        if (user.value.address) {
            street.value = user.value.address
        }
    }
    // Reset to cart step when opening
    if (open) {
        step.value = 'cart'
        orderError.value = ''
    }
})

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

const proceedToCheckout = () => {
  if (!isAuthenticated.value) {
      toggleCart()
      router.push('/login')
      return
  }
  orderError.value = ''
  step.value = 'checkout'
}

const placeOrder = async () => {
  loading.value = true
  orderError.value = ''
  try {
      const items = cartItems.value.map(item => ({
          product_id: item.id,
          qty: item.quantity
      }))

      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
      await axios.post(`${baseURL}/orders`, {
          items,
          shipping_address: {
              recipient_name: recipientName.value,
              phone: phone.value,
              street: street.value,
              city: city.value,
              province: province.value,
              postal_code: postalCode.value,
          },
          payment_method: paymentMethod.value,
          delivery_fee: deliveryFee.value,
          discount_amount: discountAmount.value,
          promo_code: appliedPromoCode.value || null,
          notes: notes.value || null,
      }, {
          headers: { Authorization: `Bearer ${token.value}` }
      })

      finalTotal.value = grandTotal.value
      finalPaymentMethod.value = paymentMethod.value
      step.value = 'success'
      cartItems.value = [] // clear cart
      removePromo() // reset promo
  } catch (error: any) {
      console.error('Failed to place order:', error)
      const msg = error.response?.data?.message || error.response?.data?.errors
      if (typeof msg === 'object' && msg !== null) {
          // Laravel validation errors object
          const keys = Object.keys(msg)
          if (keys.length > 0) {
              const firstKey = keys[0] as string
              orderError.value = (msg as any)[firstKey]?.[0] || 'Validasi gagal. Periksa kembali data Anda.'
          } else {
              orderError.value = 'Validasi gagal. Periksa kembali data Anda.'
          }
      } else {
          orderError.value = msg || 'Gagal membuat pesanan. Pastikan stok produk mencukupi.'
      }
  } finally {
      loading.value = false
  }
}

const resetCart = () => {
  step.value = 'cart'
  toggleCart()
  router.push('/orders')
}
</script>

<template>
  <div>
    <!-- Backdrop -->
    <div 
      v-if="isCartOpen" 
      class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 transition-opacity"
      @click="toggleCart"
    ></div>

    <!-- Sidebar Menu -->
    <div 
      class="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col"
      :class="isCartOpen ? 'translate-x-0' : 'translate-x-full'"
    >
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white z-10">
        <div class="flex items-center space-x-2">
          <ShoppingBag class="h-5 w-5 text-freshco-green" />
          <h2 class="text-lg font-bold text-gray-900">
            <span v-if="step === 'cart'">Your Cart</span>
            <span v-else-if="step === 'checkout'">Checkout</span>
            <span v-else>Order Complete</span>
          </h2>
        </div>
        <button 
          @click="toggleCart" 
          class="p-2 -mr-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-50"
        >
          <X class="h-5 w-5" />
        </button>
      </div>

      <!-- Step: Cart -->
      <template v-if="step === 'cart'">
        <div class="flex-1 overflow-y-auto p-6">
          <div v-if="cartItems.length === 0" class="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
            <ShoppingBag class="h-16 w-16 text-gray-200" />
            <p class="text-lg font-medium text-gray-500">Your cart is empty</p>
            <button @click="toggleCart" class="text-freshco-green font-bold hover:underline">Start Shopping</button>
          </div>

          <div v-else class="space-y-4">
            <div v-for="item in cartItems" :key="item.id" class="flex gap-4 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
              <div class="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center p-2 flex-shrink-0">
                 <img :src="item.imageUrl" :alt="item.title" class="max-w-full max-h-full object-contain" />
              </div>
              
              <div class="flex-1 flex flex-col justify-between py-1">
                <div class="flex justify-between items-start">
                  <h3 class="font-semibold text-gray-800 text-sm line-clamp-2 leading-tight pr-2">{{ item.title }}</h3>
                  <button @click="confirmDelete(item.id)" class="text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
                
                <div class="flex items-center justify-between mt-2">
                  <p class="text-freshco-green font-bold text-sm">{{ formatPrice(item.price) }}</p>
                  <div class="flex items-center gap-3 bg-gray-50 rounded-lg px-2 py-1 border border-gray-100">
                    <button @click="updateQuantity(item.id, item.quantity - 1)" class="text-gray-500 hover:text-freshco-green">
                      <Minus class="h-3 w-3" />
                    </button>
                    <span class="text-xs font-bold w-4 text-center text-gray-800">{{ item.quantity }}</span>
                    <button @click="updateQuantity(item.id, item.quantity + 1)" class="text-gray-500 hover:text-freshco-green">
                      <Plus class="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div v-if="cartItems.length > 0" class="p-6 border-t border-gray-100 bg-white">
          <div class="flex justify-between text-gray-600 mb-2 text-sm">
            <p>Subtotal</p>
            <p class="font-bold text-gray-800">{{ formatPrice(cartTotal) }}</p>
          </div>
          <div class="flex justify-between text-lg font-bold text-gray-900 mb-6 pt-4 border-t border-gray-100">
            <p>Total</p>
            <p class="text-freshco-green">{{ formatPrice(cartTotal) }}</p>
          </div>
          <button @click="proceedToCheckout" class="w-full bg-freshco-green text-white py-3.5 px-6 rounded-xl font-bold hover:bg-[#0c513e] transition-colors shadow-md shadow-freshco-green/20">
            Proceed to Checkout
          </button>
        </div>
      </template>

      <!-- Step: Checkout -->
      <template v-else-if="step === 'checkout'">
        <div class="flex-1 overflow-y-auto p-6 space-y-5">
           
           <!-- Error Message -->
           <div v-if="orderError" class="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium">
              {{ orderError }}
           </div>

           <!-- Shipping Details -->
           <div class="space-y-3">
              <h3 class="font-bold text-gray-900 flex items-center gap-2"><MapPin class="h-4 w-4 text-freshco-green"/> Shipping Details</h3>
              <div class="grid grid-cols-2 gap-3">
                 <div class="col-span-2">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Nama Penerima <span class="text-red-400">*</span></label>
                    <input type="text" v-model="recipientName" class="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-freshco-green focus:ring-1 focus:ring-freshco-green" placeholder="nama" />
                 </div>
                 <div class="col-span-2">
                    <label class="block text-xs font-medium text-gray-700 mb-1">No. Telepon <span class="text-red-400">*</span></label>
                    <input type="text" v-model="phone" class="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-freshco-green focus:ring-1 focus:ring-freshco-green" placeholder="+62 812..." />
                 </div>
                 <div class="col-span-2">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Alamat Lengkap <span class="text-red-400">*</span></label>
                    <textarea v-model="street" rows="2" class="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-freshco-green focus:ring-1 focus:ring-freshco-green" placeholder="Jl. Merdeka No. 10, Kel. ..."></textarea>
                 </div>
                 <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Kota <span class="text-red-400">*</span></label>
                    <input type="text" v-model="city" class="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-freshco-green focus:ring-1 focus:ring-freshco-green" placeholder="Bandung" />
                 </div>
                 <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Provinsi <span class="text-red-400">*</span></label>
                    <input type="text" v-model="province" class="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-freshco-green focus:ring-1 focus:ring-freshco-green" placeholder="Jawa Barat" />
                 </div>
                 <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Kode Pos <span class="text-red-400">*</span></label>
                    <input type="text" v-model="postalCode" class="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-freshco-green focus:ring-1 focus:ring-freshco-green" placeholder="40115" />
                 </div>
                 <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Catatan</label>
                    <input type="text" v-model="notes" class="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-freshco-green focus:ring-1 focus:ring-freshco-green" placeholder="Opsional" />
                 </div>
              </div>
           </div>

           <!-- Delivery Option -->
           <div class="space-y-3 pt-4 border-t border-gray-100">
              <h3 class="font-bold text-gray-900 flex items-center gap-2"><Truck class="h-4 w-4 text-freshco-green"/> Delivery Option</h3>
              <div class="space-y-2">
                 <label class="flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all" :class="deliveryOption === 'standard' ? 'border-freshco-green bg-green-50 shadow-sm' : 'border-gray-200 hover:bg-gray-50'">
                    <div class="flex items-center gap-3">
                       <input type="radio" v-model="deliveryOption" value="standard" class="text-freshco-green focus:ring-freshco-green" />
                       <div>
                          <span class="text-sm font-semibold block">Standard Delivery</span>
                          <span class="text-xs text-gray-500">Estimasi 2–3 hari</span>
                       </div>
                    </div>
                    <span class="text-sm font-bold text-green-600">Gratis</span>
                 </label>
                 <label class="flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all" :class="deliveryOption === 'express' ? 'border-freshco-green bg-green-50 shadow-sm' : 'border-gray-200 hover:bg-gray-50'">
                    <div class="flex items-center gap-3">
                       <input type="radio" v-model="deliveryOption" value="express" class="text-freshco-green focus:ring-freshco-green" />
                       <div>
                          <span class="text-sm font-semibold block">Express Delivery</span>
                          <span class="text-xs text-gray-500">Estimasi 1 hari</span>
                       </div>
                    </div>
                    <div class="text-right">
                       <span v-if="isEligibleForFreeExpress" class="text-sm font-bold text-green-600 block">Gratis</span>
                       <span v-if="isEligibleForFreeExpress" class="text-[10px] text-gray-400 line-through block">Rp 15.000</span>
                       <span v-else class="text-sm font-bold text-gray-700">Rp 15.000</span>
                    </div>
                 </label>
                 <label class="flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all" :class="deliveryOption === 'same_day' ? 'border-freshco-green bg-green-50 shadow-sm' : 'border-gray-200 hover:bg-gray-50'">
                    <div class="flex items-center gap-3">
                       <input type="radio" v-model="deliveryOption" value="same_day" class="text-freshco-green focus:ring-freshco-green" />
                       <div>
                          <span class="text-sm font-semibold block">Same Day Delivery</span>
                          <span class="text-xs text-gray-500">Tiba hari ini</span>
                       </div>
                    </div>
                    <span class="text-sm font-bold text-gray-700">Rp 25.000</span>
                 </label>
              </div>
           </div>

           <!-- Promo Code -->
           <div class="space-y-3 pt-4 border-t border-gray-100">
              <h3 class="font-bold text-gray-900 flex items-center gap-2">🎫 Promo Code</h3>
              <div v-if="!appliedPromoCode" class="flex gap-2">
                 <input type="text" v-model="promoCodeInput" placeholder="Contoh: INSEND20" class="flex-1 border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-freshco-green focus:ring-1 focus:ring-freshco-green uppercase" />
                 <button @click="applyPromo" :disabled="promoLoading" class="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors disabled:opacity-50">
                    {{ promoLoading ? '...' : 'Apply' }}
                 </button>
              </div>
              <div v-else class="flex items-center justify-between bg-green-50 border border-freshco-green p-3 rounded-xl">
                 <div>
                    <span class="text-xs text-green-600 font-bold uppercase tracking-wider block">Voucher Applied</span>
                    <span class="text-sm font-semibold text-gray-900">{{ appliedPromoCode }}</span>
                 </div>
                 <button @click="removePromo" class="text-red-500 hover:text-red-600 text-sm font-bold">Remove</button>
              </div>
              <p v-if="promoError" class="text-xs text-red-500 font-medium">{{ promoError }}</p>
              <p v-if="promoSuccess" class="text-xs text-green-600 font-medium">{{ promoSuccess }}</p>
           </div>

           <!-- Payment Method -->
           <div class="space-y-3 pt-4 border-t border-gray-100">
              <h3 class="font-bold text-gray-900 flex items-center gap-2"><CreditCard class="h-4 w-4 text-freshco-green"/> Payment Method</h3>
              <div class="space-y-2">
                 <label class="flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all" :class="paymentMethod === 'qris' ? 'border-freshco-green bg-green-50 shadow-sm' : 'border-gray-200 hover:bg-gray-50'">
                    <div class="flex items-center gap-3">
                       <input type="radio" v-model="paymentMethod" value="qris" class="text-freshco-green focus:ring-freshco-green" />
                       <div>
                          <span class="text-sm font-semibold block">QRIS (GoPay, OVO, Dana)</span>
                          <span class="text-xs text-gray-500">Scan cepat & mudah</span>
                       </div>
                    </div>
                    <span class="text-lg">📱</span>
                 </label>
                 <label class="flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all" :class="paymentMethod === 'bank_transfer' ? 'border-freshco-green bg-green-50 shadow-sm' : 'border-gray-200 hover:bg-gray-50'">
                    <div class="flex items-center gap-3">
                       <input type="radio" v-model="paymentMethod" value="bank_transfer" class="text-freshco-green focus:ring-freshco-green" />
                       <div>
                          <span class="text-sm font-semibold block">Virtual Account</span>
                          <span class="text-xs text-gray-500">BCA, Mandiri, BNI, BRI</span>
                       </div>
                    </div>
                    <span class="text-lg">🏦</span>
                 </label>
                 <label class="flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all" :class="paymentMethod === 'cod' ? 'border-freshco-green bg-green-50 shadow-sm' : 'border-gray-200 hover:bg-gray-50'">
                    <div class="flex items-center gap-3">
                       <input type="radio" v-model="paymentMethod" value="cod" class="text-freshco-green focus:ring-freshco-green" />
                       <div>
                          <span class="text-sm font-semibold block">Cash on Delivery</span>
                          <span class="text-xs text-gray-500">Bayar saat pesanan tiba</span>
                       </div>
                    </div>
                    <span class="text-lg">💵</span>
                 </label>
              </div>
           </div>
           
           <!-- Order Summary -->
           <div class="bg-gray-50 rounded-xl p-4 space-y-2">
              <div class="flex justify-between text-sm text-gray-600">
                  <span>Subtotal ({{ cartItems.length }} item)</span>
                  <span class="font-semibold text-gray-800">{{ formatPrice(cartTotal) }}</span>
              </div>
              <div class="flex justify-between text-sm text-gray-600">
                  <span>Ongkos Kirim</span>
                  <span class="font-semibold" :class="deliveryFee === 0 ? 'text-green-600' : 'text-gray-800'">{{ deliveryFee === 0 ? 'Gratis' : formatPrice(deliveryFee) }}</span>
              </div>
              <div v-if="discountAmount > 0" class="flex justify-between text-sm text-green-600">
                  <span>Diskon Voucher</span>
                  <span class="font-semibold">-{{ formatPrice(discountAmount) }}</span>
              </div>
              <div class="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span class="text-freshco-green">{{ formatPrice(grandTotal) }}</span>
              </div>
           </div>
        </div>

        <div class="p-6 border-t border-gray-100 bg-white flex gap-3">
          <button @click="step = 'cart'" class="w-1/3 py-3.5 px-4 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
            Back
          </button>
          <button @click="placeOrder" :disabled="!isCheckoutValid || loading" class="w-2/3 bg-freshco-green disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3.5 px-6 rounded-xl font-bold hover:bg-[#0c513e] transition-colors shadow-md shadow-freshco-green/20">
            {{ loading ? 'Processing...' : 'Place Order' }}
          </button>
        </div>
      </template>

      <!-- Step: Success -->
      <template v-else>
         <div class="flex-1 overflow-y-auto p-6">
            <div class="flex flex-col items-center justify-center text-center">
                <div class="w-20 h-20 bg-[#E8F3EF] rounded-full flex items-center justify-center mb-4 mt-8">
                   <CheckCircle2 class="w-10 h-10 text-freshco-green" />
                </div>
                <h2 class="text-2xl font-black text-gray-900 mb-2">Order Confirmed!</h2>
                <p class="text-gray-500 text-sm mb-8">Pesanan Anda berhasil dibuat.</p>
                
                <!-- Payment Instructions -->
                <div v-if="finalPaymentMethod === 'qris'" class="bg-gray-50 rounded-2xl p-6 w-full mb-8 border border-gray-100">
                   <h3 class="font-bold text-gray-900 mb-2">Silakan Lakukan Pembayaran QRIS</h3>
                   <p class="text-sm text-gray-500 mb-4">Total: <span class="font-bold text-freshco-green text-lg">{{ formatPrice(finalTotal) }}</span></p>
                   
                   <div class="bg-white p-2 rounded-xl shadow-sm inline-block mb-3 border border-gray-200 overflow-hidden w-full max-w-[200px]">
                      <img src="../../assets/qris.jpeg" alt="QRIS" class="w-full h-auto object-cover mx-auto" />
                   </div>
                   <p class="text-xs text-gray-500 mt-3 font-medium">Buka aplikasi e-wallet Anda (GoPay, OVO, dll) dan scan QR Code di atas.</p>
                </div>

                <div v-else-if="finalPaymentMethod === 'bank_transfer'" class="bg-gray-50 rounded-2xl p-6 w-full mb-8 border border-gray-100 text-left">
                   <h3 class="font-bold text-gray-900 mb-4 text-center">Instruksi Transfer Bank</h3>
                   
                   <div class="bg-white p-5 rounded-xl border border-gray-200 mb-4 shadow-sm">
                      <div class="flex justify-between items-start mb-2">
                          <p class="text-xs text-gray-500 font-bold tracking-wider uppercase">Bank BCA</p>
                          <img src="https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg" class="h-4 object-contain" />
                      </div>
                      <p class="text-2xl font-black text-gray-900 tracking-wider mb-1">736 158 9631</p> 
                      <p class="text-sm font-semibold text-gray-700">a/n Alhamid Adriansyah</p>
                   </div>
                   
                   <div class="flex justify-between items-center bg-green-50 p-4 rounded-xl border border-freshco-green">
                      <span class="text-sm font-medium text-green-800">Total Transfer</span>
                      <span class="font-black text-freshco-green text-lg">{{ formatPrice(finalTotal) }}</span>
                   </div>
                   <p class="text-xs text-gray-500 mt-4 text-center leading-relaxed">Harap transfer tepat sesuai nominal di atas. Pesanan akan diproses setelah pembayaran diverifikasi.</p>
                </div>

                <div v-else class="bg-gray-50 rounded-2xl p-6 w-full mb-8 border border-gray-100">
                   <h3 class="font-bold text-gray-900 mb-2">Cash on Delivery (COD)</h3>
                   <p class="text-sm text-gray-600 mb-4">Total tagihan: <span class="font-black text-freshco-green text-lg">{{ formatPrice(finalTotal) }}</span></p>
                   <p class="text-xs text-gray-500 leading-relaxed">Siapkan uang tunai pas sesuai nominal saat kurir tiba di alamat pengiriman Anda.</p>
                </div>
                
                <button @click="resetCart" class="w-full bg-freshco-green text-white py-3.5 px-6 rounded-xl font-bold hover:bg-[#0c513e] transition-colors shadow-md shadow-freshco-green/20">
                   Selesai & Lihat Pesanan
                </button>
            </div>
         </div>
      </template>
      <!-- Confirm Delete Modal -->
      <div v-if="itemToDelete" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl relative text-center">
              <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 class="w-8 h-8 text-red-500" />
              </div>
              <h3 class="text-xl font-black text-gray-900 mb-2">Hapus Pesanan?</h3>
              <p class="text-gray-500 text-sm mb-6">Apakah Anda yakin ingin menghapus pesanan ini dari keranjang?</p>
              <div class="flex gap-3">
                  <button @click="cancelDelete" class="flex-1 py-3 px-4 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">Batal</button>
                  <button @click="executeDelete" class="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-md shadow-red-500/20">Hapus</button>
              </div>
          </div>
      </div>
    </div>
  </div>
</template>
