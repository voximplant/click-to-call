<template lang="pug">
.start-zi-call
  Button(@click="startCall") Call
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { Button } from '@voximplant/spaceui';

  export default defineComponent({
    components: { Button },
    setup() {
      const startCall = () => {
        window.open(
          `${window.location.href}call`,
          '_blank',
          'width=800,height=600,resizable=no,toolbar=no,menubar=no,location=no,status=no'
        );
      };
      return {
        startCall,
      };
    },
  });
</script>
