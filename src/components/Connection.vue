<template lang="pug">
.connection
  .state
    Spinner(size="l")
    .text Connection...
  Button Cancel
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { Button, Spinner } from '@voximplant/spaceui';

  export default defineComponent({
    components: { Button, Spinner },
  });
</script>

<style scoped>
  .connection {
    position: relative;
    margin: 30px auto 30px auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }
  .state {
    display: flex;
    flex-direction: row;
    margin-bottom: 30px;
  }
  .text {
    margin-left: 10px;
  }
</style>
