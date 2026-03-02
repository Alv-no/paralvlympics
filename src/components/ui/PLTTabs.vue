<script setup lang="ts">
import PLTSelect from './form/PLTSelect.vue'

export interface TabItem {
  label: string
  logo?: string
}

const { items } = defineProps<{
  items: TabItem[]
}>()

const selectedTab = defineModel<string | null>('selected-tab', { required: true })
</script>

<template>
  <div class="tab-wrapper">
    <div class="tab-items">
      <div
        v-for="item in items"
        :class="['tab-item', { 'selected-tab-item': selectedTab === item.label }]"
        :key="item.label"
        @click="() => (selectedTab = item.label)"
      >
        <img v-if="item.logo" :src="item.logo" :alt="item.label" class="tab-logo" />
        {{ item.label }}
      </div>
    </div>
  </div>
  <PLTSelect
    class="tab-bar-select"
    v-model="selectedTab"
    :options="items.map((i) => ({ id: i.label, name: i.label }))"
  />
</template>

<style lang="scss" scoped>
.tab-wrapper {
  position: relative;
  display: none;
  @include md {
    display: block;
  }
}

.tab-items {
  display: flex;
  gap: 24px;
}

.tab-item {
  @extend .title-xs;
  display: flex;
  align-items: center;
  gap: 8px;
  text-align: center;
  cursor: pointer;
  padding: 0 12px 11px 12px;

  &.selected-tab-item {
    border-bottom: 3px solid $red-color-300;
  }
}

.tab-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.tab-bar-select {
  display: initial;
  @include md {
    display: none;
  }
}
</style>