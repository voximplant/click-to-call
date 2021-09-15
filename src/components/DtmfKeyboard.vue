<template lang="pug">
.digits-wrapper
  .dtmf-keyboard
    .digit(v-for="n of buttons" @click="emitDigit(n)" tabindex=0)
      svg.key-btn(:width="'44'" :height="'44'")
        use(:href="`/icons.svg#button-${n}`" )
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  export default defineComponent({
    emit: ['update:digit'],
    setup(props, { emit }) {
      const buttons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];
      const keyStyle = { '--key-color': '#f2f2f5' };
      const emitDigit = (n: string) => {
        emit('update:digit', n);
      };
      return {
        emitDigit,
        buttons,
        keyStyle,
      };
    },
  });
</script>

<style scoped>
  .dtmf-keyboard {
    width: 216px;
    height: 228px;
    position: relative;
    display: flex;
    flex-wrap: wrap;
    top: -4px;
    left: -12px;
  }
  .digits-wrapper {
    margin-top: 24px;
    width: 192px;
    height: 218px;
  }
  .key-btn {
    --key-color: #f2f2f5;
  }
  .key-btn:hover {
    --key-color: #ebedf2;
  }
  .digit {
    width: 44px;
    height: 44px;
    margin: 6px 14px;
    border-radius: 50%;
    cursor: pointer;
  }
  .digit:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--sui-blue-500);
  }
</style>
