import { ref, computed } from 'vue'
import axios from 'axios'
import { useAuth } from './auth'

export interface WishlistItem {
  id: string
  product_id: string
  product: any
  added_at: string
}

const wishlistItems = ref<WishlistItem[]>([])
const isLoading = ref(false)

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

const getHeaders = () => {
  const { token } = useAuth()
  return token.value ? { Authorization: `Bearer ${token.value}` } : {}
}

const fetchWishlist = async () => {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated.value) return

  isLoading.value = true
  try {
    const response = await axios.get(`${baseURL}/wishlist`, {
      headers: getHeaders()
    })
    if (response.data?.status === 'success') {
      wishlistItems.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching wishlist:', error)
  } finally {
    isLoading.value = false
  }
}

const toggleWishlist = async (productId: string) => {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated.value) {
    // Optionally trigger a login modal or redirect here
    alert('Silakan login untuk menambahkan ke wishlist')
    return false
  }

  try {
    const response = await axios.post(`${baseURL}/wishlist`, { product_id: productId }, {
      headers: getHeaders()
    })
    
    if (response.data?.status === 'success') {
      // Refresh wishlist to get updated data
      await fetchWishlist()
      return response.data.wishlisted
    }
  } catch (error) {
    console.error('Error toggling wishlist:', error)
    return false
  }
}

const isInWishlist = computed(() => (productId: string) => {
  return wishlistItems.value.some(item => item.product_id === productId || item.product?.id === productId)
})

const wishlistCount = computed(() => wishlistItems.value.length)

export const useWishlist = () => {
  return {
    wishlistItems,
    isLoading,
    fetchWishlist,
    toggleWishlist,
    isInWishlist,
    wishlistCount
  }
}
