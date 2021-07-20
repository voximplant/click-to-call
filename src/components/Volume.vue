<template lang="pug">
.volume
  .level(:style="{width:level}")
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref, toRef, watch } from 'vue';
  export default defineComponent({
    props: ['inputId'],
    setup(props) {
      const level = ref<string>('0');
      const inputId = toRef(props, 'inputId');
      const audioContext = new AudioContext();
      let audioLevelNode: AudioWorkletNode;
      let mediaStreamSource: MediaStreamAudioSourceNode;
      watch(inputId, async (state) => {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { deviceId: state.value },
        });
        mediaStreamSource?.disconnect(audioLevelNode);
        mediaStreamSource = audioContext.createMediaStreamSource(
          new MediaStream(stream.getAudioTracks())
        );
        mediaStreamSource.connect(audioLevelNode);
      });
      onMounted(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        await audioContext.audioWorklet.addModule('processor.js');
        audioLevelNode = new AudioWorkletNode(audioContext, 'processor');
        audioLevelNode.port.onmessage = (event) => {
          level.value = Math.ceil(event.data.level * 100) + '%';
        };
        mediaStreamSource = audioContext.createMediaStreamSource(
          new MediaStream(stream.getAudioTracks())
        );

        mediaStreamSource?.connect(audioLevelNode);
        audioLevelNode.connect(audioContext.destination);
        mediaStreamSource?.connect(audioContext.destination);
      });
      return {
        level,
      };
    },
  });
</script>

<style scoped>
  .volume {
    position: relative;
    width: 300px;
    height: 40px;
    border-radius: 4px;
    overflow: hidden;
  }
  .level {
    position: relative;
    height: 100%;
    background-color: #2fbc4f;
  }
</style>
