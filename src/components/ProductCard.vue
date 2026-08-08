<template>
  <div class="product-card">
    <div class="image-wrapper">
      <img :src="product.image_url" :alt="product.name" class="product-image" />
    </div>
    <div class="product-info">
      <h3 class="product-title">{{ product.name }}</h3>
      <p class="product-description">{{ product.description }}</p>
      
      <div class="card-footer">
        <div v-if="product.price !== undefined" class="product-price">
          ₱{{ Number(product.price).toFixed(2) }}
        </div>
        <div v-if="isAdmin" class="admin-actions">
          <button @click="$emit('edit', product)" class="btn-icon" title="Edit">✏️</button>
          <button @click="$emit('delete', product.id)" class="btn-icon danger" title="Delete">🗑️</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '../types'

defineProps<{
  product: Product
  isAdmin: boolean
}>()

defineEmits<{
  (e: 'edit', product: Product): void
  (e: 'delete', id: string): void
}>()
</script>

<style scoped>
.product-card {
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid #f0e6df;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.image-wrapper {
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background-color: #f7f2ee;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.product-title {
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  color: #3a2d27;
  font-weight: 600;
}

.product-description {
  margin: 0 0 16px 0;
  font-size: 0.9rem;
  color: #6e5d54;
  line-height: 1.4;
  flex-grow: 1;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.product-price {
  font-size: 1.1rem;
  font-weight: 700;
  color: #c86d51;
}

.admin-actions {
  display: flex;
  gap: 6px;
}

.btn-icon {
  background: #f7f2ee;
  border: 1px solid #e8ded6;
  border-radius: 6px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 0.85rem;
}

.btn-icon.danger:hover {
  background: #ffebee;
  border-color: #ffcdd2;
}
</style>