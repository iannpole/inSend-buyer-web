<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Navbar from '../components/layout/Navbar.vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '../store/auth'

const router = useRouter()
const route = useRoute()
const { setAuth } = useAuth()

const step = ref<'register' | 'verify'>('register')

// Register form
const name = ref('')
const email = ref('')
const password = ref('')
const phone = ref('')
const address = ref('')

// Verify form
const otpCode = ref('')

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

onMounted(() => {
    if (route.query.verify === '1' && route.query.email) {
        step.value = 'verify'
        email.value = route.query.email as string
    }
})

const handleRegister = async () => {
    loading.value = true
    errorMessage.value = ''
    try {
        const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
        await axios.post(`${baseURL}/auth/register`, {
            name: name.value,
            email: email.value,
            password: password.value,
            phone: phone.value,
            address: address.value
        })
        step.value = 'verify'
        successMessage.value = 'Registrasi berhasil! Kode OTP telah dikirim ke email Anda.'
    } catch (error: any) {
        errorMessage.value = error.response?.data?.message || 'Gagal registrasi. Pastikan data benar.'
    } finally {
        loading.value = false
    }
}

const handleVerify = async () => {
    loading.value = true
    errorMessage.value = ''
    try {
        const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
        const response = await axios.post(`${baseURL}/auth/verify-email`, {
            email: email.value,
            otp_code: otpCode.value
        })
        
        if (response.data.token) {
            setAuth(response.data.token, response.data.user)
            router.push('/')
        }
    } catch (error: any) {
        errorMessage.value = error.response?.data?.message || 'Kode OTP tidak valid atau kadaluarsa.'
    } finally {
        loading.value = false
    }
}

const resendOtp = async () => {
    loading.value = true
    errorMessage.value = ''
    successMessage.value = ''
    try {
        const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
        await axios.post(`${baseURL}/auth/resend-otp`, { email: email.value })
        successMessage.value = 'Kode OTP baru telah dikirim.'
    } catch (error: any) {
        errorMessage.value = error.response?.data?.message || 'Gagal mengirim ulang OTP.'
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-plus"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
                </div>
                <h2 class="text-2xl font-black text-gray-900">
                    {{ step === 'register' ? 'Create Account' : 'Verify Email' }}
                </h2>
                <p class="text-gray-500 text-sm mt-1">
                    {{ step === 'register' ? 'Join inSend for fresh groceries.' : 'Enter the OTP sent to your email.' }}
                </p>
            </div>

            <div v-if="errorMessage" class="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {{ errorMessage }}
            </div>
            <div v-if="successMessage" class="mb-4 bg-green-50 text-green-600 p-3 rounded-lg text-sm">
                {{ successMessage }}
            </div>

            <!-- Register Form -->
            <form v-if="step === 'register'" @submit.prevent="handleRegister" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" v-model="name" required class="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-freshco-green focus:ring-1 focus:ring-freshco-green" placeholder="John Doe" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input type="email" v-model="email" required class="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-freshco-green focus:ring-1 focus:ring-freshco-green" placeholder="you@example.com" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input type="password" v-model="password" required class="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-freshco-green focus:ring-1 focus:ring-freshco-green" placeholder="••••••••" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input type="text" v-model="phone" class="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-freshco-green focus:ring-1 focus:ring-freshco-green" placeholder="0812..." />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea v-model="address" class="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-freshco-green focus:ring-1 focus:ring-freshco-green" placeholder="Alamat lengkap..."></textarea>
                </div>

                <button type="submit" :disabled="loading" class="w-full bg-freshco-green text-white py-3.5 rounded-xl font-bold hover:bg-[#0c513e] transition-colors mt-6 disabled:opacity-70">
                    <span v-if="loading">Loading...</span>
                    <span v-else>Register</span>
                </button>
            </form>

            <!-- Verify Form -->
            <form v-else @submit.prevent="handleVerify" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">OTP Code</label>
                    <input type="text" v-model="otpCode" required class="w-full border border-gray-200 rounded-xl p-3 text-center text-xl tracking-widest focus:outline-none focus:border-freshco-green focus:ring-1 focus:ring-freshco-green" placeholder="123456" />
                </div>

                <button type="submit" :disabled="loading" class="w-full bg-freshco-green text-white py-3.5 rounded-xl font-bold hover:bg-[#0c513e] transition-colors mt-6 disabled:opacity-70">
                    <span v-if="loading">Loading...</span>
                    <span v-else>Verify & Login</span>
                </button>

                <div class="text-center mt-4">
                    <button type="button" @click="resendOtp" :disabled="loading" class="text-sm text-freshco-green font-semibold hover:underline">
                        Kirim Ulang OTP
                    </button>
                </div>
            </form>

            <div v-if="step === 'register'" class="mt-8 text-center text-sm text-gray-600">
                Already have an account? 
                <RouterLink to="/login" class="text-freshco-green font-bold hover:underline">Login here</RouterLink>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>
