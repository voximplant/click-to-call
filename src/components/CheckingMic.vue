<template lang="pug">
.checking-mic
  .text {{ message }}
  Button.close(mode="flat" @click="stopChecking") {{ btnName }}
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { Button } from '@voximplant/spaceui';
  import * as VoxImplant from 'voximplant-websdk';
  import { Call } from 'voximplant-websdk/Call/Call';
  export default defineComponent({
    components: { Button },
    emit: ['update:checking'],
    props: ['sdk'],
    setup(props, { emit }) {
      const message = ref('Connection with service...');
      const btnName = ref('Cancel');
      let call: Call | null = null;
      const createTestCall = () => {
        const sdk = props.sdk;
        call = sdk?.call({ number: 'testmic' });
        call?.on(VoxImplant.CallEvents.Connected, () => {
          message.value = 'Say something to test your mic';
        });
        call?.on(VoxImplant.CallEvents.Disconnected, () => {
          btnName.value = 'Close';
        });
        call?.on(VoxImplant.CallEvents.MessageReceived, (e: any) => {
          message.value = `All works! Here is the record ${e.text}`;
        });
        call?.on(VoxImplant.CallEvents.QualityIssuePacketLoss, (e: any) => {
          console.log('Stats: ', e);
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
      };
    },
  });
</script>

<style scoped>
  .checking-mic {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    margin: 12px 0;
    min-width: 200px;
    max-width: 300px;
    min-height: 100px;
    overflow-wrap: anywhere;
    background-color: #ecddff;
    border-radius: 5%;
    padding: 12px 16px;
    font-family: Roboto;
  }
  .checking-mic:after {
    content: '';
    position: absolute;
    bottom: 100%;
    left: 70%;
    border-width: 10px;
    border-style: solid;
    border-color: transparent transparent #ecddff transparent;
  }
  .close {
    position: relative;
    top: 10px;
  }
</style>
