<template lang="pug">
.call
  .settings
    Button(size="s" mode="secondary" icon="ic20-settings") Settings
    Button(size="s" mode="secondary" icon="ic20-mic") Checking
  Connection(v-if="callState===CallState.CONNECTING")
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import Connection from '@/components/Connection.vue';
  import { Button } from '@voximplant/spaceui';
  import * as VoxImplant from 'voximplant-websdk';
  import { CallState } from '../enums/CallState';

  export default defineComponent({
    components: {
      Connection,
      Button,
    },
    setup() {
      const callState = ref('');
      const sdk = VoxImplant.getInstance();
      sdk
        .init({ micRequired: true, progressTone: true, progressToneCountry: 'US' })
        .then(() => sdk.connect(false))
        .then(() => sdk.login(process.env.VUE_APP_USER, process.env.VUE_APP_PASSWORD))
        .then(() => {
          const call = sdk.call({
            number: '79773203997',
            video: { sendVideo: false, receiveVideo: false },
          });
          callState.value = CallState.CONNECTING;
          call.on(VoxImplant.CallEvents.Connected, (e) => {
            console.log('CONNECTED, ', e);
            callState.value = CallState.CONNECTED;
          });
        });

      return {
        callState,
        CallState,
      };
    },
  });
</script>

<style scoped>
  .call {
    position: relative;
    margin: 0 auto 0 auto;
    width: 210px;
    height: 200px;
    display: flex;
    flex-direction: column;
  }
  .settings {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
</style>
