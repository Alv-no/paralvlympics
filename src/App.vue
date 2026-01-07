<script setup lang="ts"></script>

<template>
<router-view />
</template>

// reference variable in globals.scss to ensure it is processed
<style lang="scss">
  .test {
    color: $black-color;
  }
</style>
