<template lang="pug">
MicPermission(v-if="!isMicAccessGranted")
.call(v-else="isMicAccessGranted")
  .settings-panel
    Button(size="s" mode="secondary" icon="ic20-settings" @click="showSettings=true") Settings
    Button(size="s" mode="secondary" icon="ic20-mic" @click="checkingOpened=true") Checking
  .call-state
    Settings(v-if="showSettings" @update:closeSettings="showSettings=false" :call="call")
    CheckingMic(v-if="checkingOpened" @update:checking="checkingOpened=false" :sdk="sdk")
    Connection(v-if="callState===CallState.CONNECTING" @update:cancelBtn="disconnect")
    RedialCall(v-if="callState===CallState.DISCONNECTED" @update:callBtn="createCall")
    DtmfKeyboard(v-if="callState===CallState.CONNECTED" @update:digit="sendDigit" @update:hangup="disconnect")
  .controls
    .microphone(@click="toggleMic")
      .muted(v-if="muted")
      .unmuted(v-else="!muted")
  .footer
    .help
      a(href="https://voximplant.com" id="help") Help
    .voxlink
      a(href="https://voximplant.com") voximplant.com
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
  import CheckingMic from '@/components/CheckingMic.vue';

  export default defineComponent({
    components: {
      CheckingMic,
      DtmfKeyboard,
      Settings,
      MicPermission,
      RedialCall,
      Connection,
      Button,
    },
    setup() {
      const callState = ref('');
      const muted = ref(false);
      const sdk = VoxImplant.getInstance();
      const call = ref<Call | null>(null);
      sdk
        .init({
          micRequired: true,
          showDebugInfo: true,
          progressTone: true,
          progressToneCountry: 'US',
        })
        .then(() => sdk.connect(false))
        .then(() => sdk.login(process.env.VUE_APP_USER, process.env.VUE_APP_PASSWORD))
        .then(() => {
          createCall();
        });
      const disconnect = () => {
        call.value?.hangup();
      };

      const createCall = () => {
        call.value = sdk.call({
          number: 'olya',
          video: { sendVideo: false, receiveVideo: false },
        });
        callState.value = CallState.CONNECTING;
        call.value.on(VoxImplant.CallEvents.Connected, () => {
          callState.value = CallState.CONNECTED;
        });
        call.value.on(VoxImplant.CallEvents.Disconnected, () => {
          callState.value = CallState.DISCONNECTED;
        });
        call.value.on(VoxImplant.CallEvents.Failed, () => {
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
      const checkingOpened = ref(false);
      const sendDigit = (digit: string) => {
        call.value?.sendTone(digit);
      };
      const toggleMic = () => {
        if (muted.value) {
          muted.value = false;
          call.value?.unmuteMicrophone();
        } else {
          muted.value = true;
          call.value?.muteMicrophone();
        }
      };
      return {
        muted,
        toggleMic,
        callState,
        CallState,
        createCall,
        disconnect,
        isMicAccessGranted,
        showSettings,
        checkingOpened,
        sendDigit,
        sdk,
        call,
      };
    },
  });
</script>

<style scoped>
  .call {
    position: relative;
    margin: 0 auto 0 auto;
    width: 376px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(40, 41, 61, 0.04), 0 16px 24px rgba(96, 97, 112, 0.16);
  }
  .settings-panel {
    display: flex;
    justify-content: space-around;
    position: relative;
    width: 100%;
    background-color: #662eff;
    padding: 12px 16px;
    border-radius: 8px 8px 0 0;
    box-sizing: border-box;
  }
  .call-state {
    position: relative;
    height: 300px;
    width: 100%;
  }
  .controls {
    position: relative;
    height: 52px;
    width: 168px;
    padding: 6px 16px;
    box-sizing: border-box;
  }
  .muted {
    width: 40px;
    height: 40px;
    background-image: url('../assets/muted.svg');
  }
  .unmuted {
    width: 40px;
    height: 40px;
    background-image: url('../assets/unmuted.svg');
  }
  .footer {
    position: relative;
    display: flex;
    justify-content: space-between;
    width: 376px;
    padding: 12px 16px;
    border-top: #e3e4eb solid 1px;
    font-size: 14px;
    box-sizing: border-box;
  }
  #help {
    background-image: url('../assets/question-mark.svg');
    background-repeat: no-repeat;

    line-height: 20px;
    padding-left: 20px;
  }
</style>
