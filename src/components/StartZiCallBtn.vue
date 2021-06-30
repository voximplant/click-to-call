<template lang="pug">
.start-zi-call
  Button(@click="startZiCall") StartZiCall
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { Button } from '@voximplant/spaceui';

  export default defineComponent({
    components: { Button },
    setup() {
      const startZiCall = () => {
        window.open(window.location.href);
      };
      return {
        startZiCall,
      };
    },
  });
</script>
