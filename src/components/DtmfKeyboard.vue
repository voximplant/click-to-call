<template lang="pug">
.dtmf-keyboard
  .digits
    .digit(v-for="n of [1,2,3,4,5,6,7,8,9, '*', 0, '#']" @click="emitDigit" tabindex=0) {{n}}
  .hangup(@click="hangup")
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  export default defineComponent({
    emit: ['update:digit', 'update:hangup'],
    setup(props, { emit }) {
      const emitDigit = (e: any) => {
        emit('update:digit', e.target.innerText);
      };
      const hangup = () => {
        emit('update:hangup');
      };
      return {
        emitDigit,
        hangup,
      };
    },
  });
</script>

<style scoped>
  .dtmf-keyboard {
    width: 168px;
    height: 208px;
  }
  .digits {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    width: 168px;
    height: 208px;
  }
  .digit {
    width: 40px;
    height: 40px;
    margin: 6px 8px;
    background-color: #f2f2f5;
    border-radius: 50%;
    line-height: 40px;
    cursor: pointer;
  }
  .digit:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--sui-blue-500);
  }
  .hangup {
    position: relative;
    width: 40px;
    height: 40px;
    margin: 6px auto;
    background-image: url('../assets/decline.png');
  }
</style>
