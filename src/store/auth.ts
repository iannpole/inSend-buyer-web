import { ref, computed } from 'vue'

const token = ref<string | null>(localStorage.getItem('auth_token') || null)
const user = ref<any>(JSON.parse(localStorage.getItem('auth_user') || 'null'))

const setAuth = (newToken: string, newUser: any) => {
  token.value = newToken
  user.value = newUser
  localStorage.setItem('auth_token', newToken)
  localStorage.setItem('auth_user', JSON.stringify(newUser))
}

const clearAuth = () => {
  token.value = null
  user.value = null
  localStorage.removeItem('auth_token')
  localStorage.removeItem('auth_user')
}

const isAuthenticated = computed(() => !!token.value)

export const useAuth = () => {
  return {
    token,
    user,
    setAuth,
    clearAuth,
    isAuthenticated
  }
}
