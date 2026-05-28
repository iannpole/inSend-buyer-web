<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import Navbar from '../components/layout/Navbar.vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../store/auth'

const router = useRouter()
const { setAuth } = useAuth()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
    loading.value = true
    errorMessage.value = ''
    try {
        const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
        const response = await axios.post(`${baseURL}/auth/login`, {
            email: email.value,
            password: password.value
        })
        
        if (response.data.token) {
            setAuth(response.data.token, response.data.user)
            router.push('/')
        }
    } catch (error: any) {
        if (error.response?.data?.require_verification) {
            router.push({ path: '/register', query: { email: email.value, verify: '1' } })
        } else {
            errorMessage.value = error.response?.data?.message || 'Gagal login. Periksa kembali email & password Anda.'
        }
    } finally {
        loading.value = false
    }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 font-sans text-gray-800 flex flex-col relative">
    
    <!-- Background Image with #00473B 50% overlay -->
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-leaf"><path d="M11 20A7 7 0 0 1 14 6c5 0 8 4 8 4-4 8-11 11-11 11z"/><path d="M2 15s4-7 12-7"/></svg>
                </div>
                <h2 class="text-2xl font-black text-gray-900">Welcome Back!</h2>
                <p class="text-gray-500 text-sm mt-1">Login to access your inSend account.</p>
            </div>

            <div v-if="errorMessage" class="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {{ errorMessage }}
            </div>

            <form @submit.prevent="handleLogin" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input type="email" v-model="email" required class="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-freshco-green focus:ring-1 focus:ring-freshco-green" placeholder="you@example.com" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input type="password" v-model="password" required class="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-freshco-green focus:ring-1 focus:ring-freshco-green" placeholder="••••••••" />
                </div>
                
                <div class="flex items-center justify-between pt-2">
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" class="rounded text-freshco-green focus:ring-freshco-green" />
                        <span class="text-sm text-gray-600">Remember me</span>
                    </label>
                    <RouterLink to="/forgot-password" class="text-sm text-freshco-green font-semibold hover:underline">Forgot Password?</RouterLink>
                </div>

                <button type="submit" :disabled="loading" class="w-full bg-freshco-green text-white py-3.5 rounded-xl font-bold hover:bg-[#0c513e] transition-colors mt-6 disabled:opacity-70">
                    <span v-if="loading">Loading...</span>
                    <span v-else>Login</span>
                </button>
            </form>

            <div class="mt-8 text-center text-sm text-gray-600">
                Don't have an account? 
                <RouterLink to="/register" class="text-freshco-green font-bold hover:underline">Register here</RouterLink>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>
