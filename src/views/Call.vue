<template lang="pug">
MicPermission(v-if="!isMicAccessGranted" :accessDenied="accessDenied")
.call(v-else="isMicAccessGranted")
  .settings-panel
    Button(size="s" mode="secondary" icon="ic20-settings" @click="showSettings=true") Settings
    Button(size="s" mode="secondary" icon="ic20-mic" @click="startTestMic") Checking
  .call-state
    Timer(:callState="callState")
    Settings(v-if="showSettings" @update:closeSettings="showSettings=false" :call="call")
    CheckingMic(v-if="checkingOpened" @update:checking="checkingOpened=false" :sdk="sdk")
    Connection(v-if="callState===CallState.CONNECTING" @update:cancelBtn="disconnect")
    RedialCall(v-if="callState===CallState.DISCONNECTED" @update:callBtn="createCall")
    DtmfKeyboard(v-if="callState===CallState.CONNECTED" @update:digit="sendDigit")
  .controls(v-if="callState===CallState.CONNECTED")
    Microphone(:call="call")
    .hangup(@click="disconnect")
    ConnectionRate(:call="call")
  .footer
    .help
      a(href="https://voximplant.com" target="_blank" id="help") Help
    .voxlink
      a(href="https://voximplant.com" target="_blank") voximplant.com
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
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
  import Timer from '@/components/Timer.vue';
  import ConnectionRate from '@/components/ConnectionRate.vue';
  import Microphone from '@/components/Microphone.vue';

  export default defineComponent({
    components: {
      Microphone,
      ConnectionRate,
      Timer,
      CheckingMic,
      DtmfKeyboard,
      Settings,
      MicPermission,
      RedialCall,
      Connection,
      Button,
    },
    setup() {
      const callState = ref<string>('');
      const accessDenied = ref<boolean>(false);
      const isMicAccessGranted = ref<boolean>(false);
      const sdk = VoxImplant.getInstance();
      sdk.on(VoxImplant.Events.MicAccessResult, (e) => {
        if (e.result === true) {
          isMicAccessGranted.value = true;
        } else {
          accessDenied.value = true;
        }
      });
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
          number: process.env.VUE_APP_NUMBER,
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
      const showSettings = ref<boolean>(false);
      const checkingOpened = ref<boolean>(false);
      const sendDigit = (digit: string) => {
        call.value?.sendTone(digit);
      };
      const startTestMic = () => {
        checkingOpened.value = true;
        call.value?.hangup();
      };
      return {
        callState,
        CallState,
        createCall,
        disconnect,
        isMicAccessGranted,
        accessDenied,
        showSettings,
        checkingOpened,
        sendDigit,
        sdk,
        call,
        startTestMic,
      };
    },
  });
</script>

<style scoped>
  .call {
    position: relative;
    margin: 0 auto;
    width: 376px;
    height: 410px;
    display: flex;
    flex-direction: column;
    align-items: center;
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

    & >>> .sui-icon {
      --sui-icon-color: #555770 !important;
      margin-right: 2px;
    }
  }
  .call-state {
    position: relative;
    height: 252px;
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  .controls {
    position: relative;
    height: 52px;
    width: 168px;
    box-sizing: border-box;
    display: flex;
    justify-content: flex-start;
  }
  .hangup {
    position: relative;
    width: 40px;
    height: 40px;
    margin: 6px auto;
    background-image: url('../assets/decline.png');
  }
  .footer {
    position: absolute;
    top: 365px;
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
