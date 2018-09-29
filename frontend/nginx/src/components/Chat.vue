<template>
  <div>
    <header>
    <h1>Teahouse 🍵</h1>
    </header>
    <div class="flex">
      <div class="chat">
        <ul class="chat-message-area">
          <li :key="index" v-for="(message, index) in messages"> 
            <h5>{{ message.user }} {{  message.timestamp | formatDate }}</h5>
            <span>{{ message.msg }}</span>
             </li>
        </ul>
        <div class="input-area">
         <picker v-show="pickEmojiOpen" @select="addEmoji" :style="{ position: 'absolute', 'z-index': 10 }" />
         <input ref="input" @keyup.enter="send" /> 
         <span @click="openEmoji" class="open-emoji-picker">💩</span>
         <button :disabled="disableInput" @click="send">Send</button>
        </div>
      </div>
      <div class="users">
        <h2>Users</h2>
        <ul>
          <li :key="index" v-for="(user, index) in users"> {{ user }} </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import parse from 'date-fns/parse'
import format from 'date-fns/format'
import { Picker } from 'emoji-mart-vue'

export default {
  props: {
    user: String
  },
  components: {
    Picker
  },
  data() {
    return {
      messages: [],
      users: [],
      disableInput: false,
      pickEmojiOpen: false
    }
  },
  mounted() {  
    this.listenToChat(msg => this.messages.push(msg));
    this.onWsStateChange(closed => this.disableInput = closed);
    this.listenToUsers(msg => this.users = msg);
  },
  methods: {
    send() {
      this.sendToChat(this.$refs.input.value)
      this.$refs.input.value = '';
    },
    addEmoji(emoji){
      this.$refs.input.value = this.$refs.input.value+emoji.native;
      this.pickEmojiOpen = false;
    },
    openEmoji() {
      this.pickEmojiOpen = true;
    }
  },
  filters: {
    formatDate(value) {
      if (!value) {
        return '';
      }
     return format(parse(value),'HH:mm')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .flex {
    display: flex;
  }

  ul {
    display: flex;
    justify-content: flex-end;
    flex-direction: column;
    margin: 0;
    text-align: right;
   
  }

  .chat-message-area {
    height: 200px;
    overflow: hidden;
  }
  
  .input-area {
    display: flex;
    justify-content: flex-end;
    margin-top: 2rem;
  }

  button {
    margin-left: 1rem;
    border: none;
    background-color: #e73b2b;
    color: white;
    padding: 12px 40px;
    text-transform: uppercase;
    cursor: pointer;
  }

  input {
    width: 40%;
    font-size: 1.4rem;
  }

  .chat {
    width: 70%;
    display: flex;
    flex-direction: column;
  }

  .users {
    width: 25%;
    margin-left: 5%;
    padding: 0 2rem;
  }

  .users h2 {
    margin-top: 0;
    font-weight: 200;
    color: #555;
  }

  li {
    display: inline-block;
  }

  h1 {
     font-weight: 200;
  }

  h5 {
    margin: 0.5rem 0 0 0;
  }

  header {
    background-color: #f04e30;
    padding: 2rem;
    margin-bottom: 1rem;
    color: white;
  }

  .open-emoji-picker {
    position: absolute;
    margin-left: -126px;
    cursor: pointer;
  }

</style>
