import Vue from 'vue'
import App from './App.vue'
import { connect } from './chatservice'

Vue.config.productionTip = false
Vue.prototype.$ws = connect();

const msgQueue = [];

Vue.prototype.$ws.sendQueue = (msg) => {
  if (Vue.prototype.$ws.readyState !== 1) {
    msgQueue.push(msg);
  } else {
    Vue.prototype.$ws.send(msg);
  }
};

Vue.prototype.$ws.addEventListener('open', () => {
  while (msgQueue.length) {
    Vue.prototype.$ws.send(msgQueue.shift())
  }
});

const filter = (event, listener) => ({data}) => {
  const payload = JSON.parse(data)
  if (payload.event === event) {
      listener(payload.msg);
  }
}

Vue.mixin({
  methods: {
    login: msg => Vue.prototype.$ws.sendQueue(JSON.stringify({event: 'login', msg})),
    sendToChat: msg => Vue.prototype.$ws.sendQueue(JSON.stringify({event: 'new-message', msg, user: window.localStorage.getItem('user')})),
    listenToChat: listener => Vue.prototype.$ws.addEventListener('message', filter('new-message',listener)),
    listenToUsers: listener => Vue.prototype.$ws.addEventListener('message', filter('users', listener)),
    onWsStateChange: listener => {
      Vue.prototype.$ws.addEventListener('open', () => listener(false));
      Vue.prototype.$ws.addEventListener('close', () => listener(true));
    }
  }
})

new Vue({
  render: h => h(App)
}).$mount('#app')
