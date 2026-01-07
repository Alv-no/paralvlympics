<script setup lang="ts">
import logo from '@/assets/images/logo-small.svg'
</script>

<template>
  <nav>
    <img :src="logo" alt="Logo" class="logo" />
    <div class="link-container">

    <RouterLink to="#competitions">Program</RouterLink>
    <RouterLink to="#results">Resultattavle</RouterLink>
    <RouterLink to="#rules">Regler</RouterLink>
    <RouterLink to="#contestants">Førere</RouterLink>
  </div>

  </nav>
</template>

<style scoped lang="scss">
img {
  height: 20px;
  width: auto;
}

nav {
  background-color: $black-color;
  color: $white-color;
  display: flex;
  align-items: center;
  padding: 10px 20px;
}

.link-container {
  @extend .title-xs;
  margin-left: 48px;
  display: flex;
  gap: 20px;
  @include md {
    margin-left: 96px;
  }
}

nav a {
  color: $white-color;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 5px;
  &:hover {
    color: $red-color-100;
  }
}
</style>
