<template>

  <div class="portal">

    <div id="portal-elements" class="portal-elements">

      <div id="toast-container" />

    </div>

  </div>

</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
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

