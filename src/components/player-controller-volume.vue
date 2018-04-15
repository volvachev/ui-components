<template>
  <div :class="$style.playerVolumeContainer">
    <img :src="require('../assets/volume-off.svg')" alt="">
    <v-progress
      :playProgress="volume"
      :classProgress="'volumeProgressBar'"
      @dragbegin="val => $emit('setvolume', val)"
      @dragend="val => $emit('setvolume', val)"
      @dragging="val => $emit('setvolume', val)">
      <span slot="thumb" :class="$style.playerVolumeThumb"></span>
    </v-progress>
    <img :src="currentVolumeIcon" alt="">
  </div>
</template>

<script>
import VProgress from './player-controller-progress';
import volumeUp from '../assets/volume-up.svg';
import volumeDown from '../assets/volume-down.svg';

export default {
  name: 'PlayerControllerVolume',
  props: ['volume', 'muted'],
  components: {
    VProgress,
  },
  computed: {
    currentVolumeIcon() {
      return this.volume >= 1 ? volumeUp : volumeDown;
    },
  },
};
</script>

<style scoped module>
  .playerVolumeContainer {
    display: flex;
    align-items: center;
  }

  .playerVolumeContainer img {
    width: 20px;
    height: 20px;
  }

  .playerVolumeContainer img:last-of-type {
    margin-left: 20px;
  }

  .playerVolumeThumb {
    display: block;
    width: 26px;
    height: 26px;
    background-color: #e6e6e6;
    border-radius: 50%;
    margin-top: -10px;
    position: absolute;
    top: 0;
    right: 5px;
    margin-right: -20px;
  }

  .playerVolumeThumb::after {
    content: '';
    width: 10px;
    height: 10px;
    background-color: #202020;
    display: block;
    border-radius: 50%;
    position: absolute;
    top: 32%;
    left: 32%;
  }

  @media (max-width: 1280px) {
    .playerVolumeContainer {
      display: none;
    }
  }
</style>
