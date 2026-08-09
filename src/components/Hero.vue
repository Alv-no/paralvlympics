<script setup lang="ts">
import heroImage from '@/assets/images/hero_image.png'
</script>

<template>

  <div class="push-content" />

  <div class="hero-wrapper">
     <img :src="heroImage" alt="Illustrasjonsbilde, Paralvlympics" class="hero-image" />
  </div>

</template>

<style scoped lang="scss">
.push-content,
.hero-wrapper {
  // The image is a 2:1 banner, so keep the crop gentle on narrow screens.
  height: 65vw;
  @include md {
    height: 80vh;
  }
}

.hero-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  overflow: hidden;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}
</style>

