<template lang="pug">
MicPermission(v-if="!isMicAccessGranted" :accessDenied="accessDenied")
.call(v-else-if="isMicAccessGranted")
  .settings-panel
    .vector
    Button(size="s" mode="primary" width="fill-container" icon="ic20-settings" @click="showSettings=true") Settings
    Button(size="s" mode="primary" width="fill-container" icon="ic20-mic" @click="startTestMic") Checking
  .call-state
    Timer(:callState="callState" v-if="callState===CallState.CONNECTED")
    Settings(v-if="showSettings" @update:closeSettings="showSettings=false" :call="call")
    CheckingMic(v-if="checkingOpened" @update:checking="checkingOpened=false" :sdk="sdk")
    Connection(v-if="callState===CallState.CONNECTING" @update:cancelBtn="disconnect")
    RedialCall(v-if="callState===CallState.DISCONNECTED" @update:callBtn="createCall")
    DtmfKeyboard(v-if="callState===CallState.CONNECTED" @update:digit="sendDigit")
    .controls(v-if="callState===CallState.CONNECTED")
      Hint(:text="micHint")
        Microphone(:call="call" @update:isMuted="changeMicHint")
      Hint(text="End the call")
        Decline(@click="disconnect")
      Hint(text="Indicator connection")
        ConnectionRate(:call="call")
  .vector-horizontal
  .footer
    a(href="https://voximplant.com" target="_blank") Help
    a(href="https://voximplant.com" target="_blank") Voximplant.com
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import Connection from '@/components/Connection.vue';
  import { Button, Hint } from '@voximplant/spaceui';
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
  import Decline from '@/components/Decline.vue';
  import { getParameters } from '@/helpers/get-parameters';

  export default defineComponent({
    components: {
      Decline,
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
      Hint,
    },
    setup() {
      const callState = ref<string>('');
      const accessDenied = ref<boolean>(false);
      const isMicAccessGranted = ref<boolean>(false);
      const sdk = VoxImplant.getInstance();
      const parameters = getParameters();
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
          extraHeaders: parameters,
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
      const micHint = ref<string>('Mute');
      const changeMicHint = (value: string) => {
        micHint.value = value;
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
        changeMicHint,
        micHint,
      };
    },
  });
</script>

<style scoped>
  .call {
    position: absolute;
    margin: 0;
    top: 50%;
    left: 50%;
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    width: 350px;
    height: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #ffffff;
    box-shadow: 0 2px 8px rgba(40, 41, 61, 0.04), 0 16px 24px rgba(96, 97, 112, 0.16);
    border-radius: 12px;
  }
  .settings-panel {
    display: flex;
    justify-content: space-around;
    position: relative;
    width: 350px;
    border-radius: 8px 8px 0 0;
    overflow: hidden;
    & >>> .sui-button {
      height: 64px;
      border-radius: 0;
    }
    & >>> .sui-icon {
      --sui-icon-color: #ffffff !important;
    }
  }
  .vector {
    position: absolute;
    width: 0;
    height: 64px;
    left: 175px;
    top: 0;
    border-right: 1px solid #8b55ff;
  }
  .call-state {
    position: relative;
    box-sizing: border-box;
    padding: 32px 0;
    height: 388px;
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  .controls {
    position: relative;
    height: 44px;
    width: 188px;
    margin-top: 24px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    & .hint-container {
      width: 44px;
    }
    & >>> .sui-tooltip {
      padding: 2px 0;
      width: max-content;
      width: -moz-max-content;
      white-space: nowrap;
      min-width: 40px;
      min-height: 20px;
    }
    & >>> .sui-tooltip-message {
      border-left: solid 6px transparent;
      border-right: solid 6px transparent;
    }
  }
  .vector-horizontal {
    position: relative;
    width: 318px;
    height: 0;
    border-top: 1px solid #ebedf2;
  }
  .footer {
    position: relative;
    display: flex;
    justify-content: space-between;
    height: 48px;
    width: 350px;
    padding: 8px 16px;
    font-size: 12px;
    line-height: 16px;
    color: #662eff;
    box-sizing: border-box;
  }
</style>
