<script setup lang="ts">
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-vue-next'
</script>

<template>
  <footer class="bg-gray-900 text-white pt-16 pb-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        
        <!-- Brand Info -->
        <div>
          <div class="flex items-center gap-2 mb-6">
            <span class="text-3xl font-black tracking-tight text-freshco-green">inSend</span>
          </div>
          <p class="text-gray-400 text-sm mb-6 leading-relaxed">
            Kepercayaan datang dari Fresh & Healthy Foods. inSend menghadirkan bahan makanan yang fresh setiap hari ke rumah kamu.
          </p>
          <div class="flex gap-4">
            <a href="#" class="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-freshco-green hover:text-white transition-colors"><Facebook class="w-5 h-5"/></a>
            <a href="#" class="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-freshco-green hover:text-white transition-colors"><Twitter class="w-5 h-5"/></a>
            <a href="#" class="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-freshco-green hover:text-white transition-colors"><Instagram class="w-5 h-5"/></a>
            <a href="#" class="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-freshco-green hover:text-white transition-colors"><Youtube class="w-5 h-5"/></a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-lg font-bold mb-6">Kategori Belanja</h3>
          <ul class="space-y-3 text-gray-400 text-sm">
            <li><RouterLink to="/shop?category=Sayuran" class="hover:text-freshco-green transition-colors">Sayuran Segar</RouterLink></li>
            <li><RouterLink to="/shop?category=Buah" class="hover:text-freshco-green transition-colors">Buah-buahan</RouterLink></li>
            <li><RouterLink to="/shop?category=Daging" class="hover:text-freshco-green transition-colors">Daging & Ayam</RouterLink></li>
            <li><RouterLink to="/shop?category=Seafood" class="hover:text-freshco-green transition-colors">Seafood</RouterLink></li>
            <li><RouterLink to="/shop?category=Bumbu" class="hover:text-freshco-green transition-colors">Bumbu Dapur</RouterLink></li>
          </ul>
        </div>

        <!-- Information -->
        <div>
          <h3 class="text-lg font-bold mb-6">Informasi</h3>
          <ul class="space-y-3 text-gray-400 text-sm">
            <li><RouterLink to="/blog" class="hover:text-freshco-green transition-colors">Blog & Artikel</RouterLink></li>
            <li><RouterLink to="/recipes" class="hover:text-freshco-green transition-colors">Resep Masakan</RouterLink></li>
            <li><a href="#" class="hover:text-freshco-green transition-colors">Syarat & Ketentuan</a></li>
            <li><a href="#" class="hover:text-freshco-green transition-colors">Kebijakan Privasi</a></li>
            <li><RouterLink to="/contact" class="hover:text-freshco-green transition-colors">Hubungi Kami</RouterLink></li>
          </ul>
        </div>

        <!-- Contact & Newsletter -->
        <div>
          <h3 class="text-lg font-bold mb-6">Berlangganan Promo</h3>
          <p class="text-gray-400 text-sm mb-4">Dapatkan update terbaru diskon mingguan dan penawaran eksklusif dari kami.</p>
          <form @submit.prevent class="flex">
            <input type="email" placeholder="Email Anda" class="w-full bg-gray-800 border-none rounded-l-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-freshco-green text-white" />
            <button class="bg-freshco-green px-4 py-3 rounded-r-xl font-bold hover:bg-[#0c513e] transition-colors">Kirim</button>
          </form>
        </div>

      </div>

      <div class="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-gray-500 text-sm">© {{ new Date().getFullYear() }} inSend. All rights reserved.</p>
        <div class="flex gap-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/1024px-Visa_Inc._logo.svg.png" class="h-6 bg-white rounded px-2" alt="Visa" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" class="h-6 bg-white rounded px-2" alt="Mastercard" />
        </div>
      </div>
    </div>
  </footer>
</template>
