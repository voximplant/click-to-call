<template lang="pug">
.checking-mic
  teleport(to=".call")
    .background
  Timer(:callState="timerState" v-if="timerState !== CallState.DISCONNECTED")
  .text {{ message }}
  Button.close(mode="secondary" width="fit-content" @click="stopChecking") {{ btnName }}
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { Button } from '@voximplant/spaceui';
  import * as VoxImplant from 'voximplant-websdk';
  import { Call } from 'voximplant-websdk/Call/Call';
  import Timer from '@/components/Timer.vue';
  import { CallState } from '@/enums/CallState';
  import { EventHandlers } from 'voximplant-websdk/EventHandlers';

  export default defineComponent({
    components: { Timer, Button },
    emit: ['update:checking'],
    props: ['sdk'],
    setup(props, { emit }) {
      const message = ref<string>('Connection with service...');
      const timerState = ref<string>('');
      const btnName = ref<string>('Cancel');
      const record = ref<string>('');
      let totalPacketLost: number | undefined = 0;
      let call: Call | null = null;
      const createTestCall = () => {
        const sdk = props.sdk;
        call = sdk?.call({ number: process.env.VUE_APP_TEST_NUMBER });
        call?.on(VoxImplant.CallEvents.Connected, () => {
          message.value =
            'Please record your message, afterwards your message will be played back to you.';
        });
        call?.on(VoxImplant.CallEvents.MessageReceived, (e: EventHandlers.MessageReceived) => {
          if (e.text === 'record') {
            timerState.value = CallState.CONNECTED;
          } else {
            message.value = `All works! Total packet lost is ${totalPacketLost}%.`;
            btnName.value = 'Close';
            timerState.value = CallState.DISCONNECTED;
            record.value = e.text;
          }
        });
        call?.on(VoxImplant.CallEvents.CallStatsReceived, (e: EventHandlers.CallStatsReceived) => {
          totalPacketLost = e.stats.totalPacketsLost;
        });
      };
      createTestCall();
      const stopChecking = () => {
        emit('update:checking');
        call?.hangup();
      };
      return {
        message,
        createTestCall,
        stopChecking,
        btnName,
        timerState,
        CallState,
        record,
      };
    },
  });
</script>

<style scoped>
  .checking-mic {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    padding: 24px;
    z-index: 1;
    width: 286px;
    height: 192px;
    overflow-wrap: anywhere;
    background-color: #ffffff;
    border-radius: 10px;
    box-sizing: border-box;
    box-shadow: 0 2px 8px rgba(40, 41, 61, 0.04), 0 16px 24px rgba(96, 97, 112, 0.16);
    & .sui-button {
      padding: 6px 12px;
      max-width: initial;
    }
  }
  .text {
    width: 100%;
    font-family: Roboto, sans-serif;
    font-size: 16px;
    line-height: 20px;
    text-align: center;
    margin: 16px;
  }
  .close {
    position: absolute;
    top: 136px;
  }
  .background {
    width: 100%;
    height: 100%;
    position: absolute;
    background-color: black;
    opacity: 0.2;
    border-radius: 12px;
  }
</style>
