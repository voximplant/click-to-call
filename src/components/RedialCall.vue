<template lang="pug">
.redial-call
  .text Press the button to call
  Button.call(icon="ic20-phone" @click="redial") Call
</template>

<script lang="ts">
  import { Button } from '@voximplant/spaceui';
  import { defineComponent } from 'vue';

  export default defineComponent({
    components: { Button },
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
    margin: 32px auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .text {
    font-family: Roboto, sans-serif;
    height: 22px;
    margin-bottom: 24px;
  }
  .call {
    & .sui-button {
      & .only-icon {
        --sui-icon-color: white;
        margin-right: 4px;
      }
    }
  }
</style>
