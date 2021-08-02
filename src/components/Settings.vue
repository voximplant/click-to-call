<template lang="pug">
.settings
  teleport(to=".call")
    .background
  .text Select Microphone
  Select(v-model:active="active" size='s' @update:active="changeMicrophone" :options="mics.list")
  Volume(:inputId="active" v-if="audioWorkletDetected")
  .button-group
    Button(mode="primary" size="s" width="fill-container" @click="setNewMicrophone") Ok
    Button(mode="secondary" size="s" width="fill-container" @click="closeSettings") Cancel
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
      const detectAudioWorklet = () => {
        if (window['OfflineAudioContext']) {
          let context = new window['OfflineAudioContext'](1, 1, 44100);
          const result =
            context.audioWorklet && typeof context.audioWorklet.addModule === 'function';
          return result;
        }
        return false;
      };
      const audioWorkletDetected = detectAudioWorklet();
      return {
        mics,
        active,
        changeMicrophone,
        setNewMicrophone,
        closeSettings,
        audioWorkletDetected,
      };
    },
  });
</script>

<style scoped>
  .settings {
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    position: absolute;
    width: 296px;
    height: 196px;
    padding: 28px 24px 32px 24px;
    box-shadow: 0 2px 8px rgba(40, 41, 61, 0.04), 0 16px 24px rgba(96, 97, 112, 0.16);
    border-radius: 10px;
    box-sizing: border-box;
    z-index: 1;
    & >>> .sui-select-input {
      font-family: Roboto, sans-serif;
      font-size: 14px;
      line-height: 20px;
      color: #1f1c28;
    }
    & .sui-opened {
      & >>> .sui-arrow-icon {
        --sui-icon-color: #662eff !important;
      }
    }
  }
  .text {
    font-family: Roboto, sans-serif;
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    color: #2e283d;
    text-align: left;
    margin-bottom: 20px;
  }
  .background {
    width: 100%;
    height: 100%;
    position: absolute;
    background-color: black;
    opacity: 0.2;
    border-radius: 12px;
  }
  .button-group {
    position: relative;
    margin-top: 24px;
    display: flex;
    width: 150px;
    & .sui-button {
      margin-right: 8px;
    }
  }
</style>
