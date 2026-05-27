<script setup lang="ts">
import Navbar from '../components/layout/Navbar.vue'
import { MapPin, Phone, Mail, Clock } from 'lucide-vue-next'
</script>

<template>
  <div class="min-h-screen bg-gray-50 pb-20 font-sans text-gray-800">
    <Navbar />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      
      <div class="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-12">
        <!-- Contact Info -->
        <div class="flex-1">
            <h1 class="text-3xl font-black text-gray-900 mb-4">Hubungi Kami</h1>
            <p class="text-gray-500 mb-8">Punya pertanyaan, keluhan, atau saran? Jangan ragu untuk menghubungi tim inSend. Kami siap membantu Anda.</p>
            
            <div class="space-y-6">
                <div class="flex items-start gap-4">
                    <div class="p-3 bg-[#E8F3EF] text-freshco-green rounded-xl">
                        <MapPin class="w-6 h-6" />
                    </div>
                    <div>
                        <h3 class="font-bold text-gray-900">Alamat Kantor</h3>
                        <p class="text-sm text-gray-600 mt-1">Jl. Tegallega No 40. tegallega,kecamatan Bogor Tengah,Kota Bogor,Jawa Barat 16129</p>
                    </div>
                </div>
                
                <div class="flex items-start gap-4">
                    <div class="p-3 bg-[#E8F3EF] text-freshco-green rounded-xl">
                        <Phone class="w-6 h-6" />
                    </div>
                    <div>
                        <h3 class="font-bold text-gray-900">Telepon & WhatsApp</h3>
                        <p class="text-sm text-gray-600 mt-1">+62 895-4024-89447</p>
                    </div>
                </div>

                <div class="flex items-start gap-4">
                    <div class="p-3 bg-[#E8F3EF] text-freshco-green rounded-xl">
                        <Mail class="w-6 h-6" />
                    </div>
                    <div>
                        <h3 class="font-bold text-gray-900">Email</h3>
                        <p class="text-sm text-gray-600 mt-1">support@insend.app</p>
                    </div>
                </div>

                <div class="flex items-start gap-4">
                    <div class="p-3 bg-[#E8F3EF] text-freshco-green rounded-xl">
                        <Clock class="w-6 h-6" />
                    </div>
                    <div>
                        <h3 class="font-bold text-gray-900">Jam Operasional</h3>
                        <p class="text-sm text-gray-600 mt-1">Senin - Minggu: 06:00 - 22:00 WIB</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Contact Form -->
        <div class="flex-1 bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <h3 class="text-xl font-bold text-gray-900 mb-6">Kirim Pesan</h3>
            <form class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                    <input type="text" class="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-freshco-green focus:ring-1 focus:ring-freshco-green bg-white" placeholder="Masukkan nama Anda" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" class="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-freshco-green focus:ring-1 focus:ring-freshco-green bg-white" placeholder="you@example.com" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Pesan</label>
                    <textarea rows="4" class="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-freshco-green focus:ring-1 focus:ring-freshco-green bg-white" placeholder="Tuliskan pesan atau pertanyaan Anda..."></textarea>
                </div>
                <button type="submit" class="w-full bg-freshco-green text-white py-3 rounded-xl font-bold hover:bg-[#0c513e] transition-colors mt-2">
                    Kirim Pesan
                </button>
            </form>
        </div>
      </div>
    </div>
  </div>
</template>
