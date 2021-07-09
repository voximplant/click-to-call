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
        if (state === CallState.CONNECTED) {
          startTimer();
        } else if (state === CallState.DISCONNECTED) {
          stopTimer();
        }
      });
      const currentTime = ref<string>('');
      let interval: number;
      const startTimer = () => {
        let time = 0;
        const second = 1;
        interval = setInterval(() => {
          time = time + second;
          const hours = Math.floor(time / 3600);
          const minutes = Math.floor((time % 3600) / 60);
          const seconds = time % 60;
          currentTime.value = `${hours < 10 ? `0${hours}` : hours}:${
            minutes < 10 ? `0${minutes}` : minutes
          }:${seconds < 10 ? `0${seconds}` : seconds}`;
        }, 1000);
      };

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
    width: 50px;
    height: 30px;
    margin: 12px auto;
  }
</style>
