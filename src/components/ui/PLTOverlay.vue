<template>
  <Teleport to="#portal-elements" :disabled="disableTeleport">
    <transition name="fade-1">
      <div
        v-if="isOpen"
        class="overlay-bg"
        :style="{
          backgroundColor: backgroundColor,
        }"
        @click="$emit('closeOverlay')"
      ></div>
    </transition>

    <transition name="fade-2">
      <!-- styles defined inline so they work with Teleport -->
      <div
        v-if="isOpen"
        class="overlay"
        :style="{
          position,
          left,
          top,
          right,
          bottom,
          transform: centerOverlay,
        }"
      >
        <slot />
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
const {
  isOpen,
  left = '50%',
  top = '50%',
  right,
  bottom,
  dimBackground = true,
  position = 'fixed',
  stopDocumentScroll = true,
  disableTeleport = false,
} = defineProps<{
  isOpen: boolean
  left?: string
  top?: string
  right?: string
  bottom?: string
  dimBackground?: boolean
  position?: 'fixed' | 'absolute' | 'relative' | 'static' | 'sticky'
  stopDocumentScroll?: boolean
  disableTeleport?: boolean
}>()

const centerOverlay = computed(() =>
  left == '50%' && top == '50%' ? 'translate(-50%, -50%)' : 'initial',
)

const backgroundColor = computed(() => (dimBackground ? 'rgba(0, 0, 0, 0.3)' : 'transparent'))

defineEmits(['closeOverlay'])

watch(
  () => isOpen,
  (open) => {
    if (stopDocumentScroll) {
      document.body.style.overflow = open ? 'hidden' : ''
    }
  },
)
</script>

<style scoped lang="scss">
.overlay {
  background-color: $white-color;
  z-index: 200;
  opacity: 1;
}

.overlay-bg {
  position: fixed;
  inset: 0;
  opacity: 0.5;
  z-index: 199;
}

.fade-1-enter-active,
.fade-2-enter-active {
  transition: opacity 0.3s ease;
}
.fade-1-enter-from,
.fade-1-leave-to,
.fade-2-enter-from,
.fade-2-leave-to {
  opacity: 0;
}
.fade-1-enter-to,
.fade-1-leave-from {
  opacity: 0.5;
}

.fade-2-enter-to,
.fade-2-leave-from {
  opacity: 1;
}
</style>
