<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import Navbar from '../components/layout/Navbar.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const handleForgotPassword = async () => {
    loading.value = true
    errorMessage.value = ''
    successMessage.value = ''
    try {
        const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
        const response = await axios.post(`${baseURL}/auth/forgot-password`, {
            email: email.value
        })
        
        successMessage.value = response.data.message || 'OTP sent successfully!'
        
        // Redirect to reset password page after a short delay
        setTimeout(() => {
            router.push({ path: '/reset-password', query: { email: email.value } })
        }, 2000)

    } catch (error: any) {
        errorMessage.value = error.response?.data?.message || 'Failed to send OTP. Please try again.'
    } finally {
        loading.value = false
    }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 font-sans text-gray-800 flex flex-col relative">
    
    <div class="absolute inset-0 z-0">
      <img src="../assets/bckrnd_inSend.jpg" class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-[#00473B] opacity-50"></div>
    </div>

    <div class="relative z-10 flex flex-col flex-1">
      <Navbar />
      
      <div class="flex-1 flex items-center justify-center p-4">
        <div class="bg-white/95 backdrop-blur-md rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20">
            <div class="text-center mb-8">
                <div class="inline-block bg-freshco-green text-white p-2.5 rounded-xl mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-key"><path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"/><path d="m21 2-9.6 9.6"/><circle cx="7.5" cy="15.5" r="5.5"/></svg>
                </div>
                <h2 class="text-2xl font-black text-gray-900">Forgot Password?</h2>
                <p class="text-gray-500 text-sm mt-1">Enter your email address and we'll send you an OTP to reset your password.</p>
            </div>

            <div v-if="errorMessage" class="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {{ errorMessage }}
            </div>
            
            <div v-if="successMessage" class="mb-4 bg-green-50 text-green-700 p-3 rounded-lg text-sm">
                {{ successMessage }} Redirecting...
            </div>

            <form @submit.prevent="handleForgotPassword" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input type="email" v-model="email" required class="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-freshco-green focus:ring-1 focus:ring-freshco-green" placeholder="you@example.com" />
                </div>
                
                <button type="submit" :disabled="loading || !!successMessage" class="w-full bg-freshco-green text-white py-3.5 rounded-xl font-bold hover:bg-[#0c513e] transition-colors mt-6 disabled:opacity-70">
                    <span v-if="loading">Sending...</span>
                    <span v-else>Send OTP</span>
                </button>
            </form>

            <div class="mt-8 text-center text-sm text-gray-600">
                Remember your password? 
                <RouterLink to="/login" class="text-freshco-green font-bold hover:underline">Back to Login</RouterLink>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>
