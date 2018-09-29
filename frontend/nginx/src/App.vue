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
  mounted() {
    if (this.user) {
      this.login(this.user);
    }
  },
  methods: {
    onLogin(user) {
      window.localStorage.setItem('user', user);
      this.login(user)
      this.user = user;
    }
  }
}
</script>

<style>
#app {
  font-family: 'proxima-nova', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #555;
  box-sizing: border-box;
}
*, *:before, *:after {
  box-sizing: inherit;
}

body {
  margin: 0;
}

</style>
