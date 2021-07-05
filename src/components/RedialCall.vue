<template lang="pug">
.redial-call
  .text Press the button to call
  Button(icon="ic20-phone" @click="redial") Call
</template>

<script lang="ts">
  import { Button } from '@voximplant/spaceui';
  import { defineComponent } from 'vue';

  export default defineComponent({
    components: { Button },
    emit: ['update:modelValue'],
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
    height: 300px;
    margin: 30px auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }
  .text {
    font-family: Roboto;
  }
</style>
