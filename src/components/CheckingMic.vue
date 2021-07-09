<template lang="pug">
.checking-mic
  Timer(:callState="callState" v-if="callState !== CallState.DISCONNECTED")
  .text {{ message }}
  Button.close(mode="flat" @click="stopChecking") {{ btnName }}
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { Button } from '@voximplant/spaceui';
  import * as VoxImplant from 'voximplant-websdk';
  import { Call } from 'voximplant-websdk/Call/Call';
  import Timer from '@/components/Timer.vue';
  import { CallState } from '@/enums/CallState';

  export default defineComponent({
    components: { Timer, Button },
    emit: ['update:checking'],
    props: ['sdk'],
    setup(props, { emit }) {
      const message = ref('Connection with service...');
      const callState = ref('');
      const btnName = ref('Cancel');
      let totalPacketLost = 0;
      let call: Call | null = null;
      const createTestCall = () => {
        const sdk = props.sdk;
        call = sdk?.call({ number: 'testmic' });
        call?.on(VoxImplant.CallEvents.Connected, () => {
          callState.value = CallState.CONNECTED;
          message.value = 'Say something to test your mic';
        });
        call?.on(VoxImplant.CallEvents.Disconnected, () => {
          callState.value = CallState.DISCONNECTED;
          btnName.value = 'Close';
        });
        call?.on(VoxImplant.CallEvents.MessageReceived, (e: any) => {
          message.value = `All works! Total packet lost is ${totalPacketLost}%. Here is the record ${e.text}`;
        });
        call?.on(VoxImplant.CallEvents.CallStatsReceived, (e: any) => {
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
        callState,
        CallState,
      };
    },
  });
</script>

<style scoped>
  .checking-mic {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    margin: 12px auto;
    position: absolute;
    z-index: 1;
    min-width: 200px;
    max-width: 300px;
    min-height: 100px;
    overflow-wrap: anywhere;
    background-color: #ffffff;
    border-radius: 5%;
    padding: 12px 16px;
    font-family: Roboto, sans-serif;
    box-shadow: 0 2px 8px rgba(40, 41, 61, 0.04), 0 16px 24px rgba(96, 97, 112, 0.16);
  }
  .checking-mic:after {
    content: '';
    position: absolute;
    bottom: 100%;
    left: 70%;
    border-width: 10px;
    border-style: solid;
    border-color: transparent transparent #ffffff transparent;
  }
  .close {
    position: relative;
    top: 10px;
  }
</style>
