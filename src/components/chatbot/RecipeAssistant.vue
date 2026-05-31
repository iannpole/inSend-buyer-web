<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { Send, Bot, ShoppingBag, ShoppingCart, X } from 'lucide-vue-next'
import { useCart } from '../../store/cart'
import { useAuth } from '../../store/auth'
import axios from 'axios'

const isOpen = ref(false)
const inputQuery = ref('')
const isLoading = ref(false)
const conversationId = ref<string | null>(null)

interface ChatMessage {
  id: number
  sender: 'user' | 'bot'
  text: string
  recipes?: any[]
}

const chatMessages = ref<ChatMessage[]>([
  { id: 1, sender: 'bot', text: 'Halo! Aku AI Chef inSend 🧑‍🍳. Mau masak apa hari ini? Ketik nama masakan (misal: "sayur sop" atau "nasi goreng") dan aku siapkan resep beserta bahan-bahannya.' }
])
const chatContainer = ref<HTMLElement | null>(null)
const { addToCart } = useCart()
const { token, isAuthenticated } = useAuth()

// Auto scroll to bottom
watch(chatMessages, async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}, { deep: true })

const sendMessage = async () => {
  if (!inputQuery.value.trim() || isLoading.value) return
  
  const query = inputQuery.value.trim()
  chatMessages.value.push({
    id: Date.now(),
    sender: 'user',
    text: query
  })
  
  inputQuery.value = ''
  isLoading.value = true
  
  try {
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
    
    // Build request payload
    const payload: any = {
      message: query,
      mode: 'recipe'
    }
    if (conversationId.value) {
      payload.conversation_id = conversationId.value
    }

    // Build headers — AI chat requires auth
    const headers: any = {
      'Content-Type': 'application/json'
    }
    if (token.value) {
      headers['Authorization'] = `Bearer ${token.value}`
    }

    const response = await axios.post(`${baseURL}/ai/chat`, payload, { headers })
    
    const data = response.data

    // Save conversation ID for follow-up messages
    if (data.conversation_id) {
      conversationId.value = data.conversation_id
    }

    // Build bot message
    const botMessage: ChatMessage = {
      id: Date.now() + 1,
      sender: 'bot',
      text: data.reply || data.message || 'Maaf, saya tidak bisa memproses permintaan itu.',
      recipes: data.recipes && data.recipes.length > 0 ? data.recipes : undefined
    }
    
    chatMessages.value.push(botMessage)
    
  } catch (error: any) {
    console.error('AI Chat error:', error)
    
    let errorMsg = 'Maaf, terjadi kesalahan saat menghubungi AI Chef.'
    
    if (error.response?.status === 401) {
      errorMsg = 'Kamu perlu login terlebih dahulu untuk menggunakan AI Chef. Silakan login di menu akun.'
    } else if (error.response?.status === 500) {
      errorMsg = 'Server sedang bermasalah. Coba lagi nanti ya.'
    } else if (error.response?.data?.message) {
      errorMsg = error.response.data.message
    }
    
    chatMessages.value.push({
      id: Date.now() + 1,
      sender: 'bot',
      text: errorMsg
    })
  } finally {
    isLoading.value = false
  }
}

const addRecipeIngredients = (recipe: any) => {
  // Recipe structure from RecipeBotService: { name, ingredients: [{name, amount, unit, product_id?}], ... }
  const ingredients = recipe.ingredients || []
  let addedCount = 0;
  let unmappedCount = 0;

  ingredients.forEach((item: any) => {
    if (item.product_id) {
      addToCart({
        id: item.product_id,
        title: typeof item === 'string' ? item : (item.name || 'Bahan'),
        price: item.price || 15000, // Default price if not available
        imageUrl: item.imageUrl || 'https://via.placeholder.com/80?text=' + encodeURIComponent(typeof item === 'string' ? item : (item.name || 'Bahan'))
      }, item.qty || 1)
      addedCount++;
    } else {
      unmappedCount++;
    }
  })

  let botMessage = ''
  if (unmappedCount > 0 && addedCount > 0) {
    botMessage = `Bip bop! Menambahkan ${addedCount} bahan ke keranjang. ${unmappedCount} bahan lainnya belum tersedia di toko kami.`
  } else if (addedCount > 0) {
    botMessage = `Bip bop! Semua bahan berhasil ditambahkan ke keranjang.`
  } else {
    botMessage = `Maaf, tidak ada bahan dari resep ini yang tersedia di toko saat ini.`
  }

  chatMessages.value.push({
    id: Date.now() + 2,
    sender: 'bot',
    text: botMessage
  })
}

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

// Get ingredient display label
const getIngLabel = (ing: any): string => {
  if (typeof ing === 'string') return ing
  let label = ing.name || ''
  if (ing.amount) label = `${ing.amount} ${ing.unit || ''} ${label}`.trim()
  return label
}
</script>

<template>
  <div class="fixed bottom-6 right-6 z-50">
    <!-- Chat Button -->
    <button 
      v-if="!isOpen"
      @click="isOpen = true"
      class="group flex items-center justify-center w-14 h-14 bg-freshco-green border-2 border-[#0c513e] rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
    >
      <Bot class="text-white h-7 w-7 stroke-[2.5]" />
    </button>

    <!-- Chat Window -->
    <div 
      v-else
      class="w-80 sm:w-96 bg-gray-50 border border-gray-200 shadow-2xl rounded-[2rem] overflow-hidden flex flex-col transition-all duration-300"
      style="height: 500px; max-height: 80vh;"
    >
      <!-- Header -->
      <div class="bg-freshco-green p-4 flex justify-between items-center text-white z-10">
        <div class="flex items-center space-x-3">
          <div class="p-1.5 bg-white/20 rounded-xl">
            <Bot class="h-5 w-5 stroke-[2.5] text-white" />
          </div>
          <div>
            <h3 class="font-black text-sm leading-tight text-white mb-0.5">Smart Recipe Bot</h3>
            <p class="text-[10px] font-bold text-white/70">by inSend AI</p>
          </div>
        </div>
        <button @click="isOpen = false" class="text-white/80 hover:text-white transition-colors p-1">
          <X class="h-6 w-6 stroke-[2.5]" />
        </button>
      </div>

      <!-- Auth Warning -->
      <div v-if="!isAuthenticated" class="bg-yellow-50 border-b border-yellow-100 px-4 py-2 text-xs text-yellow-700 font-medium">
        ⚠️ Login diperlukan untuk menggunakan AI Chef.
      </div>

      <!-- Messages Area -->
      <div 
        ref="chatContainer"
        class="flex-1 overflow-y-auto p-4 space-y-4 bg-transparent scroll-smooth font-sans"
      >
        <div 
          v-for="msg in chatMessages" 
          :key="msg.id"
          class="flex w-full"
          :class="msg.sender === 'user' ? 'justify-end' : 'justify-start'"
        >
          <!-- User Bubble -->
          <div v-if="msg.sender === 'user'" class="bg-freshco-green text-white font-medium rounded-2xl rounded-br-sm px-4 py-2.5 max-w-[85%] shadow-sm text-sm">
            {{ msg.text }}
          </div>
          
          <!-- Bot Bubble -->
          <div v-else class="flex space-x-2 max-w-[90%]">
            <div class="w-8 h-8 rounded-full bg-freshco-green flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
              <Bot class="h-4 w-4 text-white" />
            </div>
            <div class="bg-white border border-gray-100 text-gray-800 font-medium rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm text-sm space-y-3">
              <p class="whitespace-pre-wrap">{{ msg.text }}</p>
              
              <!-- Recipe Cards from AI -->
              <div v-if="msg.recipes && msg.recipes.length > 0" class="space-y-3 mt-3">
                <div v-for="(recipe, rIdx) in msg.recipes" :key="rIdx" class="bg-gray-50 border border-gray-100 rounded-xl overflow-hidden">
                  <div class="px-3 py-2 bg-freshco-green/10 border-b border-gray-100">
                    <p class="font-bold text-freshco-green text-[11px] flex items-center space-x-1 uppercase tracking-wider">
                      <ShoppingBag class="h-3 w-3 stroke-[3]" />
                      <span>{{ recipe.name || recipe.title || 'Resep' }}</span>
                    </p>
                  </div>
                  
                  <!-- Ingredients list -->
                  <div v-if="recipe.ingredients && recipe.ingredients.length > 0" class="p-2 space-y-1.5">
                    <div v-for="(item, iIdx) in recipe.ingredients" :key="iIdx" class="flex justify-between items-center text-xs border-b border-gray-50 pb-1.5 last:border-0 last:pb-0">
                      <div class="flex items-center space-x-2 flex-1 min-w-0">
                        <span class="text-gray-700 font-medium truncate">{{ getIngLabel(item) }}</span>
                      </div>
                      <span v-if="item.price" class="font-bold text-freshco-green ml-2 whitespace-nowrap">{{ formatPrice(item.price) }}</span>
                    </div>
                  </div>
                  
                  <div class="p-2 pt-0">
                    <button 
                      @click="addRecipeIngredients(recipe)"
                      class="w-full flex items-center justify-center space-x-1.5 bg-freshco-green text-white py-2 px-3 rounded-xl text-xs font-bold hover:bg-[#0c513e] transition-colors"
                    >
                      <ShoppingCart class="h-4 w-4 stroke-[3]" />
                      <span>Beli Semua Bahan</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- Typing Indicator -->
        <div v-if="isLoading" class="flex justify-start space-x-2 max-w-[90%]">
          <div class="w-8 h-8 rounded-full bg-freshco-green flex items-center justify-center flex-shrink-0 shadow-sm">
            <Bot class="h-4 w-4 text-white" />
          </div>
          <div class="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex space-x-1.5 items-center">
             <div class="w-2 h-2 bg-freshco-green rounded-full animate-bounce"></div>
             <div class="w-2 h-2 bg-freshco-green rounded-full animate-bounce" style="animation-delay: 0.15s"></div>
             <div class="w-2 h-2 bg-freshco-green rounded-full animate-bounce" style="animation-delay: 0.3s"></div>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="p-3 bg-white border-t border-gray-100">
        <form @submit.prevent="sendMessage" class="relative flex items-center">
          <input 
            v-model="inputQuery"
            type="text" 
            placeholder="Mau masak apa hari ini?..." 
            class="w-full bg-gray-50 border border-gray-200 text-gray-800 font-medium text-sm rounded-full pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-freshco-green/30 focus:border-freshco-green placeholder-gray-400 transition-all"
            :disabled="isLoading"
          />
          <button 
            type="submit"
            :disabled="!inputQuery.trim() || isLoading"
            class="absolute right-1.5 p-2 rounded-full text-white bg-freshco-green disabled:opacity-50 hover:bg-[#0c513e] transition-all"
          >
            <Send class="h-4 w-4 stroke-[2.5]" />
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
