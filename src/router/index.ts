import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Shop from '../views/Shop.vue'
import Recipes from '../views/Recipes.vue'
import Blog from '../views/Blog.vue'
import Contact from '../views/Contact.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Profile from '../views/Profile.vue'
import Orders from '../views/Orders.vue'
import Wishlist from '../views/Wishlist.vue'
import ProductDetail from '../views/ProductDetail.vue'
import RecipeDetail from '../views/RecipeDetail.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/shop', name: 'shop', component: Shop },
    { path: '/shop/:id', name: 'product-detail', component: ProductDetail },
    { path: '/recipes', name: 'recipes', component: Recipes },
    { path: '/recipes/:id', name: 'recipe-detail', component: RecipeDetail },
    { path: '/blog', name: 'blog', component: Blog },
    { path: '/contact', name: 'contact', component: Contact },
    { path: '/login', name: 'login', component: Login },
    { path: '/register', name: 'register', component: Register },
    { path: '/profile', name: 'profile', component: Profile },
    { path: '/orders', name: 'orders', component: Orders },
    { path: '/wishlist', name: 'wishlist', component: Wishlist }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router
