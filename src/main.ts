import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { SpaceUIPlugin } from '@voximplant/spaceui';

const spaceUiPlugin = SpaceUIPlugin({
  spriteUrl: require(`@voximplant/spaceui/common/sui-icons.svg`),
});

createApp(App).use(router).use(spaceUiPlugin).mount('#app');
