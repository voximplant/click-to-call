<template lang="pug">
.connection-rate
  .stripe-high(:class="connectionRate")
  .stripe-medium(:class="connectionRate")
  .stripe-low(:class="connectionRate")
</template>

<script lang="ts">
  import { defineComponent, ref, toRef } from 'vue';
  import * as VoxImplant from 'voximplant-websdk';
  import { EventHandlers } from 'voximplant-websdk/EventHandlers';
  export default defineComponent({
    props: ['call'],
    setup(props) {
      const connectionRate = ref<string>('high');
      const call = toRef(props, 'call');
      call.value.on(
        VoxImplant.CallEvents.CallStatsReceived,
        (e: EventHandlers.CallStatsReceived) => {
          if (e.stats.totalLoss && e.stats.totalLoss <= 0.01) {
            connectionRate.value = 'high';
          } else if (e.stats.totalLoss && e.stats.totalLoss <= 0.02) {
            connectionRate.value = 'medium';
          } else {
            connectionRate.value = 'low';
          }
        }
      );
      return {
        connectionRate,
      };
    },
  });
</script>

<style scoped>
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
</style>
