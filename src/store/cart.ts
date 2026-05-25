import { ref, computed } from 'vue'

export interface CartItem {
  id: number
  title: string
  price: number
  imageUrl: string
  quantity: number
}

const isCartOpen = ref(false)
const cartItems = ref<CartItem[]>([])

const toggleCart = () => {
  isCartOpen.value = !isCartOpen.value
}

const addToCart = (product: any, quantity: number = 1) => {
  const existingItem = cartItems.value.find(item => item.id === product.id)
  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    cartItems.value.push({ ...product, quantity })
  }
  isCartOpen.value = true // Open cart on add
}

const removeFromCart = (productId: number) => {
  cartItems.value = cartItems.value.filter(item => item.id !== productId)
}

const updateQuantity = (productId: number, newQuantity: number) => {
  const item = cartItems.value.find(item => item.id === productId)
  if (item) {
    if (newQuantity <= 0) {
      removeFromCart(productId)
    } else {
      item.quantity = newQuantity
    }
  }
}

const cartTotal = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
})

const cartCount = computed(() => {
  return cartItems.value.reduce((count, item) => count + item.quantity, 0)
})

export const useCart = () => {
  return {
    isCartOpen,
    cartItems,
    toggleCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartCount
  }
}
