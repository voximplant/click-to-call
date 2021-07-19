<template lang="pug">
teleport(to=".call")
  .settings
    .close(@click="closeSettings")
    .text Select microphone
    .select-with-volume
      Select(v-model:active="active" @update:active="changeMicrophone" :options="mics.list")
      Volume(:inputId="active")
    Button(size="s" mode="flat" @click="setNewMicrophone") OK
</template>

<script lang="ts">
  import { DropdownOptionProps, Select, Button } from '@voximplant/spaceui';
  import { defineComponent, onMounted, reactive, ref, toRef } from 'vue';
  import * as VoxImplant from 'voximplant-websdk';
  import { AudioParams } from 'voximplant-websdk/Hardware/src';
  import { AudioSourceInfo } from 'voximplant-websdk/Structures';
  import Volume from '@/components/Volume.vue';
  export default defineComponent({
    components: { Volume, Select, Button },
    props: ['call'],
    emit: ['update:closeSettings'],
    setup(props, { emit }) {
      const call = toRef(props, 'call');
      const item: DropdownOptionProps = { label: '', value: '' };
      const mics = reactive({
        list: [item],
      });
      const active = ref<DropdownOptionProps>({ label: '', value: '' });
      const inputId = ref<string>('');
      onMounted(async () => {
        const devices: AudioSourceInfo[] =
          await VoxImplant.Hardware.AudioDeviceManager.get().getInputDevices();
        const selectMics = devices.map((mic: AudioSourceInfo) => ({
          label: mic.name,
          value: mic.id,
        }));
        mics.list = selectMics;
        active.value =
          mics.list.find(
            (item) =>
              item.value ===
              VoxImplant.Hardware.AudioDeviceManager.get().getDefaultAudioSettings().inputId
          ) || mics.list[0];
      });
      const changeMicrophone = (input: HTMLInputElement) => {
        inputId.value = input.value;
      };
      const setNewMicrophone = () => {
        const audioParams: AudioParams = { inputId: inputId.value };
        if (call.value) {
          VoxImplant.Hardware.AudioDeviceManager.get().setCallAudioSettings(
            call.value,
            audioParams
          );
        }
        VoxImplant.Hardware.AudioDeviceManager.get().setDefaultAudioSettings(audioParams);
        closeSettings();
      };
      const closeSettings = () => {
        emit('update:closeSettings');
      };
      return {
        mics,
        active,
        changeMicrophone,
        setNewMicrophone,
        closeSettings,
      };
    },
  });
</script>

<style scoped>
  .select-with-volume {
    position: relative;
    width: 280px;
    height: 40px;
    border-radius: 4px;
    overflow: hidden;
    & .sui-select {
      position: absolute;
      display: block;
    }
    & >>> .sui-select-input {
      background-color: transparent;
    }
  }
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
