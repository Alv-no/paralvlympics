<script setup lang="ts">
import BaseNavbar from '@/components/layout/BaseNavbar.vue'
</script>

<template>
    <div class="portal">
    <div id="portal-elements" class="portal-elements">
      <div id="toast-container" />
    </div>
  </div>
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

.portal {
  top: 0;
  left: 0;
  position: fixed;
  width: calc(100vw - 96px);
  height: calc(100vh - 48px);
  margin: 24px 48px;
  pointer-events: none;
  background: none !important;
  z-index: 500;
}

.portal-elements {
  pointer-events: auto;
}
</style>
