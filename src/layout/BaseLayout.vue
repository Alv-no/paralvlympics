<script setup lang="ts">
import BaseNavbar from '@/components/layout/BaseNavbar.vue'
</script>

<template>
  <div>
    <BaseNavbar />
    <main class="content">
      <router-view :key="$route.fullPath" />
    </main>
  </div>
</template>

<style scoped lang="scss">
.content {
  max-width: 1164px;
  padding: 0 16px 96px 16px;
  margin: 0 auto;

  @include md {
    padding: 0 64px 96px 64px;

  }
}
</style>
