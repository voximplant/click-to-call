<template lang="pug">
.mic-permission
  .awaiting-stripe
    .sliding
  .mic-image
  .allow-text Please allow access to your microphone for making a call online
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({});
</script>

<style scoped>
  .awaiting-stripe {
    position: absolute;
    top: 0;
    height: 30px;
    width: 100%;
    background-color: #25104f;
  }
  .sliding {
    position: relative;
    height: 100%;
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
    -webkit-box-shadow: #25104f 0 0 30px;
    -webkit-animation: pulse 2.5s infinite;
  }
  @keyframes pulse {
    0% {
      -webkit-box-shadow: #25104f 0 0 10px;
    }
    50% {
      -webkit-box-shadow: #25104f 0 0 50px;
    }
    100% {
      -webkit-box-shadow: #25104f 0 0 10px;
    }
  }
  .allow-text {
    font-family: Roboto;
    margin-top: 30px;
  }
</style>
