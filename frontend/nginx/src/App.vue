<template>
  <div id="app">
    <login @login="onLogin" v-if="!user"/>
    <chat v-else :user="user"/>
  </div>
</template>

<script>
import Chat from './components/Chat.vue'
import Login from './components/Login.vue'

export default {
  name: 'app',
  components: {
    Chat,
    Login
  },
  data() {
    return {
      user: window.localStorage.getItem('user')
    }
  },
  methods: {
    onLogin(user) {
      window.localStorage.setItem('user', user);
      this.user = user;
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
  box-sizing: border-box;
}
*, *:before, *:after {
  box-sizing: inherit;
}
</style>
