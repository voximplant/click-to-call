<template lang="pug">
teleport(to=".call")
  .settings
    .close(@click="closeSettings")
    .text Select microphone
    Select(v-model:active="active" @update:active="changeMicrophone" :options="mics.list")
</template>

<script lang="ts">
  import { Select } from '@voximplant/spaceui';
  import { defineComponent, onMounted, reactive, ref, toRef } from 'vue';
  import * as VoxImplant from 'voximplant-websdk';
  import { AudioParams } from 'voximplant-websdk/Hardware/src';
  import { AudioSourceInfo } from 'voximplant-websdk/Structures';
  export default defineComponent({
    components: { Select },
    props: ['call'],
    emit: ['update:closeSettings'],
    setup(props, { emit }) {
      const call = toRef(props, 'call');
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
        if (call.value) {
          VoxImplant.Hardware.AudioDeviceManager.get().setCallAudioSettings(
            call.value,
            audioParams
          );
        }
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
    background-color: #ffffff;
    position: absolute;
    width: 300px;
    margin-top: 60px;
    padding: 16px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 2px 8px rgba(40, 41, 61, 0.04), 0 16px 24px rgba(96, 97, 112, 0.16);
    border-radius: 8px;
    box-sizing: border-box;
    z-index: 2;
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
    font-family: Roboto, sans-serif;
    margin: 12px 0;
  }
</style>
