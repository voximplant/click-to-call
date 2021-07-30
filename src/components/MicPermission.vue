<template lang="pug">
.mic-permission
  .blocked-access(v-if="blockedAccess")
  .info
    .icon
    .text Please allow access to your microphone for making a call online
</template>

<script lang="ts">
  import { defineComponent, toRef } from 'vue';
  export default defineComponent({
    props: ['accessDenied'],
    setup(props) {
      const blockedAccess = toRef(props, 'accessDenied');
      return {
        blockedAccess,
      };
    },
  });
</script>

<style scoped>
  .mic-permission {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: #fafafc;
    & .info {
      width: 299px;
      height: 96px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-direction: column;
    }
    & .icon {
      width: 40px;
      height: 40px;
      background-image: url('../assets/ic24-info-fill.svg');
    }
    & .text {
      font-family: Roboto, sans-serif;
      font-size: 16px;
      line-height: 20px;
      text-align: center;
      color: #1f1c28;
    }
    & .blocked-access {
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: black;
      z-index: 1;
      opacity: 0.5;
    }
  }
</style>
