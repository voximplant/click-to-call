<template lang="pug">
.connection
  .state
    .wrapper-process
      .show-process
        .processing
    .text Connection...
  .decline(@click="hangup" tabindex=0)
    svg.decline-key(width='44' height='44')
      use(:href="'/icons.svg#decline'" width='44' height='44')
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
  .wrapper-process {
    position: relative;
    width: 24px;
    height: 4px;
    margin: 8px 0 16px 0;
  }
  .processing {
    width: 24px;
    height: 4px;
    background-image: url('../assets/processing.svg');
  }
  .show-process {
    position: absolute;
    height: 100%;
    width: 0;
    left: 0;
    overflow: hidden;
    animation: show 1s infinite;
  }
  @keyframes show {
    0% {
      width: 0;
    }
    9% {
      width: 0;
    }
    10% {
      width: 8px;
    }
    39% {
      width: 8px;
    }
    40% {
      width: 16px;
    }
    69% {
      width: 16px;
    }
    70% {
      width: 24px;
    }
    100% {
      width: 24px;
    }
  }
  .state {
    display: flex;
    flex-direction: column;
    align-items: center;
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
