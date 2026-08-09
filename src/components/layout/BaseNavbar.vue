<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isVisible = ref(false)
const activeSection = ref<string>('')

const sections = ['schedule', 'standings', 'rules', 'contestants']

const handleScroll = () => {
  const currentScrollY = window.scrollY

  // Show navbar if scrolled down from top, hide if at top
  if (currentScrollY > 0) {
    isVisible.value = true
  } else {
    isVisible.value = false
    activeSection.value = ''
    return
  }

  // Find which section is currently in view
  const navHeight = 64
  const offset = navHeight + 100 // Add some offset

  for (let i = sections.length - 1; i >= 0; i--) {
    const sectionId = sections[i]
    if (!sectionId) continue

    const section = document.getElementById(sectionId)
    if (section) {
      const rect = section.getBoundingClientRect()
      if (rect.top <= offset) {
        activeSection.value = sectionId
        return
      }
    }
  }

  activeSection.value = ''
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll() // Check initial state
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>

  <nav :class="{ visible: isVisible }">
    <div class="nav-container">

    <div class="link-container">
       <a href="#schedule" :class="{ active: activeSection === 'schedule' }">Program</a> <a
        href="#standings"
        :class="{ active: activeSection === 'standings' }"
        >Resultattavle</a
      > <a href="#rules" :class="{ active: activeSection === 'rules' }">Regler</a> <a
        href="#contestants"
        :class="{ active: activeSection === 'contestants' }"
        >Førere</a
      >
    </div>
  </div>

  </nav>

</template>

<style scoped lang="scss">
.nav-container {
  max-width: 1164px;
  margin: 0 auto;

  display: flex;
  gap: 16px;
  align-items: center;
  padding: 10px 0px;
  height: 64px;
  @include md {
    padding: 0 64px;

  }
}

nav {
  background-color: $black-color;
  color: $white-color;
  position: fixed;
  z-index: 10;
  width: 100%;
  top: 0;
  transform: translateY(-100%);
  transition: transform 0.3s ease-in-out;

  &.visible {
    transform: translateY(0);
  }
}

.link-container {
  @extend .title-xs;
  max-width: 1164px;
  width: 100%;
  margin: 0 auto;
  padding: 0 32px;
  display: none;
  @include md {
    display: flex ;
    gap: 48px;
  }

}

nav a {
  color: $white-color;
  text-decoration: none;
  border-radius: 5px;
  position: relative;
  &:hover {
    color: $red-color-100;
  }
  &.active {
    &::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      right: 0;
      height: 2px;
      background-color: $white-color;
    }
  }
}
</style>

