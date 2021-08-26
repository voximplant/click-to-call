<template lang="pug">
.volume
    svg(:style="volumeLevelColor" width='248' height='4')
      use(:href="'/icons.svg#volume-indicator'" width='248' height='4')
</template>

<script lang="ts">
  import { defineComponent, onMounted, onUnmounted, reactive, ref, toRef, watch } from 'vue';
  export default defineComponent({
    props: ['inputId'],
    setup(props) {
      const level = ref<string>('0');
      const inputId = toRef(props, 'inputId');
      const audioContext = new AudioContext();
      let audioLevelNode: AudioWorkletNode;
      let mediaStreamSource: MediaStreamAudioSourceNode;
      const volumeLevelColor = reactive({
        '--volume-level-1': '#EBEDF2',
        '--volume-level-2': '#EBEDF2',
        '--volume-level-3': '#EBEDF2',
        '--volume-level-4': '#EBEDF2',
        '--volume-level-5': '#EBEDF2',
        '--volume-level-6': '#EBEDF2',
      });
      onUnmounted(() => {
        audioContext.suspend();
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
        watch(level, (state) => {
          if (state === '1%') {
            volumeLevelColor['--volume-level-1'] = '#2FBC4F';
            volumeLevelColor['--volume-level-2'] = '#EBEDF2';
            volumeLevelColor['--volume-level-3'] = '#EBEDF2';
            volumeLevelColor['--volume-level-4'] = '#EBEDF2';
            volumeLevelColor['--volume-level-5'] = '#EBEDF2';
            volumeLevelColor['--volume-level-6'] = '#EBEDF2';
          } else if (state > '1%' && state <= '20%') {
            volumeLevelColor['--volume-level-1'] = '#2FBC4F';
            volumeLevelColor['--volume-level-2'] = '#2FBC4F';
            volumeLevelColor['--volume-level-3'] = '#EBEDF2';
            volumeLevelColor['--volume-level-4'] = '#EBEDF2';
            volumeLevelColor['--volume-level-5'] = '#EBEDF2';
            volumeLevelColor['--volume-level-6'] = '#EBEDF2';
          } else if (state > '20%' && state <= '40%') {
            volumeLevelColor['--volume-level-1'] = '#2FBC4F';
            volumeLevelColor['--volume-level-2'] = '#2FBC4F';
            volumeLevelColor['--volume-level-3'] = '#2FBC4F';
            volumeLevelColor['--volume-level-4'] = '#EBEDF2';
            volumeLevelColor['--volume-level-5'] = '#EBEDF2';
            volumeLevelColor['--volume-level-6'] = '#EBEDF2';
          } else if (state > '40%' && state <= '60%') {
            volumeLevelColor['--volume-level-1'] = '#2FBC4F';
            volumeLevelColor['--volume-level-2'] = '#2FBC4F';
            volumeLevelColor['--volume-level-3'] = '#2FBC4F';
            volumeLevelColor['--volume-level-4'] = '#2FBC4F';
            volumeLevelColor['--volume-level-5'] = '#EBEDF2';
            volumeLevelColor['--volume-level-6'] = '#EBEDF2';
          } else if (state > '60%' && state <= '80%') {
            volumeLevelColor['--volume-level-1'] = '#2FBC4F';
            volumeLevelColor['--volume-level-2'] = '#2FBC4F';
            volumeLevelColor['--volume-level-3'] = '#2FBC4F';
            volumeLevelColor['--volume-level-4'] = '#2FBC4F';
            volumeLevelColor['--volume-level-5'] = '#2FBC4F';
            volumeLevelColor['--volume-level-6'] = '#EBEDF2';
          } else if (state > '80%') {
            volumeLevelColor['--volume-level-1'] = '#2FBC4F';
            volumeLevelColor['--volume-level-2'] = '#2FBC4F';
            volumeLevelColor['--volume-level-3'] = '#2FBC4F';
            volumeLevelColor['--volume-level-4'] = '#2FBC4F';
            volumeLevelColor['--volume-level-5'] = '#2FBC4F';
            volumeLevelColor['--volume-level-6'] = '#2FBC4F';
          }
        });
      });
      return {
        volumeLevelColor,
      };
    },
  });
</script>

<style scoped>
  .volume {
    position: relative;
    width: 248px;
    height: 4px;
    border-radius: 4px;
  }
</style>
