<template>
  <div class="app-container">
    <!-- Showcase Header -->
    <header class="catalog-header">
      <div class="brand-container">
        <div class="logo-icon">✨</div>
        <h1 class="brand-name">Crafted Charm</h1>
      </div>
      <p class="tagline">Designed by Hand, Made from the Heart</p>
    </header>

    <!-- Catalog Grid -->
    <main class="catalog-main">
      <div class="catalog-grid">
        <ProductCard
          v-for="product in productsList"
          :key="product.id"
          :product="product"
        />
      </div>
    </main>

    <!-- Footer -->
    <footer class="catalog-footer">
      <p>© Crafted Charm — Product Catalog Showcase</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProductCard from './components/ProductCard.vue'
import { products } from './data/products'
import type { Product } from './types'

const productsList = ref<Product[]>(products)
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

/* Header Styling */
.catalog-header {
  text-align: center;
  margin-bottom: 36px;
  padding: 24px 16px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
  border: 1px solid #f0e6df;
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

/* Grid Layout */
.catalog-main {
  flex-grow: 1;
}

.catalog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

/* Footer Styling */
.catalog-footer {
  text-align: center;
  margin-top: 48px;
  padding-top: 16px;
  font-size: 0.85rem;
  color: #9e8c82;
  border-top: 1px solid #e8ded6;
}
</style>