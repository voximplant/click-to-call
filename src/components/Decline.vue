<template lang="pug">
.decline(@click="disconnect" tabindex=0)
  svg.decline-key(width='44' height='44')
    use(:href="'/icons.svg#decline'" width='44' height='44')
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  export default defineComponent({
    setup() {
      const declineImage = '/icons.svg#decline';
      return {
        declineImage,
      };
    },
  });
</script>

<style scoped>
  .decline {
    position: relative;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    cursor: pointer;
  }
  .decline-key {
    --decline-color: #ff7875;
  }
  .decline-key:hover {
    --decline-color: #ff4d4f;
  }
  .decline:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--sui-blue-500);
  }
</style>
