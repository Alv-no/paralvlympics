<script setup lang="ts">
  import { computed } from 'vue'
  import PLTSelect from './form/PLTSelect.vue'

  const { items } = defineProps<{ items: string[] }>()

  const selectedTab = defineModel<string | null>('selected-tab', { required: true })

  const selectedTabSpacing = computed(
    () =>
      (selectedTab.value != null ? items.findIndex((i) => i === selectedTab.value) * 200 : 0) + 'px',
  )
  </script>

  <template>
    <div class="tab-wrapper">
      <div class="tab-items">
        <div v-for="item in items" :class="{'tab-item': true, 'selected-tab-item': selectedTab === item}" :key="item" @click="() => (selectedTab = item)">
          {{ item }}
        </div>
      </div>
    </div>
    <PLTSelect
      class="tab-bar-select"
      v-model="selectedTab"
      :options="items.map((i) => ({ id: i, name: i }))"
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
    text-align: center;
    cursor: pointer;
    padding: 0 12px 11px 12px;

    &.selected-tab-item {
      border-bottom: 3px solid $red-color-300;
    }
  }


  .tab-bar-select {
    display: initial;
    @include md {
      display: none;
    }
  }
  </style>
