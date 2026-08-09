<script setup lang="ts">
import type { Competition } from '@/types/api-types'
import MarkdownIt from 'markdown-it'
import { computed } from 'vue'

const md = new MarkdownIt()

const { competition } = defineProps<{
  competition: Competition
  index: number
}>()

const imageUrl = computed(() => {
  return competition.imageUrl ? `url(${competition.imageUrl})` : 'none'
})
</script>

<template>

  <div
    :class="{
      'competition-card': true,
      'is-next': competition.isNext,
      'is-finished': competition.isFinished,
    }"
  >

    <div
      :class="{
        'bg-gradient-overlay': true,
        'is-next': competition.isNext,
        'is-finished': competition.isFinished,
      }"
    />

    <div class="competition-content">

      <div class="competition-header">

        <div>

          <p class="title-xs">Runde {{ index + 1 }}</p>

          <h2>{{ competition.name }}</h2>

        </div>

        <div class="next-competition" v-if="competition.isNext">
           Neste konkurranse
          <div class="dot" />

        </div>

      </div>

      <div class="description" v-html="md.render(competition.description || '')" />

      <p class="date">{{ competition.date }}</p>

    </div>

  </div>

</template>

<style scoped lang="scss">
.competition-card {
    position: relative;
    width: 500px;
    height: 230px;
    @include carved-frame;
    background-color: $parchment-color-dark;
    padding: 20px;

    background-image: v-bind(imageUrl);
    background-size: calc(100% - 250px) auto;
    background-position: calc(100% - 24px) center;
    background-repeat: no-repeat;
    // for some reason needed
    display: flex;


    &.is-next {
      height: 232px;
      background-color: $rust-color;
      color: $parchment-color;
      @include carved-frame($rust-color-dark, $gold-color-light);
    }

    &.is-finished {
      height: 232px;
      background-color: $ink-color;
      color: $parchment-color;
      @include carved-frame($ink-color, $gold-color);
    }
  }

  .bg-gradient-overlay {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: $radius-lg;
    background: linear-gradient(90deg, $parchment-color-dark 50%, rgba($parchment-color-dark, 0) 126.14%);

    &.is-next {
      background: linear-gradient(90deg, $rust-color 50%, rgba($rust-color-dark, 0) 127.24%);
    }

    &.is-finished {
      background: linear-gradient(90deg, $ink-color 50%, rgba($ink-color, 0) 127.24%);
    }

  }

  .competition-content {
    @extend .body-md;
    display: flex;
    flex-direction: column;
    z-index: 2;
    gap: 12px;
    height: 100%;
    width: 100%;


    :deep(ul) {
      margin: 0;
      padding-left: 20px;
    }

    .description {
      max-width: 250px;
    }

  }


  .competition-header {
    display: flex;
    justify-content: space-between;
    align-items: start;
    flex-direction: column-reverse;
    gap: 12px;
    @include md {
      flex-direction: row;
      align-items: center;



    }
  }

  .next-competition {
    @extend .label-xs;
    width: fit-content;
    padding: 5px 14px;
    position: relative;
    border-radius: $radius-sm;
    background-color: $parchment-color;
    color: $ink-color;
    box-shadow: inset 0 0 0 1px rgba($gold-color, 0.6);
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: $rust-color;
    position: absolute;
    top: 4px;
    right: 4px;
  }

  .date {
    @extend .title-sm;
margin-top: auto;
  }
</style>
