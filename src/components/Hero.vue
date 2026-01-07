<script setup lang="ts">
import logo from '@/assets/images/logo-small.svg'
</script>

<template>
  <div class="push-content" />
  <div class="hero-wrapper">
    <div class="hero-mesh" />
    <div class="hero-title">
      <img :src="logo" alt="Logo" class="logo" />

    <h1>Paralvlympics</h1>
  </div>

  </div>
</template>

<style scoped lang="scss">
  .push-content {
    height: 80vh;
  }


.hero-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  background: linear-gradient(90deg, #D01F1F 0%, #F37373 74.52%);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 80vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-mesh {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('@/assets/images/dot-mesh.svg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

.hero-title {
  display: flex;
  align-items: center;
  gap: 12px;
  color: $white-color;
  z-index: 2;


  > h1 {
    font-size: 64px;

  }
}

.logo {
  height: 64px;
  width: auto;
}
</style>
