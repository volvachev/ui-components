<template>
  <div :class="$style.audioPlayer">
    <div :class="$style.playerBody">
      <div :class="$style.playerInfo">
        <div
          :class="$style.playerPic"
          :style="{'background-image': `url(${music.pic})`}">
        </div>
        <div :class="$style.playerButtonContainer">
          <button
            :class="$style.playerControlButton"
            @click="toggle">
            <img :src="activeButton" alt="">
          </button>
        </div>
        <div :class="$style.playerMusicContainer">
          <div :class="$style.playerTitle">{{ music.title || 'Untitled' }}</div>
          <div :class="$style.playerAuthor">{{ music.artist || 'Unknown' }}</div>
        </div>
      </div>
      <controller
        :stat="playStat"
        :volume="audioVolume"
        @dragbegin="onProgressDragBegin"
        @dragend="onProgressDragEnd"
        @dragging="onProgressDragging"
        @setvolume="setAudioVolume"
      />
    </div>
    <audio
      ref="player"
      v-on:ended="ended"
      v-on:canplay="canPlay"
      :src="music.src">
    </audio>
  </div>
</template>

<script>
import Controller from './player-controller';
import pause from '../assets/pause.svg';
import play from '../assets/play.svg';

export default {
  name: 'AudioPlayer',
  props: {
    music: {
      type: Object,
      required: true,
      validator(song) {
        return song.pic && song.src;
      },
    },
    src: {
      type: String,
      default: null,
    },
    pic: {
      type: String,
      default: null,
    },
    autoPlay: {
      type: Boolean,
      default: false,
    },
    ended: {
      type: Function,
      default: () => {},
    },
    canPlay: {
      type: Function,
      default: () => {},
    },
  },
  components: {
    Controller,
  },
  data() {
    return {
      audioVolume: 1,
      isAudioMuted: false,
      isPlaying: false,
      isLoading: false,
      wasPlayingBeforeSeeking: false,
      audioPlayPromise: Promise.resolve(),
      playStat: {
        duration: 0,
        playedTime: 0,
        loadedTime: 0,
      },
    };
  },
  computed: {
    audio() {
      return this.$refs.player;
    },
    activeButton() {
      return this.isPlaying ? pause : play;
    },
  },
  methods: {
    handleLoaded() {
      if (this.audio.readyState >= 2) {
        if (this.autoPlay) {
          this.play();
        }
      } else {
        throw new Error('Failed to load sound file');
      }
    },
    handleAudioVolumeChange() {
      this.audioVolume = this.audio.volume;
      this.isAudioMuted = this.audio.muted;
    },
    handleAudioPlay() {
      this.isPlaying = true;
    },
    handleAudioPause() {
      this.isPlaying = false;
    },
    handleAudioDurationChange() {
      if (this.audio.duration !== 1) {
        this.playStat.duration = this.audio.duration;
      }
    },
    handleAudioTimeUpdate() {
      this.playStat.playedTime = this.audio.currentTime;
    },
    handleAudioSeeking() {
      this.playStat.playedTime = this.audio.currentTime;
    },
    handleAudioSeeked() {
      this.playStat.playedTime = this.audio.currentTime;
    },
    handleAudioProgress() {
      this.playStat.loadedTime = this.audio.buffered.length
        ? this.audio.buffered.end(this.audio.buffered.length - 1)
        : 0;
    },
    handleAudioCanplay() {
      this.isLoading = false;
    },
    handleAudioWaiting() {
      this.isLoading = true;
    },
    handleAudioEnded() {
      this.thenPlay();
    },
    toggle() {
      if (!this.audio.paused) {
        this.pause();
      } else {
        this.play();
      }
    },
    setAudioVolume(val) {
      this.audio.volume = val;
      this.setAudioMuted(val === 0);
    },
    setAudioMuted(val) {
      this.audio.muted = val;
    },
    onProgressDragBegin(val) {
      this.wasPlayingBeforeSeeking = this.isPlaying;
      this.pause();
      this.audio.currentTime = this.audio.duration * val;
    },
    onProgressDragging(val) {
      if (isNaN(this.audio.duration)) {
        this.playStat.playedTime = 0;
      } else {
        this.audio.currentTime = this.audio.duration * val;
      }
    },
    onProgressDragEnd() {
      if (this.wasPlayingBeforeSeeking) {
        this.thenPlay();
      }
    },
    thenPlay() {
      this.$nextTick(() => {
        this.play();
      });
    },
    play() {
      const audioPlayPromise = this.audio.play();

      if (audioPlayPromise) {
        this.audioPlayPromise = new Promise((resolve, reject) => {
          this.rejectPlayPromise = reject;
          audioPlayPromise.then((res) => {
            this.rejectPlayPromise = null;
            resolve(res);
          }).catch((err) => {
            /* eslint-disable no-console */
            console.error(err);
          });
        });
      }
    },
    pause() {
      this.audioPlayPromise
        .then(() => {
          this.audio.pause();
        })
        .catch(() => {
          this.audio.pause();
        });

      if (this.rejectPlayPromise) {
        this.rejectPlayPromise();
        this.rejectPlayPromise = null;
      }
    },
    init() {
      this.audio.addEventListener('timeupdate', this.handleAudioTimeUpdate);
      this.audio.addEventListener('durationchange', this.handleAudioDurationChange);
      this.audio.addEventListener('loadeddata', this.handleLoaded);
      this.audio.addEventListener('volumechange', this.handleAudioVolumeChange);
      this.audio.addEventListener('play', this.handleAudioPlay);
      this.audio.addEventListener('pause', this.handleAudioPause);
      this.audio.addEventListener('abort', this.handleAudioPause);
      this.audio.addEventListener('waiting', this.handleAudioWaiting);
      this.audio.addEventListener('canplay', this.handleAudioCanplay);
      this.audio.addEventListener('progress', this.handleAudioProgress);
      this.audio.addEventListener('seeking', this.handleAudioSeeking);
      this.audio.addEventListener('seeked', this.handleAudioSeeked);
      this.audio.addEventListener('ended', this.handleAudioEnded);
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style scoped module>
  .audioPlayer {
    padding: 8px 20px 6px 10px;
    height: 140px;
    display: flex;
    position: relative;
  }

  .playerBody {
    display: grid;
    grid-template-columns: 0.7fr 1.3fr;
    align-items: center;
    min-width: 100%;
    background-color: #000;
  }

  .playerInfo {
    display: grid;
    grid-template-columns: 1fr 0.7fr 1.3fr;
  }

  .playerPic {
    width: 175px;
    height: 100px;
    background-size: cover;
  }

  .playerControlButton {
    padding: 0;
    width: 65px;
    height: 70px;
    border: none;
    background: transparent;
  }

  .playerControlButton img {
    width: 100%;
    height: 100%;
  }

  .playerButtonContainer {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .playerMusicContainer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  }

  .playerTitle {
    color: #757575;
  }

  .playerAuthor {
    color: #fff;
    margin-top: 15px;
  }

  @media (max-width: 1280px) {
    .playerMusicContainer {
      flex-direction: column-reverse;
    }

    .audioPlayer {
      padding: 0;
    }

    .playerAuthor {
      margin-top: 0;
      margin-bottom: 15px;
    }

    .playerBody {
      grid-template-columns: 0.8fr 1.2fr;
    }

    .playerControlButton {
      width: 50px;
      height: 60px;
    }

    .playerPic {
      width: 140px;
      height: 140px;
    }
  }

  @media (max-width: 768px){
    .audioPlayer {
      flex-direction: column;
    }

    .playerButtonContainer {
      position: absolute;
      top: 30%;
      right: 3%;
    }

    .playerBody,
    .playerInfo {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
