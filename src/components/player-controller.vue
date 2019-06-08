<template>
  <div :class="$style.playerControllerContainer">
    <v-progress
      :playProgress="playProgress"
      :loadProgress="loadProgress"
      @dragbegin="val => $emit('dragbegin', val)"
      @dragend="val => $emit('dragend', val)"
      @dragging="val => $emit('dragging', val)"
    />
    <div :class="$style.playerTime">
      <span class="aplayer-ptime">{{secondToTime(stat.playedTime)}}</span> /
      <span class="aplayer-dtime">{{secondToTime(stat.duration)}}</span>
    </div>
    <volume
      :volume="volume"
      @setvolume="v => $emit('setvolume', v)"
    />
  </div>
</template>

<script>
import Volume from "./player-controller-volume";
import VProgress from "./player-controller-progress";
import { pad0 } from "../utils";

export default {
  name: "PlayerController",
  props: ["stat", "volume", "muted"],
  components: {
    Volume,
    VProgress
  },
  computed: {
    loadProgress() {
      return this.recalculateProgress("loadedTime");
    },
    playProgress() {
      return this.recalculateProgress("playedTime");
    }
  },
  methods: {
    recalculateProgress(nameField) {
      return this.stat.duration === 0
        ? 0
        : this.stat[nameField] / this.stat.duration;
    },
    secondToTime(second) {
      // TODO: check Number.isNaN instead window.isNaN
      if (isNaN(second)) {
        return "00:00";
      }

      const min = Math.trunc(second / 60);
      const sec = Math.trunc(second - min * 60);
      const hours = Math.trunc(min / 60);
      const minAdjust = Math.trunc(
        second / 60 - 60 * Math.trunc(second / 60 / 60)
      );
      return second >= 3600
        ? `${pad0(hours)}:${pad0(minAdjust)}:${pad0(sec)}`
        : `${pad0(min)}:${pad0(sec)}`;
    }
  }
};
</script>

<style scoped module>
.playerControllerContainer {
  display: grid;
  grid-template-columns: 1.5fr 0.7fr 0.8fr;
  align-items: center;
  user-select: none;
}

.playerTime {
  color: #fff;
  margin-left: 25px;
}

@media (max-width: 1280px) {
  .playerControllerContainer {
    grid-template-columns: 1.5fr 0.5fr;
  }
}

@media (max-width: 768px) {
  .playerControllerContainer {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
