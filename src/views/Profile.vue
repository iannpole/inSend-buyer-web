<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Navbar from '../components/layout/Navbar.vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../store/auth'

const router = useRouter()
const { token, user, isAuthenticated, clearAuth, setAuth } = useAuth()
const loading = ref(false)
const message = ref('')

const editForm = ref({
    name: user.value?.name || '',
    phone: user.value?.phone || '',
    address: user.value?.address || ''
})

onMounted(() => {
    if (!isAuthenticated.value) {
        router.push('/login')
    }
})

const handleUpdate = async () => {
    loading.value = true
    message.value = ''
    try {
        const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
        const response = await axios.put(`${baseURL}/profile`, editForm.value, {
            headers: { Authorization: `Bearer ${token.value}` }
        })
        setAuth(token.value as string, response.data.data) // Update user data
        message.value = 'Profil berhasil diupdate.'
    } catch (error: any) {
        message.value = 'Gagal mengupdate profil.'
    } finally {
        loading.value = false
    }
}

const handleLogout = async () => {
    try {
        const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
        await axios.post(`${baseURL}/auth/logout`, {}, {
            headers: { Authorization: `Bearer ${token.value}` }
        })
    } catch (e) {} // Abaikan error logout dari server
    clearAuth()
    router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 pb-20 font-sans text-gray-800">
    <Navbar />

    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      
      <div class="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between mb-8 pb-6 border-b border-gray-50">
            <div class="flex items-center gap-4">
                <div class="w-16 h-16 bg-freshco-green text-white rounded-full flex items-center justify-center text-2xl font-bold">
                    {{ user?.name?.charAt(0) || 'U' }}
                </div>
                <div>
                    <h1 class="text-2xl font-black text-gray-900">{{ user?.name }}</h1>
                    <p class="text-gray-500">{{ user?.email }}</p>
                </div>
            </div>
            <button @click="handleLogout" class="text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg font-bold transition-colors">
                Logout
            </button>
        </div>

        <div v-if="message" class="mb-6 p-3 rounded-lg text-sm" :class="message.includes('Gagal') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'">
            {{ message }}
        </div>

        <form @submit.prevent="handleUpdate" class="space-y-5 max-w-lg">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" v-model="editForm.name" required class="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-freshco-green focus:ring-1 focus:ring-freshco-green" />
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input type="text" v-model="editForm.phone" class="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-freshco-green focus:ring-1 focus:ring-freshco-green" />
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea v-model="editForm.address" rows="3" class="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-freshco-green focus:ring-1 focus:ring-freshco-green"></textarea>
            </div>

            <button type="submit" :disabled="loading" class="bg-freshco-green text-white py-3 px-8 rounded-xl font-bold hover:bg-[#0c513e] transition-colors disabled:opacity-70">
                <span v-if="loading">Menyimpan...</span>
                <span v-else>Simpan Perubahan</span>
            </button>
        </form>
      </div>
    </div>
  </div>
</template>
