<template>
  <div class="app-container">
    <!-- Showcase Header -->
    <header class="catalog-header">
      <div class="top-nav">
        <!-- Generic Profile Icon Button -->
        <button @click="handleProfileClick" class="profile-btn" :title="isAdmin ? 'Logout' : 'Admin Login'">
          <svg class="avatar-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
          </svg>
        </button>
      </div>

      <div class="brand-container">
        <div class="logo-icon">✨</div>
        <h1 class="brand-name">Crafted Charm</h1>
      </div>
      <p class="tagline">Designed by Hand, Made from the Heart</p>

      <div v-if="isAdmin" class="admin-banner">
        <span>Admin Mode Active</span>
        <button @click="openAddModal" class="btn-primary">+ Add New Product</button>
      </div>
    </header>

    <!-- Catalog Grid -->
    <main class="catalog-main">
      <div v-if="loading" class="loading-state">Loading product catalog...</div>
      <div v-else-if="products.length === 0" class="empty-state">No products found in the catalog.</div>
      <div v-else class="catalog-grid">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
          :is-admin="isAdmin"
          @edit="openEditModal"
          @delete="handleDeleteProduct"
        />
      </div>
    </main>

    <!-- Footer -->
    <footer class="catalog-footer">
      <p>© Crafted Charm — Product Catalog Showcase</p>
    </footer>

    <!-- Admin Login Modal -->
    <div v-if="showLoginModal" class="modal-backdrop">
      <div class="modal-card">
        <h3>Admin Login</h3>
        <p class="modal-sub">Sign in to edit and manage product catalog items.</p>
        
        <form @submit.prevent="handleLogin">
          <label>Email / Username</label>
          <input type="email" v-model="loginForm.email" required placeholder="admin@craftedcharm.com" />

          <label>Password</label>
          <input type="password" v-model="loginForm.password" required placeholder="••••••••" />

          <p v-if="loginError" class="error-msg">{{ loginError }}</p>

          <div class="modal-actions">
            <button type="button" @click="showLoginModal = false" class="btn-secondary">Cancel</button>
            <button type="submit" class="btn-primary" :disabled="authLoading">
              {{ authLoading ? 'Signing in...' : 'Login' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add / Edit Product Modal -->
    <div v-if="showProductModal" class="modal-backdrop">
      <div class="modal-card">
        <h3>{{ editingProduct ? 'Edit Product' : 'Add New Product' }}</h3>
        
        <form @submit.prevent="handleProductSubmit">
          <label>Product Name</label>
          <input type="text" v-model="productForm.name" required placeholder="e.g. Flower Charm Keychain" />

          <label>Description</label>
          <textarea v-model="productForm.description" rows="3" required placeholder="Describe materials, details..."></textarea>

          <label>Price (₱)</label>
          <input type="number" step="0.01" v-model.number="productForm.price" placeholder="150.00" />

          <label>Image URL</label>
          <input type="url" v-model="productForm.image_url" required placeholder="https://..." />

          <div class="modal-actions">
            <button type="button" @click="showProductModal = false" class="btn-secondary">Cancel</button>
            <button type="submit" class="btn-primary" :disabled="savingProduct">
              {{ savingProduct ? 'Saving...' : 'Save Product' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ProductCard from './components/ProductCard.vue'
import { supabase } from './lib/supabase'
import type { Product } from './types'

const products = ref<Product[]>([])
const loading = ref<boolean>(true)
const isAdmin = ref<boolean>(false)

// Modals State
const showLoginModal = ref<boolean>(false)
const loginForm = ref({ email: '', password: '' })
const loginError = ref<string>('')
const authLoading = ref<boolean>(false)

const showProductModal = ref<boolean>(false)
const editingProduct = ref<Product | null>(null)
const productForm = ref({ name: '', description: '', price: undefined as number | undefined, image_url: '' })
const savingProduct = ref<boolean>(false)

onMounted(async () => {
  await checkUserSession()
  await fetchProducts()
})

async function checkUserSession() {
  const { data: { session } } = await supabase.auth.getSession()
  isAdmin.value = !!session
}

async function fetchProducts() {
  loading.value = true
  const { data, error } = await supabase
    .from('crafted_charm_products')
    .select('*')
    .order('created_at', { ascending: true })

  if (!error && data) {
    products.value = data as Product[]
  }
  loading.value = false
}

function handleProfileClick() {
  if (isAdmin.value) {
    if (confirm('Logout from admin mode?')) {
      supabase.auth.signOut()
      isAdmin.value = false
    }
  } else {
    loginError.value = ''
    loginForm.value = { email: '', password: '' }
    showLoginModal.value = true
  }
}

async function handleLogin() {
  authLoading.value = true
  loginError.value = ''

  const { error } = await supabase.auth.signInWithPassword({
    email: loginForm.value.email,
    password: loginForm.value.password
  })

  if (error) {
    loginError.value = error.message
  } else {
    isAdmin.value = true
    showLoginModal.value = false
  }
  authLoading.value = false
}

function openAddModal() {
  editingProduct.value = null
  productForm.value = { name: '', description: '', price: undefined, image_url: '' }
  showProductModal.value = true
}

function openEditModal(product: Product) {
  editingProduct.value = product
  productForm.value = {
    name: product.name,
    description: product.description,
    price: product.price,
    image_url: product.image_url
  }
  showProductModal.value = true
}

async function handleProductSubmit() {
  savingProduct.value = true
  
  if (editingProduct.value) {
    const { error } = await supabase
      .from('crafted_charm_products')
      .update({
        name: productForm.value.name,
        description: productForm.value.description,
        price: productForm.value.price,
        image_url: productForm.value.image_url
      })
      .eq('id', editingProduct.value.id)

    if (!error) await fetchProducts()
  } else {
    const { error } = await supabase
      .from('crafted_charm_products')
      .insert([{
        name: productForm.value.name,
        description: productForm.value.description,
        price: productForm.value.price,
        image_url: productForm.value.image_url
      }])

    if (!error) await fetchProducts()
  }

  savingProduct.value = false
  showProductModal.value = false
}

async function handleDeleteProduct(id: string) {
  if (confirm('Are you sure you want to delete this product?')) {
    const { error } = await supabase
      .from('crafted_charm_products')
      .delete()
      .eq('id', id)

    if (!error) await fetchProducts()
  }
}
</script>

<style>
:root {
  --bg-color: #faf6f0;
  --text-main: #3a2d27;
  --accent-color: #c86d51;
  --font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

body {
  margin: 0;
  background-color: var(--bg-color);
  color: var(--text-main);
  font-family: var(--font-family);
  -webkit-font-smoothing: antialiased;
}

.app-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px 16px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.catalog-header {
  position: relative;
  text-align: center;
  margin-bottom: 36px;
  padding: 24px 16px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
  border: 1px solid #f0e6df;
}

.top-nav {
  position: absolute;
  top: 16px;
  right: 16px;
}

.profile-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #a8988e;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.profile-btn:hover {
  color: var(--accent-color);
}

.avatar-icon {
  width: 32px;
  height: 32px;
}

.brand-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 6px;
}

.logo-icon {
  font-size: 1.8rem;
}

.brand-name {
  margin: 0;
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: var(--text-main);
}

.tagline {
  margin: 0;
  font-size: 0.95rem;
  font-style: italic;
  color: var(--accent-color);
  font-weight: 500;
}

.admin-banner {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed #e8ded6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--accent-color);
}

.catalog-main {
  flex-grow: 1;
}

.catalog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.loading-state, .empty-state {
  text-align: center;
  color: #8c7b72;
  margin-top: 48px;
}

.catalog-footer {
  text-align: center;
  margin-top: 48px;
  padding-top: 16px;
  font-size: 0.85rem;
  color: #9e8c82;
  border-top: 1px solid #e8ded6;
}

/* Modals & Forms */
.modal-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  z-index: 100;
}

.modal-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.modal-card h3 {
  margin-top: 0;
  margin-bottom: 4px;
}

.modal-sub {
  font-size: 0.85rem;
  color: #7a6a61;
  margin-top: 0;
  margin-bottom: 16px;
}

label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  margin-top: 12px;
  margin-bottom: 4px;
  color: #52433b;
}

input, textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d8ccc4;
  border-radius: 6px;
  box-sizing: border-box;
  font-family: inherit;
}

.error-msg {
  color: #d32f2f;
  font-size: 0.8rem;
  margin-top: 8px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 20px;
}

.btn-primary {
  background-color: var(--accent-color);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.btn-secondary {
  background-color: #f0e6df;
  color: var(--text-main);
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}
</style>