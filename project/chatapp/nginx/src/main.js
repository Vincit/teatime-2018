import Vue from 'vue'
import App from './App.vue'
import { connect } from './chatservice'

Vue.config.productionTip = false
Vue.prototype.$ws = connect();

const msgBuffer = [];

Vue.prototype.$ws.sendQueue = (msg) => {
  if (Vue.prototype.$ws.readyState !== 1) {
    msgBuffer.push(msg);
  } else {
    Vue.prototype.$ws.send(msg);
  }
};

Vue.prototype.$ws.addEventListener('open', () => {
  while (msgBuffer.length) {
    Vue.prototype.$ws.send(msgBuffer.shift())
  }
});

const filter = (event, listener) => ({data}) => {
  const payload = JSON.parse(data)
  if (payload.event === event) {
      listener(payload.content);
  }
}

Vue.mixin({
  methods: {
    login: msg => Vue.prototype.$ws.sendQueue(JSON.stringify({event: 'login', msg})),
    sendToChat: message => Vue.prototype.$ws.sendQueue(JSON.stringify({event: 'new-message', message, user: window.localStorage.getItem('user')})),
    listenToChat: listener => Vue.prototype.$ws.addEventListener('message', filter('new-message',listener)),
    onWsStateChange: listener => {
      Vue.prototype.$ws.addEventListener('open', () => listener(false));
      Vue.prototype.$ws.addEventListener('close', () => listener(true));
    }
  }
})

new Vue({
  render: h => h(App)
}).$mount('#app')
