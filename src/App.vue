<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { RouterView } from 'vue-router'
import CartSidebar from './components/layout/CartSidebar.vue'
import RecipeAssistant from './components/chatbot/RecipeAssistant.vue'
import { useWishlist } from './store/wishlist'
import { useAuth } from './store/auth'

const { fetchWishlist } = useWishlist()
const { isAuthenticated } = useAuth()

onMounted(() => {
  if (isAuthenticated.value) {
    fetchWishlist()
  }
})

// Refetch if auth state changes (e.g. login/logout)
watch(isAuthenticated, (newVal) => {
  if (newVal) {
    fetchWishlist()
  } else {
    // Clear wishlist if logged out
    const { wishlistItems } = useWishlist()
    wishlistItems.value = []
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 font-sans relative">
    <RouterView />
    <CartSidebar />
    <RecipeAssistant />
  </div>
</template>

<style>
/* Global styles can go here if needed */
</style>
