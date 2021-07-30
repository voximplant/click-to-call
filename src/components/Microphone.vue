<template lang="pug">
.microphone(@click="toggleMic" tabindex=0)
  svg.mic-key(:width="'44'" :height="'44'")
    use(:href="micImage")
</template>

<script lang="ts">
  import { defineComponent, ref, toRef } from 'vue';
  export default defineComponent({
    props: ['call'],
    emits: ['update:isMuted'],
    setup(props, { emit }) {
      const currentCall = toRef(props, 'call');
      const muted = ref<boolean>(false);
      const micImage = ref<string>('/icons.svg#unmuted');
      const toggleMic = () => {
        muted.value = !muted.value;
        if (muted.value) {
          micImage.value = '/icons.svg#muted';
          emit('update:isMuted', 'Unmute');
          return currentCall.value?.muteMicrophone();
        }
        micImage.value = '/icons.svg#unmuted';
        emit('update:isMuted', 'Mute');
        currentCall.value?.unmuteMicrophone();
      };
      return {
        muted,
        toggleMic,
        micImage,
      };
    },
  });
</script>

<style scoped>
  .microphone {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    cursor: pointer;
  }
  .mic-key {
    --muted-color: #c7c8d9;
    --unmuted-color: #f2f2f5;
  }
  .mic-key:hover {
    --muted-color: #8e90a6;
    --unmuted-color: #ebedf2;
  }
  .microphone:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--sui-blue-500);
  }
</style>
