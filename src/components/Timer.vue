<template lang="pug">
.timer {{currentTime}}
</template>

<script lang="ts">
  import { defineComponent, watch, toRef, ref } from 'vue';
  import { CallState } from '@/enums/CallState';

  export default defineComponent({
    props: ['callState'],
    setup(props) {
      const connection = toRef(props, 'callState');
      watch(connection, (state: string) => {
        if (state === CallState.DISCONNECTED) {
          stopTimer();
        }
      });
      const currentTime = ref<string>('');
      let interval: number;
      const startTimer = () => {
        let time = 0;
        const second = 1;
        currentTime.value = '00:00';
        interval = setInterval(() => {
          time = time + second;
          const minutes = Math.floor((time % 3600) / 60);
          const seconds = time % 60;
          currentTime.value = `${minutes < 10 ? `0${minutes}` : minutes}:${
            seconds < 10 ? `0${seconds}` : seconds
          }`;
        }, 1000);
      };
      startTimer();
      const stopTimer = () => {
        clearInterval(interval);
        currentTime.value = '';
      };
      return {
        currentTime,
      };
    },
  });
</script>

<style scoped>
  .timer {
    width: 40px;
    height: 20px;
    font-family: Roboto, sans-serif;
    font-size: 16px;
    line-height: 20px;
    color: #662eff;
  }
</style>
