<template lang="pug">
.digits-wrapper
  .dtmf-keyboard
    .digit(v-for="n of buttons" @click="emitDigit" tabindex=0)
      svg.key-btn(:width="'44'" :height="'44'")
        use(:href="n" )
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  export default defineComponent({
    emit: ['update:digit'],
    setup(props, { emit }) {
      const buttons = [
        '/icons.svg#button-1',
        '/icons.svg#button-2',
        '/icons.svg#button-3',
        '/icons.svg#button-4',
        '/icons.svg#button-5',
        '/icons.svg#button-6',
        '/icons.svg#button-7',
        '/icons.svg#button-8',
        '/icons.svg#button-9',
        '/icons.svg#button-z',
        '/icons.svg#button-0',
        '/icons.svg#button-r',
      ];
      const keyStyle = { '--key-color': '#f2f2f5' };
      const emitDigit = (e: Event) => {
        const input = e.target as HTMLElement;
        emit('update:digit', input.innerText);
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
