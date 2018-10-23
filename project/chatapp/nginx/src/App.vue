<template>
  <div id="app">
    <header>
    <h1>Teahouse 🍵</h1>
    </header>
    <nickname @nickname="onNicknameGiven" v-if="!nick"/>
    <chat v-else/>
  </div>
</template>

<script>
import Chat from './components/Chat.vue'
import Nickname from './components/Nickname.vue'

export default {
  name: 'app',
  components: {
    Chat,
    Nickname
  },
  data() {
    return {
      nick: window.localStorage.getItem('nick')
    }
  },
  methods: {
    onNicknameGiven(nick) {
      window.localStorage.setItem('nick', nick);
      this.nick = nick;
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
ul {
    display: flex;
    justify-content: flex-end;
    flex-direction: column;
    margin: 0;
    text-align: right;
  }
  li {
    display: inline-block;
  }
  h5 {
    margin: 0.5rem 0 0 0;
    font-size: 2rem;
  }

</style>
