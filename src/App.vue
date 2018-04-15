<template>
  <div id="app">
    <AudioPlayer :music="{
        src: 'https://m.muzroom.online/media/music/767/3a/1385297_7673a99c9166534edaf488dd331241a6.mp3',
        pic: 'http://mpggw.com/data/wallpapers/57/WDF_1034002.jpg',
        artist: 'ANY',
        title: 'ANY_TITLE'
      }"
    />
  </div>
</template>

<script>
import AudioPlayer from './components/audio-player';

export default {
  name: 'App',
  components: {
    AudioPlayer,
  },
};
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
</style>
