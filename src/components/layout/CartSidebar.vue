<script setup lang="ts">
import { X, Minus, Plus, ShoppingBag, Trash2, MapPin, CreditCard, CheckCircle2 } from 'lucide-vue-next'
import { useCart } from '../../store/cart'
import { ref } from 'vue'

const { isCartOpen, cartItems, toggleCart, updateQuantity, removeFromCart, cartTotal } = useCart()

const step = ref<'cart' | 'checkout' | 'success'>('cart')
const shippingAddress = ref('')
const paymentMethod = ref('transfer')

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

const proceedToCheckout = () => {
  step.value = 'checkout'
}

const placeOrder = () => {
  // Mock API call
  setTimeout(() => {
    step.value = 'success'
    cartItems.value = [] // clear cart
  }, 1000)
}

const resetCart = () => {
  step.value = 'cart'
  toggleCart()
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
              <!-- Item Image -->
              <div class="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center p-2 flex-shrink-0">
                 <img :src="item.imageUrl" :alt="item.title" class="max-w-full max-h-full object-contain" />
              </div>
              
              <!-- Item Info -->
              <div class="flex-1 flex flex-col justify-between py-1">
                <div class="flex justify-between items-start">
                  <h3 class="font-semibold text-gray-800 text-sm line-clamp-2 leading-tight pr-2">{{ item.title }}</h3>
                  <button @click="removeFromCart(item.id)" class="text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
                
                <div class="flex items-center justify-between mt-2">
                  <p class="text-freshco-green font-bold text-sm">{{ formatPrice(item.price) }}</p>
                  <!-- Quantity -->
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
          <div class="flex justify-between text-gray-600 mb-4 text-sm">
            <p>Delivery</p>
            <p class="font-bold text-green-600">Free</p>
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
        <div class="flex-1 overflow-y-auto p-6 space-y-6">
           
           <!-- Shipping Details -->
           <div class="space-y-3">
              <h3 class="font-bold text-gray-900 flex items-center gap-2"><MapPin class="h-4 w-4 text-freshco-green"/> Shipping Details</h3>
              <div class="space-y-3">
                 <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" class="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-freshco-green focus:ring-1 focus:ring-freshco-green" placeholder="John Doe" />
                 </div>
                 <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
                    <input type="text" class="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-freshco-green focus:ring-1 focus:ring-freshco-green" placeholder="+62 812..." />
                 </div>
                 <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Full Address</label>
                    <textarea v-model="shippingAddress" rows="3" class="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-freshco-green focus:ring-1 focus:ring-freshco-green" placeholder="Street name, building, house number..."></textarea>
                 </div>
              </div>
           </div>

           <!-- Payment Method -->
           <div class="space-y-3 pt-4 border-t border-gray-100">
              <h3 class="font-bold text-gray-900 flex items-center gap-2"><CreditCard class="h-4 w-4 text-freshco-green"/> Payment Method</h3>
              <div class="space-y-2">
                 <label class="flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors" :class="paymentMethod === 'transfer' ? 'border-freshco-green bg-[#E8F3EF]' : 'border-gray-200 hover:bg-gray-50'">
                    <div class="flex items-center gap-3">
                       <input type="radio" v-model="paymentMethod" value="transfer" class="text-freshco-green focus:ring-freshco-green" />
                       <span class="text-sm font-medium">Bank Transfer</span>
                    </div>
                 </label>
                 <label class="flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors" :class="paymentMethod === 'cod' ? 'border-freshco-green bg-[#E8F3EF]' : 'border-gray-200 hover:bg-gray-50'">
                    <div class="flex items-center gap-3">
                       <input type="radio" v-model="paymentMethod" value="cod" class="text-freshco-green focus:ring-freshco-green" />
                       <span class="text-sm font-medium">Cash on Delivery</span>
                    </div>
                 </label>
                 <label class="flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors" :class="paymentMethod === 'card' ? 'border-freshco-green bg-[#E8F3EF]' : 'border-gray-200 hover:bg-gray-50'">
                    <div class="flex items-center gap-3">
                       <input type="radio" v-model="paymentMethod" value="card" class="text-freshco-green focus:ring-freshco-green" />
                       <span class="text-sm font-medium">Credit / Debit Card</span>
                    </div>
                 </label>
              </div>
           </div>
           
           <!-- Order Summary -->
           <div class="bg-gray-50 rounded-xl p-4">
              <p class="text-xs text-gray-500 mb-2">Total Amount to Pay</p>
              <p class="text-2xl font-black text-freshco-green">{{ formatPrice(cartTotal) }}</p>
           </div>
        </div>

        <div class="p-6 border-t border-gray-100 bg-white flex gap-3">
          <button @click="step = 'cart'" class="w-1/3 py-3.5 px-4 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
            Back
          </button>
          <button @click="placeOrder" :disabled="!shippingAddress" class="w-2/3 bg-freshco-green disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3.5 px-6 rounded-xl font-bold hover:bg-[#0c513e] transition-colors shadow-md shadow-freshco-green/20">
            Place Order
          </button>
        </div>
      </template>

      <!-- Step: Success -->
      <template v-else>
         <div class="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div class="w-20 h-20 bg-[#E8F3EF] rounded-full flex items-center justify-center mb-6">
               <CheckCircle2 class="w-10 h-10 text-freshco-green" />
            </div>
            <h2 class="text-2xl font-black text-gray-900 mb-2">Order Confirmed!</h2>
            <p class="text-gray-500 text-sm mb-8">Your order has been successfully placed. We'll send you an email confirmation shortly.</p>
            
            <button @click="resetCart" class="w-full bg-freshco-green text-white py-3.5 px-6 rounded-xl font-bold hover:bg-[#0c513e] transition-colors">
               Continue Shopping
            </button>
         </div>
      </template>

    </div>
  </div>
</template>
