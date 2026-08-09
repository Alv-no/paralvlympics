<script setup lang="ts"></script>

<template> <router-view /> </template>
 <!--
  The only unscoped style block in the app, so all global element styling lives
  here. Tokens and mixins come from globals.scss, which Vite prepends to every
  SCSS block (see vite.config.ts).
-->
<style lang="scss">
* {
    box-sizing: border-box;
  }

  h1, h2, h3, h4, h5, h6, p {
    margin: 0;
    padding: 0;
  }

  html {
    font-family: 'EB Garamond', Georgia, serif;
    font-weight: 400;
    font-size: 16px;
    scrollbar-gutter: stable;
    scroll-behavior: smooth;
    overflow-x: hidden;
  }

  body {
    color: $ink-color;
    background-color: $parchment-color;
    font-family: 'EB Garamond', Georgia, serif;
    font-weight: 400;
    font-size: 1.0625rem;
    margin: 0;
    width: 100%;

    // A faint laid-paper grain so the parchment reads as paper rather than beige.
    background-image:
      repeating-linear-gradient(
        90deg,
        rgba($stone-color, 0.07) 0 1px,
        transparent 1px 4px
      );
  }

  ::selection {
    background-color: rgba($gold-color, 0.35);
  }
</style>

