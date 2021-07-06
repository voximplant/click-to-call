<template lang="pug">
.settings
  .close(@click="closeSettings")
  .text Select microphone
  Select(v-model:active="active" @update:active="changeMicrophone" :options="mics.list")
</template>

<script lang="ts">
  import { Select } from '@voximplant/spaceui';
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import * as VoxImplant from 'voximplant-websdk';
  import { AudioParams } from 'voximplant-websdk/Hardware/src';
  import { AudioSourceInfo } from 'voximplant-websdk/Structures';
  export default defineComponent({
    components: { Select },
    emit: ['update:closeSettings'],
    setup(props, { emit }) {
      const mics = reactive({
        list: [{ label: '', value: '' }],
      });
      const active = ref({ label: '', value: '' });
      onMounted(async () => {
        const devices: AudioSourceInfo[] =
          await VoxImplant.Hardware.AudioDeviceManager.get().getInputDevices();
        const selectMics = devices.map((mic: any) => ({ label: mic.name, value: mic.id }));
        mics.list = selectMics;
        active.value = mics.list[0];
      });
      const changeMicrophone = (inputId: any) => {
        const audioParams: AudioParams = { inputId: inputId.value };
        VoxImplant.Hardware.AudioDeviceManager.get().setDefaultAudioSettings(audioParams);
      };
      const closeSettings = () => {
        emit('update:closeSettings');
      };
      return {
        mics,
        active,
        changeMicrophone,
        closeSettings,
      };
    },
  });
</script>

<style scoped>
  .settings {
    position: relative;
    height: 300px;
    margin: 30px auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .close {
    position: absolute;
    right: 5px;
    top: 5px;
    width: 20px;
    height: 20px;
    background-image: url('../assets/ic20-close.svg');
  }
  .text {
    font-family: Roboto;
    margin: 12px 0;
  }
</style>
