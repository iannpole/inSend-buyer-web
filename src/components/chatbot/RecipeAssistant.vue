<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { Send, Bot, ShoppingBag, ShoppingCart, X } from 'lucide-vue-next'
import { getAIResponse } from '../../data/mockRecipes'
import type { RecipeResponse } from '../../data/mockRecipes'
import { useCart } from '../../store/cart'

const isOpen = ref(false)
const inputQuery = ref('')
const isLoading = ref(false)
const chatMessages = ref<{ id: number, sender: 'user'|'bot', text: string, recipeData?: RecipeResponse }[]>([
  { id: 1, sender: 'bot', text: 'Halo! Aku AI Chef inSend 🧑‍🍳. Mau masak apa hari ini? Ketik nama masakan (misal: "sayur sop" atau "nasi goreng") dan aku siapkan bahan-bahannya.' }
])
const chatContainer = ref<HTMLElement | null>(null)
const { addToCart } = useCart()

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
  
  // Fetch AI Response
  const response = await getAIResponse(query)
  
  chatMessages.value.push({
    id: Date.now() + 1,
    sender: 'bot',
    text: response.message,
    recipeData: response.ingredients ? response : undefined
  })
  
  isLoading.value = false
}

const addAllIngredients = (recipe: RecipeResponse) => {
  if (!recipe.ingredients) return
  recipe.ingredients.forEach(item => {
    addToCart({
      id: item.product_id,
      title: item.name,
      price: item.price,
      imageUrl: item.imageUrl
    }, item.qty)
  })
}

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}
</script>

<template>
  <div class="fixed bottom-6 right-6 z-50">
    <!-- Chat Button -->
    <button 
      v-if="!isOpen"
      @click="isOpen = true"
      class="group flex items-center justify-center w-14 h-14 bg-misfits-orange border-2 border-misfits-green rounded-full shadow-[4px_4px_0px_#00473B] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#00473B] transition-all duration-300"
    >
      <Bot class="text-white h-7 w-7 stroke-[2.5]" />
    </button>

    <!-- Chat Window -->
    <div 
      v-else
      class="w-80 sm:w-96 bg-misfits-bg border-4 border-misfits-green shadow-[8px_8px_0px_#00473B] rounded-[2rem] overflow-hidden flex flex-col transform transition-all duration-300 animate-in slide-in-from-bottom-8 origin-bottom-right"
      style="height: 500px; max-height: 80vh;"
    >
      <!-- Header -->
      <div class="bg-misfits-green border-b-4 border-misfits-green p-4 flex justify-between items-center text-misfits-bg z-10">
        <div class="flex items-center space-x-3">
          <div class="p-1.5 bg-misfits-yellow text-misfits-green rounded-xl border-2 border-misfits-green shadow-[2px_2px_0px_#00473B]">
            <Bot class="h-5 w-5 stroke-[2.5]" />
          </div>
          <div>
            <h3 class="font-black text-sm leading-tight text-white mb-0.5">Smart Recipe Bot</h3>
            <p class="text-[10px] font-bold text-misfits-bg bg-misfits-green border border-misfits-border px-1.5 rounded inline-block">by inSend AI</p>
          </div>
        </div>
        <button @click="isOpen = false" class="text-misfits-bg hover:text-misfits-yellow transition-colors p-1">
          <X class="h-6 w-6 stroke-[2.5]" />
        </button>
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
          <div v-if="msg.sender === 'user'" class="bg-misfits-yellow text-misfits-green font-bold border-2 border-misfits-green rounded-2xl rounded-br-sm px-4 py-2 max-w-[85%] shadow-[2px_2px_0px_#00473B] text-sm">
            {{ msg.text }}
          </div>
          
          <!-- Bot Bubble -->
          <div v-else class="flex space-x-2 max-w-[90%]">
            <div class="w-8 h-8 rounded-full border-2 border-misfits-green bg-misfits-green flex items-center justify-center flex-shrink-0 mt-1 shadow-[1px_1px_0px_#00473B]">
              <Bot class="h-4 w-4 text-white" />
            </div>
            <div class="bg-white border-2 border-misfits-green text-misfits-green font-medium rounded-2xl rounded-bl-sm px-4 py-3 shadow-[2px_2px_0px_#00473B] text-sm space-y-3">
              <p>{{ msg.text }}</p>
              
              <!-- Recipe Ingredients Card -->
              <div v-if="msg.recipeData && msg.recipeData.ingredients" class="mt-3 bg-misfits-bg border-2 border-misfits-green rounded-xl overflow-hidden shadow-[2px_2px_0px_#00473B]">
                <div class="px-3 py-2 bg-misfits-green border-b-2 border-misfits-green">
                  <p class="font-black text-white text-[11px] flex items-center space-x-1 uppercase tracking-wider">
                    <ShoppingBag class="h-3 w-3 stroke-[3]" />
                    <span>Bahan {{ msg.recipeData.recipeName }}</span>
                  </p>
                </div>
                <div class="p-2 space-y-2">
                  <div v-for="item in msg.recipeData.ingredients" :key="item.id" class="flex justify-between items-center text-xs border-b border-misfits-green/10 pb-2 last:border-0 last:pb-0">
                    <div class="flex items-center space-x-2 flex-1 min-w-0">
                      <img :src="item.imageUrl" class="w-7 h-7 rounded bg-white object-cover border-2 border-misfits-green" />
                      <span class="text-misfits-green font-bold truncate">{{ item.name }}</span>
                    </div>
                    <span class="font-black text-misfits-green ml-2 whitespace-nowrap">{{ formatPrice(item.price) }}</span>
                  </div>
                </div>
                <div class="p-2 pt-0">
                  <button 
                    @click="addAllIngredients(msg.recipeData!)"
                    class="w-full flex items-center justify-center space-x-1.5 bg-misfits-orange text-white py-2 px-3 rounded-xl text-xs font-black border-2 border-misfits-green shadow-[2px_2px_0px_#00473B] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#00473B] transition-all"
                  >
                    <ShoppingCart class="h-4 w-4 stroke-[3]" />
                    <span>Beli Semua Bahan</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- Typing Indicator -->
        <div v-if="isLoading" class="flex justify-start space-x-2 max-w-[90%]">
          <div class="w-8 h-8 rounded-full border-2 border-misfits-green bg-misfits-green flex items-center justify-center flex-shrink-0 shadow-[1px_1px_0px_#00473B]">
            <Bot class="h-4 w-4 text-white" />
          </div>
          <div class="bg-white border-2 border-misfits-green rounded-2xl rounded-bl-sm px-4 py-3 shadow-[2px_2px_0px_#00473B] flex space-x-1.5 items-center">
             <div class="w-2 h-2 bg-misfits-orange rounded-full border border-misfits-green animate-bounce"></div>
             <div class="w-2 h-2 bg-misfits-orange rounded-full border border-misfits-green animate-bounce" style="animation-delay: 0.15s"></div>
             <div class="w-2 h-2 bg-misfits-orange rounded-full border border-misfits-green animate-bounce" style="animation-delay: 0.3s"></div>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="p-3 bg-misfits-green border-t-4 border-misfits-green">
        <form @submit.prevent="sendMessage" class="relative flex items-center">
          <input 
            v-model="inputQuery"
            type="text" 
            placeholder="Tulis resep..." 
            class="w-full bg-white border-2 border-misfits-green text-misfits-green font-bold text-sm rounded-full pl-4 pr-12 py-3 focus:outline-none focus:ring-0 shadow-[2px_2px_0px_#00473B] placeholder-misfits-green/50"
            :disabled="isLoading"
          />
          <button 
            type="submit"
            :disabled="!inputQuery.trim() || isLoading"
            class="absolute right-2 p-1.5 rounded-full text-misfits-green bg-misfits-yellow border-2 border-misfits-green shadow-[1px_1px_0px_#00473B] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[1px_1px_0px_#00473B] transition-all"
          >
            <Send class="h-4 w-4 stroke-[3]" />
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
