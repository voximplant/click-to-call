<template lang="pug">
.home
  StartCallBtn
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import StartCallBtn from '@/components/StartCallBtn.vue';
  export default defineComponent({
    components: {
      StartCallBtn,
    },
  });
</script>
