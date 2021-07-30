<template lang="pug">
.connection
  .process
    svg.process-dots(width='24' height='4')
      use(:href="'/icons.svg#processing'")
  .text Connection...
  .decline(@click="hangup" tabindex=0)
    svg.decline-key
      use(:href="'/icons.svg#decline'")
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { Button } from '@voximplant/spaceui';

  export default defineComponent({
    components: { Button },
    emit: ['update:cancelBtn'],
    setup(props, { emit }) {
      const hangup = () => {
        emit('update:cancelBtn');
      };
      return {
        hangup,
      };
    },
  });
</script>

<style scoped>
  .connection {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    & >>> .sui-icon {
      --sui-icon-color: #ffffff !important;
      margin-right: 4px;
    }
  }
  .process-dots {
    --process-color-1: #662eff;
    --process-color-2: #662eff;
    --process-color-3: #662eff;
    animation: dots 1s infinite;
  }
  @keyframes dots {
    0% {
      --process-color-1: #ffffff;
      --process-color-2: #ffffff;
      --process-color-3: #ffffff;
    }
    25% {
      --process-color-1: #662eff;
      --process-color-2: #ffffff;
      --process-color-3: #ffffff;
    }
    50% {
      --process-color-1: #662eff;
      --process-color-2: #662eff;
      --process-color-3: #ffffff;
    }
    75% {
      --process-color-1: #662eff;
      --process-color-2: #662eff;
      --process-color-3: #662eff;
    }
  }
  .text {
    font-family: Roboto, sans-serif;
    font-size: 16px;
    line-height: 20px;
    color: #662eff;
    margin-top: 16px;
  }
  .decline {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    margin: 24px;
    cursor: pointer;
  }
  .decline-key {
    --decline-color: #ff7875;
  }
  .decline-key:hover {
    --decline-color: #ff4d4f;
  }
</style>
