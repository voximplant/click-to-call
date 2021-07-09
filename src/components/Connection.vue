<template lang="pug">
.connection
  .state
    Spinner(size="l")
    .text Connection...
  Button(@click="hangup") Cancel
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { Button, Spinner } from '@voximplant/spaceui';

  export default defineComponent({
    components: { Button, Spinner },
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
    height: 300px;
    margin: 32px auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .state {
    display: flex;
    flex-direction: row;
    margin-bottom: 24px;
  }
  .text {
    margin-left: 10px;
  }
</style>
