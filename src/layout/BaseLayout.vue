<script setup lang="ts">
import BaseNavbar from '@/components/BaseNavbar.vue'
</script>

<template>
  <div>
    <BaseNavbar />
    <main class="content">
      <router-view :key="$route.fullPath" />
    </main>
  </div>
</template>

<style scoped lang="scss"></style>
