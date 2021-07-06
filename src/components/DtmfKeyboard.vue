<template lang="pug">
.dtmf-keyboard
  .digits
    .digit(v-for="n of [1,2,3,4,5,6,7,8,9, '*', 0, '#']" @click="emitDigit") {{n}}
  .hangup
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  export default defineComponent({
    emit: ['update:digit'],
    setup(props, { emit }) {
      const emitDigit = (e: any) => {
        emit('update:digit', e.target.innerText);
      };
      return {
        emitDigit,
      };
    },
  });
</script>

<style scoped>
  .dtmf-keyboard {
    width: 168px;
    height: 208px;
    margin: 12px auto;
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
  }
  .hangup {
    position: relative;
    width: 40px;
    height: 40px;
    margin: 6px auto;
    background-image: url('../assets/decline.png');
  }
</style>
