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
  <div :class="{ 'competition-card': true, 'is-next': competition.isNext }">
    <div :class="{ 'bg-gradient-overlay': true, 'is-next': competition.isNext }" />

    <div class="competition-content">


    <div class="competition-header">
      <div>
        <p class="title-xs">Runde {{ index + 1 }}</p>
        <h2>{{ competition.name }}</h2>
      </div>

      <div class="next-competition" v-if="competition.isNext">
        Neste konkurranse
        <div class= "dot" />
      </div>
    </div>

    <div v-html="md.render(competition.description || '')" />
    <p class="date">{{ competition.date }}</p>
  </div>
  </div>

</template>

<style scoped lang="scss">
  .competition-card {
    position: relative;
    width: 500px;
    height: 230px;
    border: 1px solid $black-color;
    padding: 20px;
    border-radius: 20px;

    background-image: v-bind(imageUrl);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    // for some reason needed
    display: flex;


    &.is-next {
      height: 232px;
      border: none;
      background-color: $red-color-300;
      color: $white-color;
    }
  }

  .bg-gradient-overlay {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 20px;
    background: linear-gradient(90deg, #FFF 35.79%, rgba(153, 153, 153, 0.00) 126.14%);

    &.is-next {
      background: linear-gradient(90deg, #D01F1F 35.79%, rgba(106, 16, 16, 0.00) 127.24%);
    }

  }

  .competition-content {
    @extend .label-md;
    display: flex;
    flex-direction: column;
    z-index: 2;
    gap: 12px;
    height: 100%;
    width: 100%;


    :deep(ul) {
      padding-left: 20px;
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
    width: fit-content;
    padding: 4px 12px;
    position: relative;
    border-radius: 8px;
        background-color: $white-color;
        color: $black-color;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: $red-color-300;
    position: absolute;
    top: 4px;
    right: 4px;
  }

  .date {
    @extend .title-sm;
margin-top: auto;
  }
</style>
