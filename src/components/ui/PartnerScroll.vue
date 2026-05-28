<script setup lang="ts">
import { ref } from 'vue'

const partners = ref([
  { name: 'BCA', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg' },
  { name: 'Gojek', url: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Gojek_logo_2022.svg' },
  { name: 'OVO', url: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Logo_ovo_purple.svg' },
  { name: 'Dana', url: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Logo_dana_blue.svg' },
  { name: 'ShopeePay', url: 'https://images.seeklogo.com/logo-png/40/1/shopee-pay-logo-png_seeklogo-406839.png' }
])
</script>

<template>
  <div class="mb-16">
    <div class="flex flex-col items-center justify-center mb-8">
      <h2 class="text-2xl font-black text-gray-900 text-center">Our Partnership</h2>
      <p class="text-sm text-gray-500 mt-1">Metode pembayaran dan pengiriman yang mendukung inSend</p>
    </div>

    <!-- Scrolling Container -->
    <div class="relative w-full overflow-hidden flex items-center bg-white py-8 rounded-3xl border border-gray-100 shadow-sm">
      <!-- Gradient masks for smooth edges -->
      <div class="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none rounded-l-3xl"></div>
      <div class="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none rounded-r-3xl"></div>

      <div class="flex animate-marquee w-max">
        <!-- We duplicate the logos array 3 times to ensure a seamless infinite scroll -->
        <div class="flex flex-shrink-0 gap-16 items-center px-8">
          <img v-for="(partner, i) in partners" :key="`p1-${i}`" :src="partner.url" :alt="partner.name" class="h-12 w-32 object-contain flex-shrink-0 hover:scale-110 transition-transform duration-300 cursor-pointer" />
        </div>
        <div class="flex flex-shrink-0 gap-16 items-center px-8">
          <img v-for="(partner, i) in partners" :key="`p2-${i}`" :src="partner.url" :alt="partner.name" class="h-12 w-32 object-contain flex-shrink-0 hover:scale-110 transition-transform duration-300 cursor-pointer" />
        </div>
        <div class="flex flex-shrink-0 gap-16 items-center px-8">
          <img v-for="(partner, i) in partners" :key="`p3-${i}`" :src="partner.url" :alt="partner.name" class="h-12 w-32 object-contain flex-shrink-0 hover:scale-110 transition-transform duration-300 cursor-pointer" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-marquee {
  animation: marquee 20s linear infinite;
}
.animate-marquee:hover {
  animation-play-state: paused;
}
@keyframes marquee {
  0% { transform: translateX(0%); }
  100% { transform: translateX(-33.3333%); }
}
</style>
