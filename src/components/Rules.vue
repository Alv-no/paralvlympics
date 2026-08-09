<script setup lang="ts">
import PLTOverlay from './ui/PLTOverlay.vue'
import { ref } from 'vue'
const showOverlay = ref(false)

const openOverlay = () => {
  showOverlay.value = true
}

const closeOverlay = () => {
  showOverlay.value = false
}
</script>

<template>

  <section id="rules" class="rules-wrapper">

    <div class="rules-content">

      <h2 class="title-lg">Regler</h2>

      <p>
         Nytt for sesongen er at konkurransen er todelt. Det finnes både en constructors
        championship (lag-konkurranse) og en drivers championship (fører-konkurranse).
      </p>
       <button class="button" @click="openOverlay">
         Les mer <vue-feather type="arrow-right" :size="18" /> </button
      >
    </div>

  </section>
   <PLTOverlay :is-open="showOverlay" @close-overlay="closeOverlay"
    >
    <div class="rules-overlay">

      <div class="rules-overlay-title">
         <img
          class="scroll scroll--left"
          src="@/assets/images/rosemaling-scroll.svg"
          alt=""
          aria-hidden="true"
        />
        <h2 class="title-lg">Regler</h2>
         <img
          class="scroll scroll--right"
          src="@/assets/images/rosemaling-scroll.svg"
          alt=""
          aria-hidden="true"
        />
      </div>

      <div class="rules-overlay-content">

        <h3 class="title-md">Lagkonkurranse</h3>

        <p class="paragraph">
           Som de siste årene vil det denne sesongen være en lagkonkurranse, og i Formel-1 er dette
          kjent som Constructors Championship. Hver måned vil det være en ny konkurranse der det
          deles ut poeng basert på hvert lag sin plassering i konkurransen. I motsetning til de
          siste årene hvor det har vært en "winner takes all" i siste konkurranse, så vil det denne
          sesongen kun være sammenlagtresultatet som avgjør hvilket lag som vinner.
        </p>

        <p class="paragraph">
           Hver konkurranse vil plassere lagene fra plass 1 - 6. Poengene for hver konkurranse vil
          bli lagt til sammen og det laget med flest poeng ved sesongens slutt vil være
          konstruktøren som vinner. Poengene deles ut slik:
        </p>

        <ul>

          <li>1. plass: 500 poeng</li>

          <li>2. plass: 450 poeng</li>

          <li>3. plass: 400 poeng</li>

          <li>4. plass: 350 poeng</li>

          <li>5. plass: 300 poeng</li>

          <li>6. plass: 250 poeng</li>

        </ul>

        <h3 class="title-md">Indivduell konkurranse Championship</h3>

        <p class="paragraph">
          Vi beholder den individuelle konkurransen som forrige sesong. I denne konkurransen vil det deles ut poeng basert på hver deltakers
          plassering i konkurransen. Ikke alle måneder har en individuell konkurranse, men de fleste
          vil ha en. Her gjelder det å studere programmet nøye slik at du ikke går glipp av noen
          muligheter til å vinne poeng.
        </p>

        <p class="paragraph">
           Det er kun de ti beste deltakerene i hver konkurranse som vil få poeng. Plassering for
          den individuelle konkurransen vil ofte måles på en annen måte enn i den lagkonkurransen,
          og flere måneder vil det være to helt ulike konkurranser. Poengene deles ut slik:
        </p>

        <div class="points-list">

          <ul>

            <li>1. plass: 25 poeng</li>

            <li>2. plass: 21 poeng</li>

            <li>3. plass: 18 poeng</li>

            <li>4. plass: 15 poeng</li>

            <li>5. plass: 12 poeng</li>

          </ul>

          <ul>

            <li>6. plass: 10 poeng</li>

            <li>7. plass: 8 poeng</li>

            <li>8. plass: 6 poeng</li>

            <li>9. plass: 5 poeng</li>

            <li>10. plass: 4 poeng</li>

          </ul>

        </div>

        <p>For øvrige plasseringer får 2 poeng for deltakelse.</p>

        <h3 class="title-md">Kontakt</h3>

        <p>Ved henvendelser, ta kontakt med en av paralvlympics-diktatorene: </p>

        <div class="contact-list">

          <div class="contact-item">
             <img
              src="https://jltydtjcwbpnbkixfekb.supabase.co/storage/v1/object/public/paralvlympics/images/contestants/Andreas.png"
              alt="Andreas"
            />
            <p>Andreas</p>

          </div>

          <div class="contact-item">
             <img
              src="https://jltydtjcwbpnbkixfekb.supabase.co/storage/v1/object/public/paralvlympics/images/contestants/Olav.png"
              alt="Olav"
            />
            <p>Olav</p>

          </div>

          <div class="contact-item">
             <img
              src="https://jltydtjcwbpnbkixfekb.supabase.co/storage/v1/object/public/paralvlympics/images/contestants/Stian.png"
              alt="Stian"
            />
            <p>Stian</p>

          </div>

        </div>

      </div>
       <button class="button float-center" @click="closeOverlay">Lukk </button>
    </div>
     </PLTOverlay
  >
</template>

<style scoped lang="scss">
.rules-wrapper {
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-top: 96px;
  scroll-margin-top: 80px;
  background-color: $ink-color;
  @include woven-texture(rgba($gold-color, 0.05));
  position: relative;
  color: $parchment-color;
  padding: 32px 0 64px 0;
  // Gilt rules top and bottom turn the band into a framed panel.
  border-top: 2px solid rgba($gold-color, 0.5);
  border-bottom: 2px solid rgba($gold-color, 0.5);
}

.rules-content {
  max-width: 1164px;
  padding: 0 16px;
  margin: 0 auto;
  overflow-y: scroll;

  @include md {
    padding: 0 64px;
  }
}
p {
  margin-top: 12px;
}

.button {
  @extend .title-xs;
  margin-top: 24px;
  color: $gold-color-light;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 4px;
  text-decoration-thickness: 1px;
  background: none;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: color 0.2s ease;
  &:hover {
    color: $parchment-color;
  }

  &.float-center {
    margin: 32px auto 0 auto;
  }
}

.paragraph {
  margin: 12px 0;
}

h3 {
  margin-top: 32px;
  color: $gold-color-light;
}

.rules-overlay {
  background-color: $ink-color;
  @include woven-texture(rgba($gold-color, 0.05));
  color: $parchment-color;
  border: 2px solid rgba($gold-color, 0.5);
  border-radius: $radius-lg;
  padding: 32px;
  width: calc(100vw - 16px);
  height: calc(100vh - 32px);
  max-width: 1000px;
  display: flex;
  flex-direction: column;

  @include md {
    width: calc(100vw - 96px - 96px);
    height: calc(100vh - 48px - 48px);
  }
}

.rules-overlay-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  overflow: hidden;
  flex-shrink: 0;

  h2 {
    flex-shrink: 0;
  }
}

// Gilded markers instead of the default discs.
li::marker {
  color: $gold-color;
}

.rules-overlay-content {
  margin-top: 32px;
  height: 100%;
  overflow-y: scroll;
}

.points-list {
  display: flex;
  flex-direction: column;
  gap: 0px;

  @include md {
    flex-direction: row;
    gap: 24px;

  }
}

.contact-list {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.contact-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  img {
    max-height: 120px;
    width: auto;
    object-fit: contain;
  }

  p {
    text-align: center;
    margin-top: 0;
  }
}

// The vine is drawn with its rose and C-scroll at the right end, so the
// left-hand copy is used as-is and the right-hand copy is flipped. Both
// ornate terminals then face inwards and frame the title.
.scroll {
  flex: 1 1 0;
  min-width: 0;
  max-width: 386px;
  height: auto;
}

.scroll--right {
  transform: scaleX(-1);
}
</style>
