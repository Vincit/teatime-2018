import Vue from 'vue'
import App from './App.vue'
import { connect } from './chatservice'

Vue.config.productionTip = false
Vue.prototype.$ws = connect();

Vue.mixin({
  methods: {
    sendToChat: msg => Vue.prototype.$ws.send(JSON.stringify({event: 'new-message', msg})),
    listenToChat: listener => Vue.prototype.$ws.addEventListener('message', (msg) => {
      const payload = JSON.parse(msg.data)
      if (payload.event === 'new-message') {
        listener(payload.msg);
      }
    }),
    onWsStateChange: listener => {
      Vue.prototype.$ws.addEventListener('open', () => listener(false));
      Vue.prototype.$ws.addEventListener('close', () => listener(true));
    }
  }
})

new Vue({
  render: h => h(App)
}).$mount('#app')
