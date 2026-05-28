<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Navbar from '../components/layout/Navbar.vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const email = ref('')
const otpCode = ref('')
const password = ref('')
const passwordConfirmation = ref('')

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

onMounted(() => {
    if (route.query.email) {
        email.value = route.query.email as string
    }
})

const handleResetPassword = async () => {
    if (password.value !== passwordConfirmation.value) {
        errorMessage.value = 'Passwords do not match.'
        return
    }

    loading.value = true
    errorMessage.value = ''
    successMessage.value = ''
    
    try {
        const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
        const response = await axios.post(`${baseURL}/auth/reset-password`, {
            email: email.value,
            otp_code: otpCode.value,
            password: password.value,
            password_confirmation: passwordConfirmation.value
        })
        
        successMessage.value = response.data.message || 'Password reset successful!'
        
        // Redirect to login after a short delay
        setTimeout(() => {
            router.push('/login')
        }, 2000)

    } catch (error: any) {
        errorMessage.value = error.response?.data?.message || 'Failed to reset password. Please verify your OTP and try again.'
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-check"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2-1 4-2 7-2 2.82 0 4.8 1 7 2a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>
                </div>
                <h2 class="text-2xl font-black text-gray-900">Reset Password</h2>
                <p class="text-gray-500 text-sm mt-1">Enter the OTP sent to your email and your new password.</p>
            </div>

            <div v-if="errorMessage" class="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {{ errorMessage }}
            </div>
            
            <div v-if="successMessage" class="mb-4 bg-green-50 text-green-700 p-3 rounded-lg text-sm">
                {{ successMessage }} Redirecting to login...
            </div>

            <form @submit.prevent="handleResetPassword" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input type="email" v-model="email" required class="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-freshco-green focus:ring-1 focus:ring-freshco-green" placeholder="you@example.com" readonly />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">OTP Code</label>
                    <input type="text" v-model="otpCode" required class="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-freshco-green focus:ring-1 focus:ring-freshco-green text-center tracking-widest text-lg font-bold" placeholder="123456" maxlength="6" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input type="password" v-model="password" required minlength="8" class="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-freshco-green focus:ring-1 focus:ring-freshco-green" placeholder="••••••••" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input type="password" v-model="passwordConfirmation" required minlength="8" class="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-freshco-green focus:ring-1 focus:ring-freshco-green" placeholder="••••••••" />
                </div>
                
                <button type="submit" :disabled="loading || !!successMessage" class="w-full bg-freshco-green text-white py-3.5 rounded-xl font-bold hover:bg-[#0c513e] transition-colors mt-6 disabled:opacity-70">
                    <span v-if="loading">Resetting...</span>
                    <span v-else>Reset Password</span>
                </button>
            </form>

            <div class="mt-8 text-center text-sm text-gray-600">
                <RouterLink to="/forgot-password" class="text-freshco-green font-bold hover:underline">Resend OTP</RouterLink>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>
