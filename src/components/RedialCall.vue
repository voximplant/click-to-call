<template lang="pug">
.redial-call
  .text Press the button to call
  .call-button(@click="redial" tabindex=0)
    svg.call-key(width='44' height='44')
      use(:href="'/icons.svg#call-button'")
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    emit: ['update:callBtn'],
    setup(props, { emit }) {
      const redial = () => {
        emit('update:callBtn');
      };
      return {
        redial,
      };
    },
  });
</script>

<style scoped>
  .redial-call {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .text {
    font-family: Roboto, sans-serif;
    font-size: 16px;
    line-height: 20px;
    color: #555770;
  }
  .call-button {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    margin: 24px;
    cursor: pointer;
  }
  .call-button:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--sui-blue-500);
  }
  .call-key {
    --call-color: #5ad677;
  }
  .call-key:hover {
    --call-color: #2fbc4f;
  }
</style>
