<script setup lang="ts">
  import { computed } from 'vue'

  const {
    label,
    modelValue,
    emptyOption = false,
    options,
    viewMode = 'column',
    errorMsg = null,
    disabled = false,
    leftIcon,
  } = defineProps<{
    label?: string
    modelValue?: string | null
    emptyOption?: boolean
    placeholder?: string
    options: { name: string; id: string }[]
    viewMode?: 'row' | 'column'
    errorMsg?: string[] | null
    disabled?: boolean
    leftIcon?: string
  }>()
  const emit = defineEmits(['update:modelValue'])

  function handleChange(e: Event) {
    const value = (e.target as HTMLSelectElement).value
    emit('update:modelValue', value !== '' ? value : null)
    }

  const paddingLeft = computed(() => (leftIcon ? '32px' : 'initial'))
  const paddingRight = computed(() => ('32px'))
  </script>

  <template>
    <div class="input-field" :class="{ row: viewMode === 'row' }">
      <label v-if="label">
        {{ label }}
      </label>
      <div :class="['input-wrapper']">
        <olt-icon v-if="leftIcon" id="left-icon" :path="leftIcon" />
        <select
          ref="inputElement"
          :value="modelValue"
          @change="handleChange"
          :disabled="disabled"
          :class="[!modelValue ? 'italic' : '']"
        >
          <option v-if="placeholder" value="" disabled selected>{{ placeholder }}</option>
          <option v-if="emptyOption" :value="null"></option>
          <option v-for="option in options" :key="option.id" :value="option.id">
            {{ option.name }}
          </option>
        </select>
        <vue-feather class="icon" type="chevron-down" />
      </div>
      <p v-for="error in errorMsg" :key="error" class="error-text">{{ error }}</p>
    </div>
  </template>

  <style lang="scss" scoped>
  .input-field {
    display: flex;
    flex-direction: column;
    gap: 8px;

    &.row {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
  }
  select {
    @extend .body-sm;
    height: 40px;
    border-radius: 2px;
    border: 1px solid $black-color;
    background-color: $white-color;
    appearance: none;
    text-indent: 4px;
    width: 100%;
    padding-left: v-bind(paddingLeft);
    padding-right: v-bind(paddingRight);

    .resize-select {
      text-indent: 0px;
    }
    &:disabled {
      background-color: lightgray;
    }
  }

  .input-wrapper {
    position: relative;
    width: 100%;
    max-width: 280px;
  }

  .resize-wrapper {
    width: fit-content;
    max-width: initial;
  }

  label {
    white-space: nowrap;
  }

  .icon {
    position: absolute;
    top: 8px;
    right: 12px;
    pointer-events: none;
  }

  #right-icon {
    @extend .icon;
    right: 6px;
  }

  #left-icon {
    @extend .icon;
    left: 6px;
  }

  .error-text {
    @extend .body-sm;
    color: $red-color-100;
    margin: 0;
  }
  </style>
