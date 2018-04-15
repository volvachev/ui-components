<template>
  <div
    :class="$style.playerBarWrap"
    @mousedown="onThumbMouseDown"
    @touchstart="onThumbTouchStart"
    ref="barWrap"
  >
    <div :class="[$style.playerBar, classProgress]">
      <div
        :class="$style.playerLoaded"
        :style="{width: `${loadProgress * 100}%`}">
      </div>
      <div
        :class="$style.playerPlayed"
        :style="{width: `${playProgress * 100}%`}">
        <slot name="thumb" v-if="hasSlotThumb"/>
        <span :class="$style.playerThumb" v-else></span>
      </div>
    </div>
  </div>
</template>

<script>
import { getElementViewLeft } from '../utils';

export default {
  name: 'PlayerControllerProggress',
  props: ['playProgress', 'loadProgress', 'classProgress'],
  computed: {
    hasSlotThumb() {
      return !!this.$slots.thumb;
    },
  },
  methods: {
    onThumbMouseDown(e) {
      this.$emit('dragbegin', this.calculatePersentage(e));
      document.addEventListener('mousemove', this.onDocumentMouseMove);
      document.addEventListener('mouseup', this.onDocumentMouseUp);
    },
    onDocumentMouseMove(e) {
      this.$emit('dragging', this.calculatePersentage(e));
    },
    onDocumentMouseUp(e) {
      document.removeEventListener('mouseup', this.onDocumentMouseUp);
      document.removeEventListener('mousemove', this.onDocumentMouseMove);
      this.$emit('dragend', this.calculatePersentage(e));
    },
    onThumbTouchStart(e) {
      this.$emit('dragbegin', this.calculatePersentage(e));
      document.addEventListener('touchmove', this.onDocumentTouchMove);
      document.addEventListener('touchend', this.onDocumentTouchEnd);
    },
    onDocumentTouchMove({ changedTouches: [touch] }) {
      this.$emit('dragging', this.calculatePersentage(touch));
    },
    onDocumentTouchEnd({ changedTouches: [touch] }) {
      document.removeEventListener('touchend', this.onDocumentTouchEnd);
      document.removeEventListener('touchmove', this.onDocumentTouchMove);
      this.$emit('dragend', this.calculatePersentage(touch));
    },
    calculatePersentage({ clientX }) {
      const { clientWidth } = this.$refs.barWrap;
      let percentage = (clientX - getElementViewLeft(this.$refs.barWrap)) / clientWidth;
      percentage = percentage > 0 ? percentage : 0;
      percentage = percentage < 1 ? percentage : 1;
      return percentage;
    },
  },
};
</script>

<style scoped module>
  .playerBarWrap {
    margin: 0 0 0 5px;
    padding: 4px 0;
    cursor: pointer;
    flex: 1;
  }

  .playerBar {
    position: relative;
    height: 5px;
    width: 100%;
    background: #cdcdcd;
  }

  .playerPlayed {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    height: 5px;
    transition: background-color .3s;
    will-change: width;
  }

  .playerLoaded {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    background: #aaa;
    height: 5px;
    transition: all 0.5s ease;
    will-change: width;
  }

  .playerThumb {
    position: absolute;
    top: 0;
    right: 5px;
    margin-top: -12px;
    margin-right: -10px;
    width: 10px;
    height: 30px;
    transform: scale(.8);
    will-change: transform;
    transition: transform 300ms;
    border-radius: 30%;
    background: #eee;
    cursor: pointer;
    overflow: hidden;
  }

  .playerThumb:hover {
    transform: scale(1);
  }

  @media (max-width: 1280px) {
    .playerPlayed {
      background-color: #00aa4a;
    }

    .playerThumb {
      display: none;
    }

    .playerBar,
    .playerPlayed,
    .playerLoaded {
      height: 10px;
    }
  }

  @media (max-width: 768px) {
    .playerBar {
      background-color: #fff;
    }

    .playerBar,
    .playerPlayed,
    .playerLoaded,
    .playerBarWrap {
      height: 8px;
    }

    .playerBarWrap {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 0;
      margin: 0;
      height: 8px;
    }
  }
</style>
<style scoped>
  .volumeProgressBar {
    background: #595959 !important;
  }

  .volumeProgressBar div:last-of-type {
    background: #e6e6e6 !important;
  }
</style>
