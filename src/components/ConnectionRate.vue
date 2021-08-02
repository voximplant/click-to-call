<template lang="pug">
.connection-rate
  svg.indicator(:style="levelStyle" width='44' height='44')
    use(:href="'/icons.svg#indicator'")
</template>

<script lang="ts">
  import { defineComponent, reactive, ref, toRef, watch } from 'vue';
  import * as VoxImplant from 'voximplant-websdk';
  import { EventHandlers } from 'voximplant-websdk/EventHandlers';
  export default defineComponent({
    props: ['call'],
    setup(props) {
      const connectionRate = ref<string>('high');
      const levelStyle = reactive({
        '--high-level-color': '#5ad677',
        '--medium-level-color': '#5ad677',
        '--low-level-color': '#5ad677',
      });
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
      watch(connectionRate, (state) => {
        if (state === 'high') {
          levelStyle['--high-level-color'] = '#5ad677';
          levelStyle['--medium-level-color'] = '#5ad677';
          levelStyle['--low-level-color'] = '#5ad677';
        } else if (state === 'medium') {
          levelStyle['--high-level-color'] = '#ebedf2';
          levelStyle['--medium-level-color'] = '#ff991f';
          levelStyle['--low-level-color'] = '#ff991f';
        } else {
          levelStyle['--high-level-color'] = '#ebedf2';
          levelStyle['--medium-level-color'] = '#ebedf2';
          levelStyle['--low-level-color'] = '#ff4d4f';
        }
      });
      return {
        connectionRate,
        levelStyle,
      };
    },
  });
</script>

<style scoped>
  .connection-rate {
    position: relative;
    width: 44px;
    height: 44px;
    box-sizing: border-box;
  }
</style>
