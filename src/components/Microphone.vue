<template lang="pug">
.microphone(@click="toggleMic")
  .muted(v-if="muted")
  .unmuted(v-else="!muted")
</template>

<script lang="ts">
  import { defineComponent, ref, toRef } from 'vue';
  export default defineComponent({
    props: ['call'],
    setup(props) {
      const currentCall = toRef(props, 'call');
      const muted = ref<boolean>(false);
      const toggleMic = () => {
        muted.value = !muted.value;
        if (muted.value) {
          return currentCall.value?.muteMicrophone();
        }
        currentCall.value?.unmuteMicrophone();
      };
      return {
        muted,
        toggleMic,
      };
    },
  });
</script>

<style scoped>
  .microphone {
    margin: 6px 8px;
    width: 40px;
  }
  .muted {
    width: 40px;
    height: 40px;
    background-image: url('../assets/muted.svg');
  }
  .unmuted {
    width: 40px;
    height: 40px;
    background-image: url('../assets/unmuted.svg');
  }
</style>
