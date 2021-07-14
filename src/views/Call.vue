<template lang="pug">
MicPermission(v-if="!isMicAccessGranted" :accessDenied="accessDenied")
.call(v-else="isMicAccessGranted")
  .settings-panel
    Button(size="s" mode="secondary" icon="ic20-settings" @click="showSettings=true") Settings
    Button(size="s" mode="secondary" icon="ic20-mic" @click="checkingOpened=true") Checking
  .call-state
    Timer(:callState="callState")
    Settings(v-if="showSettings" @update:closeSettings="showSettings=false" :call="call")
    CheckingMic(v-if="checkingOpened" @update:checking="checkingOpened=false" :sdk="sdk")
    Connection(v-if="callState===CallState.CONNECTING" @update:cancelBtn="disconnect")
    RedialCall(v-if="callState===CallState.DISCONNECTED" @update:callBtn="createCall")
    DtmfKeyboard(v-if="callState===CallState.CONNECTED" @update:digit="sendDigit" @update:hangup="disconnect")
  .controls
    .microphone(@click="toggleMic")
      .muted(v-if="muted")
      .unmuted(v-else="!muted")
    .connection-rate(v-if="callState===CallState.CONNECTED")
      .stripe-high(:class="connectionRate")
      .stripe-medium(:class="connectionRate")
      .stripe-low(:class="connectionRate")
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
  import Timer from '@/components/Timer.vue';

  export default defineComponent({
    components: {
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
      const callState = ref('');
      const muted = ref(false);
      const connectionRate = ref('high');
      const accessDenied = ref(false);
      const sdk = VoxImplant.getInstance();
      sdk.on(VoxImplant.Events.MicAccessResult, (e) => {
        if (e.result === false) {
          accessDenied.value = true;
        }
      });
      const call = ref<Call | null>(null);
      sdk
        .init({
          micRequired: true,
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
        call.value.on(VoxImplant.CallEvents.CallStatsReceived, (e) => {
          if (e.stats.totalLoss <= 0.01) {
            connectionRate.value = 'high';
          } else if (e.stats.totalLoss <= 0.02) {
            connectionRate.value = 'medium';
          } else {
            connectionRate.value = 'low';
          }
        });
        call.value.on(VoxImplant.CallEvents.QualityIssueHighMediaLatency, (e: any) => {
          console.warn('QualityIssueHighMediaLatency', e);
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
        accessDenied,
        showSettings,
        checkingOpened,
        sendDigit,
        sdk,
        call,
        connectionRate,
      };
    },
  });
</script>

<style scoped>
  .call {
    position: relative;
    margin: 0 auto;
    width: 376px;
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
  }
  .call-state {
    position: relative;
    height: 300px;
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
  .microphone {
    margin: 6px 8px;
    width: 40px;
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
  .connection-rate {
    position: relative;
    overflow: hidden;
    width: 40px;
    height: 40px;
    margin: 6px 8px;
    box-sizing: border-box;
    transform: rotate(45deg);
    top: -10px;
  }
  .stripe-high {
    width: 80px;
    height: 80px;
    border: solid white 6px;
    border-radius: 50%;
    position: absolute;
    box-sizing: border-box;
  }
  .stripe-high.medium,
  .stripe-high.low {
    background-color: grey;
  }
  .stripe-medium {
    width: 56px;
    height: 56px;
    border: solid white 6px;
    border-radius: 50%;
    position: absolute;
    top: 12px;
    left: 12px;
    box-sizing: border-box;
  }
  .stripe-medium.low {
    background-color: grey;
  }
  .stripe-low {
    width: 32px;
    height: 32px;
    border: solid white 6px;
    border-radius: 50%;
    position: absolute;
    top: 24px;
    left: 24px;
    box-sizing: border-box;
  }
  .high {
    background-color: #2fbc4f;
  }
  .medium {
    background-color: #fadb14;
  }
  .low {
    background-color: #f5222d;
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
