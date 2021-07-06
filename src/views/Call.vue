<template lang="pug">
MicPermission(v-if="!isMicAccessGranted")
.call(v-else="isMicAccessGranted")
  .settings
    Button(size="s" mode="secondary" icon="ic20-settings" @click="showSettings=true") Settings
    Button(size="s" mode="secondary" icon="ic20-mic") Checking
  Settings(v-if="showSettings" @update:closeSettings="showSettings=false")
  Connection(v-if="callState===CallState.CONNECTING" @update:cancelBtn="disconnect")
  RedialCall(v-if="callState===CallState.DISCONNECTED" @update:callBtn="createCall")
  DtmfKeyboard(v-if="callState===CallState.CONNECTED" @update:digit="sendDigit")
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import Connection from '@/components/Connection.vue';
  import { Button } from '@voximplant/spaceui';
  import * as VoxImplant from 'voximplant-websdk';
  import { Call } from 'voximplant-websdk/Call/Call';
  import { CallState } from '@/enums/CallState';
  import RedialCall from '@/components/RedialCall.vue';
  import MicPermission from '@/components/MicPermission.vue';
  import Settings from '@/components/Settings.vue';
  import DtmfKeyboard from '@/components/DtmfKeyboard.vue';

  export default defineComponent({
    components: {
      DtmfKeyboard,
      Settings,
      MicPermission,
      RedialCall,
      Connection,
      Button,
    },
    setup() {
      const callState = ref('');
      const sdk = VoxImplant.getInstance();
      let call: Call | null = null;
      sdk
        .init({ micRequired: true, progressTone: true, progressToneCountry: 'US' })
        .then(() => sdk.connect(false))
        .then(() => sdk.login(process.env.VUE_APP_USER, process.env.VUE_APP_PASSWORD))
        .then(() => {
          createCall();
        });
      const disconnect = () => {
        call?.hangup();
      };

      const createCall = () => {
        call = sdk.call({
          number: '79773203997',
          video: { sendVideo: false, receiveVideo: false },
        });
        callState.value = CallState.CONNECTING;
        call.on(VoxImplant.CallEvents.Connected, () => {
          callState.value = CallState.CONNECTED;
        });
        call.on(VoxImplant.CallEvents.Disconnected, () => {
          callState.value = CallState.DISCONNECTED;
        });
        call.on(VoxImplant.CallEvents.Failed, () => {
          callState.value = CallState.DISCONNECTED;
        });
      };

      const isMicAccessGranted = ref(false);
      onMounted(async () => {
        const result = await navigator.permissions.query({ name: 'microphone' });
        if (result.state === 'granted') {
          isMicAccessGranted.value = true;
        } else {
          result.onchange = () => {
            if (result.state === 'granted') {
              isMicAccessGranted.value = true;
            }
          };
          isMicAccessGranted.value = false;
        }
      });
      const showSettings = ref(false);

      const sendDigit = (digit: string) => {
        call?.sendTone(digit);
      };
      return {
        callState,
        CallState,
        createCall,
        disconnect,
        isMicAccessGranted,
        showSettings,
        sendDigit,
      };
    },
  });
</script>

<style scoped>
  .call {
    position: relative;
    margin: 0 auto 0 auto;
    width: 210px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .settings {
    & .sui-button {
      margin: 0 2px;
    }
  }
</style>
