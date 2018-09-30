<template>
  <div id="app">
    <header>
    <h1>Teahouse 🍵</h1>
    </header>
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

header {
    background-color: #f04e30;
    padding: 3vh;
    margin-bottom: 2vh;
    color: white;
  }
 h1 {
     font-weight: 200;
     margin: 0;
  }
button {
    border: none;
    background-color: #e73b2b;
    color: white;
    padding: 1.5vh 1vw;
    text-transform: uppercase;
    cursor: pointer;
  }
  button[disabled] {
    background-color: #fad7d4;
  }
</style>
