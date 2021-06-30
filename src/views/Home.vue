<template lang="pug">
.home
  StartZiCallBtn
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import StartZiCallBtn from '@/components/StartZiCallBtn.vue';
  export default defineComponent({
    components: {
      StartZiCallBtn,
    },
  });
</script>
