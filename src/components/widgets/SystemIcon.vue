<template>
  <span v-if="iconUrl" class="system-icon" :style="{ maskImage: `url(${iconUrl})`, WebkitMaskImage: `url(${iconUrl})` }" aria-hidden="true"></span>
  <i v-else class="fas fa-gamepad" aria-hidden="true"></i>
</template>

<script>
import arcade from '@/assets/svg/arcade.svg';
import gameboy from '@/assets/svg/gameboy.svg';
import playstation from '@/assets/svg/playstation.svg';
import wonderswan from '@/assets/svg/wonder.svg';

const systemIcons = {
  Arcade: arcade,
  Gameboy: gameboy,
  Playstation: playstation,
  Wonderswan: wonderswan,
};

export default {
  props: {
    playStyle: {
      type: String,
      default: '',
    },
  },
  computed: {
    iconUrl() {
      return systemIcons[this.playStyle] || '';
    },
  },
};
</script>

<style scoped>
.system-icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  vertical-align: -0.125em;
  background-color: currentColor;
  mask-size: contain;
  mask-position: center;
  mask-repeat: no-repeat;
  -webkit-mask-size: contain;
  -webkit-mask-position: center;
  -webkit-mask-repeat: no-repeat;
}
</style>
