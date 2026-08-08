<template>
  <div class="product-card">
    <div class="image-wrapper">
      <img :src="product.imageUrl" :alt="product.name" class="product-image" />
    </div>
    <div class="product-info">
      <h3 class="product-title">{{ product.name }}</h3>
      <p class="product-description">{{ product.description }}</p>
      <div v-if="product.price !== undefined" class="product-price">
        ₱{{ product.price.toFixed(2) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '../types'

defineProps<{
  product: Product
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

.product-price {
  font-size: 1.1rem;
  font-weight: 700;
  color: #c86d51;
  align-self: flex-start;
}
</style>