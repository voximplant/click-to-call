<template lang="pug">
.blocked-access(v-if="blockedAccess")
.mic-permission
  .awaiting-stripe(:style="{width:windowsize}")
    .sliding
  .mic-image
  .allow-text(v-if="!blockedAccess") Please allow access to your microphone for making a call online
</template>

<script lang="ts">
  import { defineComponent, toRef, ref } from 'vue';
  export default defineComponent({
    props: ['accessDenied'],
    setup(props) {
      const windowsize = ref(window.innerWidth + 'px');
      window.onresize = () => {
        windowsize.value = window.innerWidth + 'px';
      };
      const blockedAccess = toRef(props, 'accessDenied');
      return {
        blockedAccess,
        windowsize,
      };
    },
  });
</script>

<style scoped>
  .awaiting-stripe {
    position: absolute;
    top: 0;
    height: 30px;
    background-color: #662eff;
    overflow-x: hidden;
  }
  .sliding {
    position: relative;
    height: 30px;
    width: 1000px;
    background-image: linear-gradient(to right, transparent, #f2f2f5, transparent);
    -webkit-animation: slide 2.5s infinite;
  }
  @keyframes slide {
    0% {
      right: 100%;
    }
    100% {
      right: -100%;
    }
  }
  .mic-permission {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: #e3e4eb;
  }
  .mic-image {
    width: 160px;
    height: 160px;
    background-image: url('../assets/mic.png');
    border-radius: 50%;
    -webkit-box-shadow: #662eff 0 0 30px;
    -webkit-animation: pulse 2.5s infinite;
  }
  @keyframes pulse {
    0% {
      -webkit-box-shadow: #662eff 0 0 10px;
    }
    50% {
      -webkit-box-shadow: #662eff 0 0 50px;
    }
    100% {
      -webkit-box-shadow: #662eff 0 0 10px;
    }
  }
  .allow-text {
    font-family: Roboto, sans-serif;
    margin-top: 30px;
  }
  .blocked-access {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: black;
    z-index: 12;
    opacity: 0.5;
  }
</style>
