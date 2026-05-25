<script setup lang="ts">
import { RouterView } from 'vue-router'
import CartSidebar from './components/layout/CartSidebar.vue'
import RecipeAssistant from './components/chatbot/RecipeAssistant.vue'
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
